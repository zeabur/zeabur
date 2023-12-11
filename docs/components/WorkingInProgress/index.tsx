import { useRouter } from 'next/router'

// To make Nextra's custom MDX component style work, we have
// to move what we want to render into a MDX file – which
// made the codebase a bit messy :(
import jp from './jp.mdx'
import zh_TW from './zh_TW.mdx'
import zh_CN from './zh_CN.mdx'
import en_US from './en_US.mdx'

export default function WorkingInProgress() {
  const router = useRouter()

  switch (router.locale) {
    case 'jp':
      return jp()
    case 'zh-TW':
      return zh_TW()
    case 'zh-CN':
      return zh_CN()
    case 'en-US':
    default:
      return en_US()
  }
}
