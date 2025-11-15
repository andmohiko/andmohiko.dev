/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as contentful from 'contentful'
import type { ContentfulBlog } from '@/types/blog'

/**
 * @description Contentfulのクライアント設定のデフォルト値
 * @property {string} CTF_SPACE_ID - ContentfulのスペースID
 */
const defaultConfig = {
  CTF_SPACE_ID: process.env.NEXT_PUBLIC_CTF_SPACE_ID,
  CTF_CDA_ACCESS_TOKEN: process.env.NEXT_PUBLIC_CTF_CDA_ACCESS_TOKEN,
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
      content_type: process.env.NEXT_PUBLIC_CTF_BLOG_POST_TYPE_ID!,
      // @ts-ignore
      order: '-fields.publishedAt',
    })
    .then((entries) => {
      return {
        posts: entries.items,
      }
    })
    .catch(console.error)
  // @ts-ignore
  return posts.posts
}

// ブログ詳細ページのデータを取得
export const getBlogById = async (
  slug: string,
): Promise<{
  blog: ContentfulBlog
  previousSlug: string | undefined
  nextSlug: string | undefined
}> => {
  const targetBlog = await createContentfulClient()
    .getEntries({
      content_type: process.env.NEXT_PUBLIC_CTF_BLOG_POST_TYPE_ID!,
      // @ts-ignore
      'fields.slug': slug,
      limit: 1,
    })
    .then((entries) => {
      return entries.items[0] as ContentfulBlog | undefined
    })
    .catch(console.error)

  if (!targetBlog) {
    // @ts-ignore
    return {
      blog: undefined,
      previousSlug: undefined,
      nextSlug: undefined,
    }
  }

  const allPosts = await createContentfulClient()
    .getEntries({
      content_type: process.env.NEXT_PUBLIC_CTF_BLOG_POST_TYPE_ID!,
      // @ts-ignore
      order: '-fields.publishedAt',
    })
    .then((entries) => {
      return {
        posts: entries.items,
      }
    })
    .catch(console.error)

  // @ts-ignore
  const posts = allPosts.posts
  const index = posts.findIndex(
    (post: ContentfulBlog) => post.fields.slug === slug,
  )
  const nextSlug = index > 0 ? posts[index - 1].fields.slug : undefined
  const previousSlug =
    index < posts.length - 1 ? posts[index + 1].fields.slug : undefined

  return {
    blog: targetBlog,
    previousSlug,
    nextSlug,
  }
}
