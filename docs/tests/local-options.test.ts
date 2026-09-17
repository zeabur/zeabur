import test from 'node:test'
import assert from 'node:assert/strict'
import { localOptions } from '../lib/local-options'
test('default command is a preview; generation is explicitly bounded', () => {
  const preview = localOptions([], {})
  assert.equal(preview.write, false)
  assert.equal(preview.limit, 10)
  const run = localOptions(
    ['--provider=claude', '--locales=zh-TW,ja-JP', '--limit=2', '--write'],
    {},
  )
  assert.equal(run.provider, 'claude')
  assert.equal(run.limit, 2)
  assert.deepEqual(run.locales, ['zh-TW', 'ja-JP'])
  assert.equal(run.write, true)
})
test('CI permits planning but cannot launch a subscription session', () => {
  assert.equal(localOptions(['--dry-run'], { CI: 'true' }).write, false)
  assert.throws(() => localOptions(['--write'], { CI: 'true' }), /CI/)
})
test('bad options cannot accidentally select every locale or an unbounded run', () => {
  for (const args of [
    ['--limit=0'],
    ['--limit=no'],
    ['--provider=api'],
    ['--locales=en-US'],
    ['--locale=zh-TW'],
    ['--write', '--dry-run'],
    ['--all', '--limit=3'],
  ])
    assert.throws(() => localOptions(args, {}))
})
