import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import {
  planMissing,
  saveTranslation,
  cliEnvironment,
  parseCliResult,
} from '../lib/local-translation'

test('missing-page plan is driven by English and preserves existing translations', async () => {
  const root = await mkdtemp(join(tmpdir(), 'docs-local-test-'))
  try {
    await mkdir(join(root, 'pages/en-US'), { recursive: true })
    await mkdir(join(root, 'pages/zh-TW'), { recursive: true })
    await writeFile(join(root, 'pages/en-US/a.mdx'), '# Hello\n')
    await writeFile(join(root, 'pages/en-US/b.mdx'), '# World\n')
    await writeFile(
      join(root, 'pages/zh-TW/a.mdx'),
      'Existing human translation',
    )
    await writeFile(join(root, 'pages/zh-TW/orphan.mdx'), 'No English source')
    const jobs = await planMissing(root, ['zh-TW'])
    assert.deepEqual(
      jobs.map((j) => j.key),
      ['zh-TW/b.mdx'],
    )
    assert.equal(
      await readFile(join(root, 'pages/zh-TW/a.mdx'), 'utf8'),
      'Existing human translation',
    )
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
test('only validated prose is saved; English and existing target files cannot be overwritten', async () => {
  const root = await mkdtemp(join(tmpdir(), 'docs-local-test-'))
  try {
    await mkdir(join(root, 'pages/en-US'), { recursive: true })
    const source =
      '# Hello\n\nRead [docs](/server).\n\n```sh\necho hello\n```\n'
    await writeFile(join(root, 'pages/en-US/index.mdx'), source)
    const [job] = await planMissing(root, ['zh-TW'])
    await assert.rejects(saveTranslation(job, {}), /incomplete/i)
    const labels = Object.fromEntries(
      Object.keys(job.labels).map((k) => [k, 'Bonjour']),
    )
    await saveTranslation(job, labels)
    const translated = await readFile(job.output, 'utf8')
    assert.ok(translated.includes('```sh\necho hello\n```'))
    assert.ok(translated.includes('](/server)'))
    assert.equal(await readFile(job.sourcePath, 'utf8'), source)
    await assert.rejects(saveTranslation(job, labels), /exist/i)
    assert.equal(await readFile(job.output, 'utf8'), translated)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
test('the CLI subprocess environment cannot inherit paid API keys or provider overrides', () => {
  const env = cliEnvironment({
    HOME: '/home/test',
    PATH: '/bin',
    OPENAI_API_KEY: 'secret',
    ANTHROPIC_API_KEY: 'secret',
    ANTHROPIC_BASE_URL: 'https://aihub.zeabur.ai',
    CLAUDE_CODE_USE_BEDROCK: '1',
  })
  assert.equal(env.HOME, '/home/test')
  assert.equal(env.PATH, '/bin')
  assert.equal(env.OPENAI_API_KEY, undefined)
  assert.equal(env.ANTHROPIC_API_KEY, undefined)
  assert.equal(env.ANTHROPIC_BASE_URL, undefined)
  assert.equal(env.CLAUDE_CODE_USE_BEDROCK, undefined)
})
test('CLI failures and incomplete structured output are rejected', () => {
  assert.throws(
    () =>
      parseCliResult(
        'claude',
        JSON.stringify({ is_error: true, result: 'quota exhausted' }),
        { '0': 'Hello' },
      ),
    /failed/i,
  )
  assert.throws(
    () =>
      parseCliResult('codex', JSON.stringify({ translations: [] }), {
        '0': 'Hello',
      }),
    /incomplete/i,
  )
  assert.deepEqual(
    parseCliResult(
      'claude',
      JSON.stringify({
        is_error: false,
        structured_output: { translations: [{ id: '0', text: 'Bonjour' }] },
      }),
      { '0': 'Hello' },
    ),
    { '0': 'Bonjour' },
  )
})
test('source changes during generation prevent publishing an obsolete translation', async () => {
  const root = await mkdtemp(join(tmpdir(), 'docs-local-test-'))
  try {
    await mkdir(join(root, 'pages/en-US'), { recursive: true })
    await writeFile(join(root, 'pages/en-US/index.mdx'), '# Hello\n')
    const [job] = await planMissing(root, ['zh-TW'])
    await writeFile(job.sourcePath, '# Changed\n')
    await assert.rejects(
      saveTranslation(job, { '0': 'Bonjour' }),
      /English source changed/,
    )
    await assert.rejects(readFile(job.output), { code: 'ENOENT' })
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
test('native keychain login retains the OS user identity while removing API credentials', () => {
  const env = cliEnvironment({
    HOME: '/home/employee',
    PATH: '/bin',
    USER: 'employee',
    LOGNAME: 'employee',
    ANTHROPIC_API_KEY: 'not-forwarded',
  })
  assert.equal(env.USER, 'employee')
  assert.equal(env.LOGNAME, 'employee')
  assert.equal(env.ANTHROPIC_API_KEY, undefined)
})
test('Claude event-list output uses the terminal result and rejects failed runs', () => {
  const success = {
    type: 'result',
    subtype: 'success',
    is_error: false,
    structured_output: { translations: [{ id: '0', text: 'Bonjour' }] },
  }
  assert.deepEqual(
    parseCliResult('claude', JSON.stringify([{ type: 'system' }, success]), {
      '0': 'Hello',
    }),
    { '0': 'Bonjour' },
  )
  assert.throws(
    () =>
      parseCliResult(
        'claude',
        JSON.stringify([
          success,
          { type: 'result', subtype: 'error_max_turns', is_error: true },
        ]),
        { '0': 'Hello' },
      ),
    /failed/i,
  )
})
