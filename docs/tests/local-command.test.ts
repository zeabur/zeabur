import test from 'node:test'
import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { tmpdir } from 'node:os'
const exec = promisify(execFile)
const script = resolve('scripts/translate-local.ts')
const tsx = resolve('node_modules/tsx/dist/cli.mjs')
test('command previews without calls, blocks CI writes, and resumes after a failed file', async () => {
  const root = await mkdtemp(join(tmpdir(), 'docs-command-'))
  try {
    await mkdir(join(root, 'pages/en-US'), { recursive: true })
    await mkdir(join(root, 'bin'))
    await writeFile(join(root, 'pages/en-US/a.mdx'), '# Hello\n')
    await writeFile(join(root, 'pages/en-US/b.mdx'), '# World\n')
    const calls = join(root, 'calls')
    await writeFile(
      join(root, 'bin/codex'),
      `#!/usr/bin/env node
const fs=require('fs'), args=process.argv.slice(2);fs.appendFileSync(${JSON.stringify(calls)},args[0]+'\\n');
if(args[0]==='login'){console.error('Logged in using ChatGPT');process.exit(0)}
let text='';process.stdin.on('data',s=>text+=s);process.stdin.on('end',()=>{
 if(text.includes('World'))process.exit(1);
 fs.writeFileSync(args[args.indexOf('--output-last-message')+1],JSON.stringify({translations:[{id:'0',text:'Hola'}]}));
});`,
      { mode: 0o755 },
    )
    const options = {
      cwd: root,
      env: {
        ...process.env,
        CI: 'false',
        PATH: join(root, 'bin') + ':' + process.env.PATH,
      },
    }
    await exec(process.execPath, [tsx, script, '--locales=es-ES'], options)
    await assert.rejects(readFile(calls), { code: 'ENOENT' })
    await assert.rejects(
      exec(process.execPath, [tsx, script, '--locales=es-ES', '--write'], {
        ...options,
        env: { ...options.env, CI: 'true' },
      }),
    )
    await assert.rejects(readFile(calls), { code: 'ENOENT' })
    await assert.rejects(
      exec(
        process.execPath,
        [tsx, script, '--locales=es-ES', '--write'],
        options,
      ),
    )
    assert.equal(
      await readFile(join(root, 'pages/es-ES/a.mdx'), 'utf8'),
      '# Hola\n',
    )
    await assert.rejects(readFile(join(root, 'pages/es-ES/b.mdx')), {
      code: 'ENOENT',
    })
    const report = JSON.parse(
      await readFile(join(root, '.translation-local/.local-run.json'), 'utf8'),
    )
    assert.deepEqual(report.completed, ['es-ES/a.mdx'])
    assert.equal(report.failed[0].key, 'es-ES/b.mdx')
    assert.equal(await readFile(calls, 'utf8'), 'login\nexec\nexec\n')
    await assert.rejects(
      readFile(join(root, '.translation-local/.local-translation.lock')),
      { code: 'ENOENT' },
    )
    const preview = await exec(
      process.execPath,
      [tsx, script, '--locales=es-ES'],
      options,
    )
    assert.ok(preview.stdout.includes('es-ES/b.mdx'))
    assert.ok(!preview.stdout.includes('es-ES/a.mdx'))
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
