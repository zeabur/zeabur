import { importPage } from 'nextra/pages'
import { useMDXComponents } from '../../../mdx-components'

const { wrapper: Wrapper, ...components } = useMDXComponents()

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
  const result = await importPage(params.mdxPath)
  const { default: MDXContent, toc, metadata, sourceCode } = result

  return (
    <Wrapper toc={toc} metadata={metadata} sourceCode={sourceCode}>
      <MDXContent {...components} />
    </Wrapper>
  )
}
