import { compile } from '@mdx-js/mdx'
import remarkGfm from 'remark-gfm'
export async function compileContent(source: string, filePath = '') {
  const body = source.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/, '')
  return compile(
    { value: body, path: filePath },
    { remarkPlugins: [remarkGfm] },
  )
}
