import contentful from 'contentful'
import type { ContentfulBlog } from '~/types/blog'

const defaultConfig = {
  CTF_SPACE_ID: import.meta.env.CTF_SPACE_ID,
  CTF_CDA_ACCESS_TOKEN: import.meta.env.CTF_CDA_ACCESS_TOKEN,
}

export const createContentfulClient = (config = defaultConfig) => {
  return contentful.createClient({
    space: config.CTF_SPACE_ID!,
    accessToken: config.CTF_CDA_ACCESS_TOKEN!,
  })
}

export const getAllBlogPosts = async (): Promise<Array<ContentfulBlog>> => {
  const posts = await createContentfulClient()
    .getEntries({
      content_type: import.meta.env.CTF_BLOG_POST_TYPE_ID!,
      order: '-fields.publishedAt',
    })
    .then((entries) => {
      return {
        posts: entries.items,
      }
    })
    .catch(console.error)
  return posts.posts
}

export const getBlogById = async (slug: string): Promise<ContentfulBlog> => {
  const posts = await createContentfulClient()
    .getEntries({
      content_type: import.meta.env.CTF_BLOG_POST_TYPE_ID!,
      order: '-fields.publishedAt',
    })
    .then((entries) =>
      entries.items.filter((item) => item.fields.slug === slug),
    )
    .catch(console.error)
  return posts[0]
}
