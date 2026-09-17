import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { invokeCli, verifySubscription } from '../lib/local-cli'

test('Codex structured result is read from its result file, not diagnostic stdout', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'docs-cli-test-'))
  try {
    const executable = join(dir, 'codex-fixture')
    await writeFile(
      executable,
      `#!/usr/bin/env node
const fs=require('fs');const args=process.argv.slice(2);
if(!args.includes('--ignore-user-config') || !args.includes('forced_login_method="chatgpt"'))process.exit(8);
if(process.env.OPENAI_API_KEY)process.exit(9);
let input='';process.stdin.on('data',c=>input+=c);process.stdin.on('end',()=>{
 if(!input.includes('Hello'))process.exit(10);
 fs.writeFileSync(args[args.indexOf('--output-last-message')+1],JSON.stringify({translations:[{id:'0',text:'Bonjour'}]}));
 console.log('diagnostic, not JSON');
});`,
      { mode: 0o755 },
    )
    assert.deepEqual(
      await invokeCli('codex', { '0': 'Hello' }, 'fr-FR', { executable }),
      { '0': 'Bonjour' },
    )
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
})
test('Claude CLI errors fail without publishing partial output', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'docs-cli-test-'))
  try {
    const executable = join(dir, 'claude-fixture')
    await writeFile(
      executable,
      `#!/usr/bin/env node
process.stdin.resume();process.stdin.on('end',()=>{console.log(JSON.stringify({is_error:true,result:'quota exceeded'}))});`,
      { mode: 0o755 },
    )
    await assert.rejects(
      invokeCli('claude', { '0': 'Hello' }, 'fr-FR', { executable }),
      /failed/i,
    )
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
})
test('API-key authentication is rejected by the subscription preflight', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'docs-cli-test-'))
  try {
    const executable = join(dir, 'auth-fixture')
    await writeFile(
      executable,
      `#!/usr/bin/env node
console.log(JSON.stringify({loggedIn:true,authMethod:'api_key',apiProvider:'firstParty'}));`,
      { mode: 0o755 },
    )
    await assert.rejects(
      verifySubscription('claude', executable),
      /subscription/i,
    )
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
})
test('Codex login status on stderr still verifies a ChatGPT subscription', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'docs-cli-test-'))
  try {
    const executable = join(dir, 'codex-auth-fixture')
    await writeFile(
      executable,
      `#!/usr/bin/env node\nconsole.error('Logged in using ChatGPT');`,
      { mode: 0o755 },
    )
    await verifySubscription('codex', executable)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
})
