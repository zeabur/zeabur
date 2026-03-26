import { GoogleGenAI } from '@google/genai'

// Uses Zeabur AI Hub as proxy — set GOOGLE_GENAI_API_KEY env var
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY || '' })

const LOCALE_INSTRUCTIONS: Record<string, string> = {
  'zh-TW': 'Translate to Traditional Chinese (繁體中文). Use Taiwan-standard terminology.',
  'zh-CN': 'Translate to Simplified Chinese (简体中文). Use mainland China terminology.',
  'ja-JP': 'Translate to Japanese (日本語). Use polite/formal register (です/ます).',
  'es-ES': 'Translate to European Spanish (Español).',
  'ko-KR': 'Translate to Korean (한국어). Use formal register (합니다/습니다).',
  'id-ID': 'Translate to Indonesian (Bahasa Indonesia).',
  'th-TH': 'Translate to Thai (ภาษาไทย).',
  'fr-FR': 'Translate to French (Français). Use formal "vous" form.',
  'de-DE': 'Translate to German (Deutsch). Use formal "Sie" form.',
  'it-IT': 'Translate to Italian (Italiano).',
  'ar-SA': 'Translate to Arabic (العربية). Preserve RTL text direction. Use Modern Standard Arabic.',
  'pt-BR': 'Translate to Brazilian Portuguese (Português do Brasil).',
  'vi-VN': 'Translate to Vietnamese (Tiếng Việt).',
  'hi-IN': 'Translate to Hindi (हिन्दी). Use Devanagari script.',
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
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `${instruction}\n\nTranslate the following MDX document:\n\n${content}`,
            },
          ],
        },
      ],
      config: {
        temperature: 0.1,
        systemInstruction: SYSTEM_PROMPT,
      },
    })

    const text = response.text?.trim() || ''

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

export { TARGET_LOCALES }
