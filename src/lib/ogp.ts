/**
 * OGP情報取得ユーティリティ
 *
 * ビルド時にURLからOpen Graph Protocol情報を取得する
 */

export type OgpData = {
  url: string
  title: string
  description: string
  image: string
  siteName: string
  favicon: string
}

/**
 * HTMLからmetaタグのcontent属性を抽出
 */
const extractMetaContent = (
  html: string,
  property: string,
): string => {
  // property="og:title" または name="description" に対応
  const patterns = [
    new RegExp(
      `<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']*)["']`,
      'i',
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']*)["'][^>]+(?:property|name)=["']${property}["']`,
      'i',
    ),
  ]

  for (const pattern of patterns) {
    const match = html.match(pattern)
    if (match?.[1]) {
      return match[1]
    }
  }
  return ''
}

/**
 * HTMLからtitleタグの内容を抽出
 */
const extractTitle = (html: string): string => {
  const match = html.match(/<title[^>]*>([^<]*)<\/title>/i)
  return match?.[1] ?? ''
}

/**
 * URLからファビコンURLを生成
 */
const getFaviconUrl = (url: string): string => {
  try {
    const { origin } = new URL(url)
    return `https://www.google.com/s2/favicons?domain=${origin}&sz=32`
  } catch {
    return ''
  }
}

/**
 * URLからOGP情報を取得
 */
export const fetchOgp = async (url: string): Promise<OgpData> => {
  const fallback: OgpData = {
    url,
    title: new URL(url).hostname,
    description: '',
    image: '',
    siteName: '',
    favicon: getFaviconUrl(url),
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'bot',
      },
    })
    clearTimeout(timeoutId)

    if (!response.ok) {
      console.warn(`OGP取得スキップ (HTTP ${response.status}): ${url}`)
      return fallback
    }

    const html = await response.text()

    const title =
      extractMetaContent(html, 'og:title') || extractTitle(html)
    const description =
      extractMetaContent(html, 'og:description') ||
      extractMetaContent(html, 'description')
    const rawImage = extractMetaContent(html, 'og:image')
    const image = rawImage && !rawImage.startsWith('http')
      ? new URL(rawImage, url).href
      : rawImage
    const siteName = extractMetaContent(html, 'og:site_name')
    const favicon = getFaviconUrl(url)

    if (!title) {
      console.warn(`OGP取得スキップ (タイトルなし): ${url}`)
      return fallback
    }

    return { url, title, description, image, siteName, favicon }
  } catch {
    console.warn(`OGP取得スキップ: ${url}`)
    return fallback
  }
}

/**
 * Markdown本文内の単独行URLからOGP情報を取得し、
 * data-ogp属性付きのカスタムHTMLに変換する
 *
 * 対象:
 * - 単独行URL: https://example.com（前後に他のテキストがない行）
 * - 単独行のMarkdownリンク: [テキスト](https://example.com)（行全体がリンクのみの場合）
 *
 * 対象外:
 * - 文中のインラインリンク（文脈が崩れるため）
 */
export const embedOgpInMarkdown = async (
  markdown: string,
): Promise<string> => {
  const urls = new Set<string>()

  const lines = markdown.split('\n')
  for (const line of lines) {
    const trimmed = line.trim()

    // 単独行URL
    if (/^https?:\/\/\S+$/.test(trimmed)) {
      urls.add(trimmed)
      continue
    }

    // 単独行のMarkdownリンク: [テキスト](URL) のみで構成される行
    const standaloneLinkMatch = trimmed.match(
      /^\[([^\]]*)\]\((https?:\/\/[^)]+)\)$/,
    )
    if (standaloneLinkMatch) {
      urls.add(standaloneLinkMatch[2])
    }
  }

  if (urls.size === 0) return markdown

  // 全URLのOGP情報を並行取得
  const ogpResults = await Promise.all(
    Array.from(urls).map(async (url) => {
      const ogp = await fetchOgp(url)
      return { url, ogp }
    }),
  )

  const ogpMap = new Map<string, OgpData>()
  for (const { url, ogp } of ogpResults) {
    ogpMap.set(url, ogp)
  }

  let result = markdown

  // 単独行URLをリンクカードHTMLに変換
  result = result.replace(/^(https?:\/\/\S+)$/gm, (_, url) => {
    const ogp = ogpMap.get(url)
    if (!ogp) return url
    return buildLinkCardHtml(ogp)
  })

  // 単独行のMarkdownリンクをリンクカードHTMLに変換
  result = result.replace(
    /^\[([^\]]*)\]\((https?:\/\/[^)]+)\)$/gm,
    (original, _text, url) => {
      const ogp = ogpMap.get(url)
      if (!ogp) return original
      return buildLinkCardHtml(ogp)
    },
  )

  return result
}

/**
 * OGPデータからリンクカードHTMLを生成
 */
const buildLinkCardHtml = (ogp: OgpData): string => {
  const escapedTitle = escapeHtml(ogp.title)
  const escapedDescription = escapeHtml(ogp.description)
  const escapedSiteName = escapeHtml(ogp.siteName)
  const escapedUrl = escapeHtml(ogp.url)
  const escapedImage = escapeHtml(ogp.image)
  const escapedFavicon = escapeHtml(ogp.favicon)

  return `<div data-ogp-card="true" data-ogp-url="${escapedUrl}" data-ogp-title="${escapedTitle}" data-ogp-description="${escapedDescription}" data-ogp-image="${escapedImage}" data-ogp-site-name="${escapedSiteName}" data-ogp-favicon="${escapedFavicon}"></div>`
}

const escapeHtml = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
