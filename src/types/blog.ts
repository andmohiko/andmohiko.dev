export type ContentfulBlog = {
  metadata: {
    tags: string[]
  }
  sys: {
    id: string
  }
  fields: {
    body: string
    description: string
    headerImage?: {
      fields: {
        file: {
          url: string
        }
      }
    }
    publishedAt: string
    slug: string
    title: string
  }
}

export type Blog = {
  body?: string
  description?: string
  headerImageUrl?: string
  id: string
  media?: string
  publishedAt: string
  slug?: string
  title: string
  url?: string
}
