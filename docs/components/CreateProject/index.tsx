import { useRouter } from 'nextra/hooks'

import EnUS from './en_US.mdx'
import ZhCN from './zh_CN.mdx'
import ZhTW from './zh_TW.mdx'
import JaJP from './ja_JP.mdx'

export default function CreateProject() {
  const router = useRouter()

  switch (router.locale) {
    case 'en-US':
      return <EnUS />
    case 'zh-CN':
      return <ZhCN />
    case 'zh-TW':
      return <ZhTW />
    case 'ja-JP':
      return <JaJP />
    default:
      return <EnUS />
  }
}
