// microCMS版のWork型
export type Work = {
  id: string
  body: string
  description: string
  link: string
  publishAt: string
  tags: string[]
  thumbnail: {
    height: number
    url: string
    width: number
  }
  title: string
}

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

// Markdown版のWork型
export type MarkdownWork = {
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

// microCMS版にsourceフィールドを追加した型
export type WorkWithSource = Work & {
  source: 'microcms'
}

// 統合されたWork型（どちらのソースからでも使える）
export type AggregatedWork = WorkWithSource | MarkdownWork
