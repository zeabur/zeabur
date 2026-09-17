import { createProcessor } from '@mdx-js/mdx'
import remarkGfm from 'remark-gfm'
import { parseDocument } from 'yaml'
import { createHash } from 'node:crypto'

export interface Segment {
  start: number
  end: number
  text: string
  yaml?: boolean
}
export const digest = (value: string) =>
  createHash('sha256').update(value).digest('hex')
export function translationCurrent(
  sourceHash: string,
  output: string,
  entry?: { source: string; output: string },
): boolean {
  return (
    !!output && entry?.source === sourceHash && entry?.output === digest(output)
  )
}

/** Translate prose only. Syntax, examples, imports, paths and component props remain source-owned. */
export function extractSegments(source: string): Segment[] {
  const segments: Segment[] = []
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)
  let body = source
  let offset = 0
  if (frontmatter) {
    const doc = parseDocument(frontmatter[1])
    if (doc.errors.length) throw new Error('Invalid English frontmatter')
    for (const key of [
      'title',
      'description',
      'ogImageTitle',
      'ogImageSubtitle',
    ]) {
      const node = doc.get(key, true) as any
      if (node?.range && typeof node.value === 'string')
        segments.push({
          start: source.indexOf('\n') + 1 + node.range[0],
          end: source.indexOf('\n') + 1 + node.range[1],
          text: node.value,
          yaml: true,
        })
    }
    offset = frontmatter[0].length
    body = source.slice(offset)
  }
  const tree = createProcessor({ remarkPlugins: [remarkGfm] }).parse(body)
  function walk(node: any) {
    if (node.type === 'text' && node.value.trim()) {
      segments.push({
        start: offset + node.position.start.offset,
        end: offset + node.position.end.offset,
        text: node.value,
      })
    }
    for (const child of node.children || []) walk(child)
  }
  walk(tree)
  return segments.sort((a, b) => a.start - b.start)
}
export function applySegments(
  source: string,
  segments: Segment[],
  values: Record<string, string>,
): string {
  if (
    Object.keys(values).some(
      (k) => !/^\d+$/.test(k) || Number(k) >= segments.length,
    )
  )
    throw new Error('Unexpected translation key')
  if (
    segments.some((_, i) => typeof values[i] !== 'string' || !values[i].trim())
  )
    throw new Error('Incomplete translation: missing text')
  let result = source
  for (let i = segments.length - 1; i >= 0; i--) {
    const segment = segments[i]
    // Escape Markdown/MDX control characters: model output is plain text, not executable MDX.
    const original = source.slice(segment.start, segment.end)
    const prose = values[i]
      .trim()
      .replace(/([\\`*_{}\[\]<>|#!])/g, '\\$1')
      .replace(/\r?\n/g, ' ')
    const translated = segment.yaml
      ? JSON.stringify(values[i])
      : (original.match(/^\s*/)?.[0] || '') +
        prose +
        (original.match(/\s*$/)?.[0] || '')
    result =
      result.slice(0, segment.start) + translated + result.slice(segment.end)
  }
  extractSegments(result) // Reject invalid MDX/frontmatter before overwriting an existing translation.
  return result
}
