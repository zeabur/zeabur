import { locales, isValidLocale } from './translation-locales'
import type { Provider } from './local-translation'
export function localOptions(
  args: string[],
  env: Record<string, string | undefined> = process.env,
) {
  for (const arg of args)
    if (
      !/^(--write|--dry-run|--all|--help|--provider=.+|--locales=.+|--limit=.+|--page=.+)$/.test(
        arg,
      )
    )
      throw new Error(`Unknown option: ${arg}`)
  const value = (name: string) =>
    args.find((a) => a.startsWith(name + '='))?.slice(name.length + 1)
  const provider = value('--provider') || 'codex'
  if (provider !== 'codex' && provider !== 'claude')
    throw new Error('Provider must be codex or claude')
  const requested =
    value('--locales')?.split(',') || locales.filter((l) => l !== 'en-US')
  if (requested.some((l) => !isValidLocale(l) || l === 'en-US'))
    throw new Error('Choose valid target locales; English is the source')
  if (args.includes('--write') && args.includes('--dry-run'))
    throw new Error('Choose --write or --dry-run')
  if (args.includes('--all') && value('--limit'))
    throw new Error('Choose --all or --limit')
  const limit = Number(value('--limit') || 10)
  if (!Number.isSafeInteger(limit) || limit < 1)
    throw new Error('--limit must be a positive integer')
  const write = args.includes('--write')
  if (write && env.CI && !['false', '0'].includes(env.CI.toLowerCase()))
    throw new Error(
      'Translation generation is disabled in CI; use a local subscription session',
    )
  return {
    provider: provider as Provider,
    locales: Array.from(new Set(requested)),
    write,
    limit: args.includes('--all') ? Infinity : limit,
    page: value('--page'),
    help: args.includes('--help'),
  }
}
