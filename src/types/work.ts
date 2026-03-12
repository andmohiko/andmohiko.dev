// Markdownファイルのfront-matter型
export type MarkdownWorkFrontMatter = {
  id: string
  title: string
  description: string
  publishAt: string
  tags: string[]
  link?: string
  thumbnail: string // 相対パス: "./images/thumbnail.png"
}

// Work型（Markdownベース）
export type Work = {
  id: string
  slug: string
  title: string
  description: string
  publishAt: string
  tags: string[]
  link?: string
  thumbnail: {
    url: string // 絶対パス: "/images/works/{slug}/thumbnail.png"
    width: number
    height: number
  }
  body: string // Markdown本文
  source: 'markdown'
}

// 後方互換性のためのエイリアス
export type MarkdownWork = Work
