import { useRouter } from 'nextra/hooks'

import JaJP from './ja_JP.mdx'
import ZhTW from './zh_TW.mdx'
import ZhCN from './zh_CN.mdx'
import EnUS from './en_US.mdx'

export default function WorkingInProgress() {
  const router = useRouter()

  switch (router.locale) {
    case 'ja_JP':
      return <JaJP />
    case 'zh-TW':
      return <ZhTW />
    case 'zh-CN':
      return <ZhCN />
    case 'en-US':
    default:
      return <EnUS />
  }
}
