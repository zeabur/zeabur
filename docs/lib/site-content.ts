import { readdir } from 'node:fs/promises'
import { join } from 'node:path'
export async function contentFiles(
  directory: string,
  prefix = '',
): Promise<string[]> {
  const files: string[] = []
  for (const entry of await readdir(join(directory, prefix), {
    withFileTypes: true,
  })) {
    const path = prefix ? `${prefix}/${entry.name}` : entry.name
    if (entry.isDirectory())
      files.push(...(await contentFiles(directory, path)))
    else if (/\.(mdx?|ts)$/.test(path)) files.push(path)
  }
  return files.sort()
}
