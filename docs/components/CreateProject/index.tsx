import { useRouter } from 'nextra/hooks'

import en_US from './en_US.mdx'
import zh_CN from './zh_CN.mdx'
import zh_TW from './zh_TW.mdx'
import ja_JP from './ja_JP.mdx'

export default function CreateProject() {
  const router = useRouter()

  switch (router.locale) {
    case 'en-US':
      return en_US({})
    case 'zh-CN':
      return zh_CN({})
    case 'zh-TW':
      return zh_TW({})
    case 'ja-JP':
      return ja_JP({})
    default:
      return en_US({})
  }
}
