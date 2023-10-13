import * as contentful from 'contentful'

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

export const getAllBlogPosts = async () => {
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

export const getBlogLatestPosts = async () => {
  const posts = await createContentfulClient()
    .getEntries({
      content_type: import.meta.env.CTF_BLOG_POST_TYPE_ID!,
      order: '-fields.publishedAt',
    })
    .then((entries) => {
      return {
        posts: entries.items.slice(0, 3),
      }
    })
    .catch(console.error)
  return posts.posts
}
