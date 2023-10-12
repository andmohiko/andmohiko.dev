export type Blog = {
  metadata: {
    tags: string[]
  }
  sys: {
    id: string
  }
  fields: {
    body: string
    description: string
    publishedAt: string
    slug: string
    title: string
  }
}
