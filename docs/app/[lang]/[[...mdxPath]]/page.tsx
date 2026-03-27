import { importPage } from 'nextra/pages'
import { compileMDX } from 'next-mdx-remote/rsc'
import { useMDXComponents } from '../../../mdx-components'
import { getTranslatedContent } from '../../../lib/content-resolver'
import { Callout, Steps, Tabs, Cards, FileTree } from 'nextra/components'
import type { Locale } from '../../../lib/i18n/locales'
import type { Heading } from 'nextra'
import remarkGfm from 'remark-gfm'

const { wrapper: Wrapper, ...components } = useMDXComponents()

// All components that MDX files might use via import statements.
// MDXRemote can't resolve imports, so we provide them directly and
// strip import lines from translated source.
const allComponents = {
  ...components,
  Callout,
  Steps,
  Tabs,
  Cards,
  FileTree,
}

/**
 * Strip import statements and frontmatter from MDX source.
 * Returns { body, frontmatter }.
 */
function preprocessMdx(source: string): { body: string; frontmatter: Record<string, string> } {
  let body = source
  const frontmatter: Record<string, string> = {}

  // Extract frontmatter
  const fmMatch = body.match(/^---\n([\s\S]*?)\n---\n?/)
  if (fmMatch) {
    body = body.slice(fmMatch[0].length)
    // Parse simple key: value pairs
    for (const line of fmMatch[1].split('\n')) {
      const colonIdx = line.indexOf(':')
      if (colonIdx > 0) {
        const key = line.slice(0, colonIdx).trim()
        const value = line.slice(colonIdx + 1).trim()
        frontmatter[key] = value
      }
    }
  }

  // Strip import statements
  body = body
    .split('\n')
    .filter((line) => !line.match(/^import\s+.+from\s+['"].+['"]/))
    .join('\n')

  return { body, frontmatter }
}

/**
 * Extract headings from MDX source for table of contents.
 */
function extractToc(source: string): Heading[] {
  const headings: Heading[] = []
  const lines = source.split('\n')
  for (const line of lines) {
    const match = line.match(/^(#{2,6})\s+(.+)$/)
    if (match) {
      const depth = match[1].length as Heading['depth']
      const value = match[2].trim()
      const id = value
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
      headings.push({ depth, value, id })
    }
  }
  return headings
}

export async function generateMetadata(props: {
  params: Promise<{ lang: string; mdxPath?: string[] }>
}) {
  const params = await props.params
  const { metadata } = await importPage(params.mdxPath)
  return metadata
}

export async function generateStaticParams() {
  return []
}

export default async function Page(props: {
  params: Promise<{ lang: string; mdxPath?: string[] }>
}) {
  const params = await props.params
  const locale = params.lang as Locale

  // Always get the English page for metadata and fallback
  const result = await importPage(params.mdxPath)
  const { default: MDXContent, toc, metadata, sourceCode } = result

  // For non-en-US locales, try to serve translated content
  const translatedSource = await getTranslatedContent(params.mdxPath, locale)

  if (translatedSource) {
    const { body } = preprocessMdx(translatedSource)
    const translatedToc = extractToc(body)

    const { content } = await compileMDX({
      source: body,
      components: allComponents,
      options: {
        mdxOptions: {
          remarkPlugins: [remarkGfm],
        },
      },
    })

    return (
      <Wrapper
        toc={translatedToc.length > 0 ? translatedToc : toc}
        metadata={metadata}
        sourceCode={translatedSource}
      >
        {content}
      </Wrapper>
    )
  }

  // Fallback: serve English content
  return (
    <Wrapper toc={toc} metadata={metadata} sourceCode={sourceCode}>
      <MDXContent {...components} />
    </Wrapper>
  )
}
