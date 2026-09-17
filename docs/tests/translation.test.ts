import test from 'node:test'
import assert from 'node:assert/strict'
import {
  extractSegments,
  applySegments,
  translationCurrent,
} from '../lib/translation-integrity'
const source = `---
title: Hello world
description: A useful page
---
import { Callout } from 'nextra/components'

# Hello world

Read [the guide](/docs/server) with \`PORT\`.

<Callout type="info">Some help.</Callout>

\`\`\`python
import os
print('Hello')
\`\`\`
`
test('translation preserves code, import statements, component props and link destinations', () => {
  const segments = extractSegments(source)
  assert.ok(segments.some((s) => s.text === 'Hello world'))
  assert.ok(segments.some((s) => s.text === 'Some help.'))
  assert.ok(
    !segments.some(
      (s) => s.text.includes('import os') || s.text.includes('/docs/server'),
    ),
  )
  const output = applySegments(
    source,
    segments,
    Object.fromEntries(segments.map((s, i) => [String(i), `Traduit ${i}`])),
  )
  assert.ok(output.includes("import { Callout } from 'nextra/components'"))
  assert.ok(output.includes("```python\nimport os\nprint('Hello')\n```"))
  assert.ok(output.includes('](/docs/server)'))
  assert.ok(output.includes('<Callout type="info">'))
})
test('partial and extra translation responses are rejected', () => {
  const segments = extractSegments(source)
  assert.throws(
    () => applySegments(source, segments, {}),
    /missing|incomplete/i,
  )
  const values = Object.fromEntries(segments.map((s, i) => [String(i), s.text]))
  assert.throws(
    () => applySegments(source, segments, { ...values, extra: 'bad' }),
    /unexpected|extra/i,
  )
})
test('cache requires locale-specific source hash, output hash and existing output', () => {
  assert.equal(translationCurrent('new', 'output', undefined), false)
  assert.equal(
    translationCurrent('new', '', { source: 'new', output: 'old' }),
    false,
  )
  assert.equal(
    translationCurrent('new', 'changed', { source: 'old', output: 'old' }),
    false,
  )
})
test('table separators, inline code and list structure stay source-owned', () => {
  const md =
    '| Name | Meaning |\n| --- | --- |\n| `PORT` | Network port |\n\n- First item\n- Second item\n'
  const segments = extractSegments(md)
  assert.ok(!segments.some((s) => s.text.includes('|')))
  const out = applySegments(
    md,
    segments,
    Object.fromEntries(segments.map((s, i) => [String(i), 'Texte'])),
  )
  assert.ok(out.includes('| --- | --- |'))
  assert.ok(out.includes('| `PORT` | Texte |'))
  assert.ok(out.includes('- Texte\n- Texte'))
})
test('prose translation preserves whitespace around inline code and links', () => {
  const md = 'Read [the guide](/server) with `PORT`.\n'
  const segments = extractSegments(md)
  const out = applySegments(
    md,
    segments,
    Object.fromEntries(segments.map((s, i) => [String(i), 'Texte'])),
  )
  assert.ok(out.startsWith('Texte [Texte](/server) Texte `PORT`'))
})
