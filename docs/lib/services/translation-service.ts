import OpenAI from 'openai'

// Uses Zeabur AI Hub (LiteLLM) via OpenAI-compatible API
// Lazy-init so env vars are available (scripts load .env.local before calling)
let _client: OpenAI | null = null
function getClient(): OpenAI {
  if (!_client) {
    _client = new OpenAI({
      apiKey: process.env.GOOGLE_GENAI_API_KEY || '',
      baseURL: process.env.GOOGLE_GENAI_BASE_URL || 'https://hnd1.aihub.zeabur.ai/v1',
    })
  }
  return _client
}

const LOCALE_INSTRUCTIONS: Record<string, string> = {
  'zh-TW': 'Translate to Traditional Chinese (繁體中文). Use Taiwan-standard terminology.',
  'zh-CN': 'Translate to Simplified Chinese (简体中文). Use mainland China terminology.',
  'ja-JP': 'Translate to Japanese (日本語). Use polite/formal register (です/ます).',
  'es-ES': 'Translate to European Spanish (Español).',
  // ── Backlog locales (uncomment when ready) ──
  // 'ko-KR': 'Translate to Korean (한국어). Use formal register (합니다/습니다).',
  // 'id-ID': 'Translate to Indonesian (Bahasa Indonesia).',
  // 'th-TH': 'Translate to Thai (ภาษาไทย).',
  // 'fr-FR': 'Translate to French (Français). Use formal "vous" form.',
  // 'de-DE': 'Translate to German (Deutsch). Use formal "Sie" form.',
  // 'it-IT': 'Translate to Italian (Italiano).',
  // 'ar-SA': 'Translate to Arabic (العربية). Preserve RTL text direction. Use Modern Standard Arabic.',
  // 'pt-BR': 'Translate to Brazilian Portuguese (Português do Brasil).',
  // 'vi-VN': 'Translate to Vietnamese (Tiếng Việt).',
  // 'hi-IN': 'Translate to Hindi (हिन्दी). Use Devanagari script.',
}

const TARGET_LOCALES = Object.keys(LOCALE_INSTRUCTIONS)

const SYSTEM_PROMPT = `You are a professional technical documentation translator. Your task is to translate MDX documentation files while preserving their structure perfectly.

Rules:
1. Preserve ALL Markdown formatting (headings, lists, bold, italic, links, tables)
2. Preserve ALL code blocks exactly as-is — do NOT translate code, CLI commands, or terminal output
3. Preserve ALL MDX/JSX components exactly as-is (e.g., <Callout>, <Steps>, <Tabs>)
4. Preserve ALL frontmatter (YAML between ---) exactly as-is, EXCEPT translate the "title" and "description" fields if present
5. Preserve ALL URLs, file paths, and image references exactly as-is
6. Do NOT translate brand names: Zeabur, GitHub, Docker, Next.js, Nextra, etc.
7. Do NOT translate variable names, environment variable names, or config keys
8. Do NOT add or remove any content — translate what exists
9. Maintain the same line breaks and paragraph structure
10. For technical terms without standard translations, keep the English term with a translation in parentheses on first use

Output ONLY the translated MDX content. No explanations or notes.`

export interface TranslationResult {
  locale: string
  content: string
  success: boolean
  error?: string
}

export async function translateMdx(
  content: string,
  targetLocale: string
): Promise<TranslationResult> {
  const instruction = LOCALE_INSTRUCTIONS[targetLocale]
  if (!instruction) {
    return {
      locale: targetLocale,
      content: '',
      success: false,
      error: `Unsupported locale: ${targetLocale}`,
    }
  }

  try {
    const response = await getClient().chat.completions.create({
      model: process.env.TRANSLATION_MODEL || 'gemini-2.0-flash',
      temperature: 0.1,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `${instruction}\n\nTranslate the following MDX document:\n\n${content}`,
        },
      ],
    })

    const text = response.choices[0]?.message?.content?.trim() || ''

    // Strip markdown code fences if the model wrapped the output
    const cleaned = text.replace(/^```(?:mdx|markdown|md)?\n/, '').replace(/\n```$/, '')

    return {
      locale: targetLocale,
      content: cleaned,
      success: true,
    }
  } catch (error) {
    return {
      locale: targetLocale,
      content: '',
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

export async function translateMdxToAll(
  content: string
): Promise<TranslationResult[]> {
  const results = await Promise.allSettled(
    TARGET_LOCALES.map((locale) => translateMdx(content, locale))
  )

  return results.map((result, i) => {
    if (result.status === 'fulfilled') {
      return result.value
    }
    return {
      locale: TARGET_LOCALES[i],
      content: '',
      success: false,
      error: result.reason?.message || 'Unknown error',
    }
  })
}

/**
 * Translate sidebar _meta labels.
 * Input: { key: "English Label", ... } (only string values — objects like { display: 'hidden' } are skipped)
 * Output: { key: "Translated Label", ... }
 */
export async function translateMeta(
  labels: Record<string, string>,
  targetLocale: string
): Promise<{ success: boolean; labels: Record<string, string>; error?: string }> {
  const instruction = LOCALE_INSTRUCTIONS[targetLocale]
  if (!instruction) {
    return { success: false, labels: {}, error: `Unsupported locale: ${targetLocale}` }
  }

  // Build a simple key=value block for translation
  const entries = Object.entries(labels)
  if (entries.length === 0) {
    return { success: true, labels: {} }
  }

  const inputBlock = entries.map(([k, v]) => `${k}=${v}`).join('\n')

  try {
    const response = await getClient().chat.completions.create({
      model: process.env.TRANSLATION_MODEL || 'gemini-2.0-flash',
      temperature: 0.1,
      messages: [
        {
          role: 'system',
          content: `You translate sidebar navigation labels for a documentation site.
Rules:
- Output ONLY key=value pairs, one per line, in the same order as input
- Translate the value (right side of =) to the target language
- Keep the key (left side of =) exactly as-is
- Do NOT translate brand names: Zeabur, GitHub, Docker, AI Hub, Wonder Mesh, etc.
- Do NOT translate programming language/framework names: Node.js, Python, Go, Java, PHP, etc.
- Keep translations concise — sidebar labels should be short
- Output nothing else — no explanations, no code fences`,
        },
        {
          role: 'user',
          content: `${instruction}\n\n${inputBlock}`,
        },
      ],
    })

    const text = response.choices[0]?.message?.content?.trim() || ''
    const result: Record<string, string> = {}

    for (const line of text.split('\n')) {
      const eqIdx = line.indexOf('=')
      if (eqIdx > 0) {
        const key = line.slice(0, eqIdx).trim()
        const value = line.slice(eqIdx + 1).trim()
        if (key && value) {
          result[key] = value
        }
      }
    }

    return { success: true, labels: result }
  } catch (error) {
    return {
      success: false,
      labels: {},
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

export { TARGET_LOCALES }
