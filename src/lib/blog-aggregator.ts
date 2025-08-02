/**
 * ブログ統合取得ライブラリ
 *
 * 概要：
 * - Contentful、microCMS、サブモジュールからブログデータを統合取得
 * - 統一されたBlog型でデータを返す
 * - 個別記事の取得とナビゲーション情報の提供
 *
 * 制限事項：
 * - ビルド時のみ実行可能
 * - エラー処理はソース別に実装
 */
import {
  getAllBlogPosts,
  getBlogById as getContentfulBlogById,
} from '@/lib/contentful'
import { getAllEntries } from '@/lib/microcms'
import {
  getSubmoduleBlogPosts,
  getSubmoduleBlogBySlug,
} from '@/lib/submodule-content'
import type { Blog, ContentfulBlog } from '@/types/blog'
import dayjs from 'dayjs'

/**
 * 統合ブログデータ型定義
 * Contentfulブログとサブモジュールブログの情報を含む
 */
export type AggregatedBlog = Blog & {
  source: 'contentful' | 'submodule' | 'microcms'
  originalData?: ContentfulBlog
}

/**
 * すべてのソースからブログ記事を取得し統合
 *
 * @returns 統合されたブログ記事の配列
 */
export const getAllAggregatedBlogs = async (): Promise<AggregatedBlog[]> => {
  try {
    // 並行処理ですべてのソースからデータを取得
    const [contentfulPosts, microcmsEntries, submoduleBlogs] =
      await Promise.all([
        getAllBlogPosts().catch((error) => {
          console.error(
            'Contentfulからのブログ取得でエラーが発生しました:',
            error,
          )
          return []
        }),
        getAllEntries().catch((error) => {
          console.error(
            'microCMSからのエントリ取得でエラーが発生しました:',
            error,
          )
          return []
        }),
        getSubmoduleBlogPosts().catch((error) => {
          console.error(
            'サブモジュールからのブログ取得でエラーが発生しました:',
            error,
          )
          return []
        }),
      ])

    // Contentfulブログを統合形式に変換
    const contentfulBlogs: AggregatedBlog[] = contentfulPosts.map((post) => ({
      body: post.fields.body,
      description: post.fields.description,
      headerImageUrl: post.fields.headerImage?.fields.file.url,
      id: post.sys.id,
      publishedAt: post.fields.publishedAt,
      slug: post.fields.slug,
      title: post.fields.title,
      url: undefined,
      source: 'contentful' as const,
      originalData: post,
    }))

    // microCMSエントリを統合形式に変換
    const microcmsBlogs: AggregatedBlog[] = microcmsEntries.map((entry) => ({
      body: undefined,
      description: undefined,
      headerImageUrl: undefined,
      id: entry.id,
      media: entry.media,
      publishedAt: entry.publishAt,
      slug: undefined,
      title: entry.title,
      url: entry.link,
      source: 'microcms' as const,
    }))

    // サブモジュールブログを統合形式に変換
    const submoduleAggregatedBlogs: AggregatedBlog[] = submoduleBlogs.map(
      (blog) => ({
        ...blog,
        source: 'submodule' as const,
      }),
    )

    // すべてのブログを統合してソート
    const allBlogs = [
      ...contentfulBlogs,
      ...microcmsBlogs,
      ...submoduleAggregatedBlogs,
    ]

    return allBlogs.sort((a, b) =>
      dayjs(a.publishedAt).isBefore(dayjs(b.publishedAt)) ? 1 : -1,
    )
  } catch (error) {
    console.error('ブログ統合取得でエラーが発生しました:', error)
    return []
  }
}

/**
 * スラッグによる特定のブログ記事取得（全ソース対応）
 *
 * @param slug - 記事のスラッグ
 * @returns 記事データとナビゲーション情報
 */
export const getAggregatedBlogBySlug = async (
  slug: string,
): Promise<{
  blog: Blog | null
  previousSlug: string | undefined
  nextSlug: string | undefined
}> => {
  try {
    // まずサブモジュールから検索
    const submoduleResult = await getSubmoduleBlogBySlug(slug)
    if (submoduleResult.blog) {
      // サブモジュールで見つかった場合、純粋なBlog型として返す
      return {
        blog: submoduleResult.blog,
        previousSlug: submoduleResult.previousSlug,
        nextSlug: submoduleResult.nextSlug,
      }
    }

    // サブモジュールで見つからなかった場合はContentfulから検索
    const contentfulResult = await getContentfulBlogById(slug)
    if (contentfulResult.blog) {
      const blogData: Blog = {
        body: contentfulResult.blog.fields.body,
        description: contentfulResult.blog.fields.description,
        headerImageUrl:
          contentfulResult.blog.fields.headerImage?.fields.file.url,
        id: contentfulResult.blog.sys.id,
        publishedAt: contentfulResult.blog.fields.publishedAt,
        slug: contentfulResult.blog.fields.slug,
        title: contentfulResult.blog.fields.title,
        url: undefined,
      }

      return {
        blog: blogData,
        previousSlug: contentfulResult.previousSlug,
        nextSlug: contentfulResult.nextSlug,
      }
    }

    // どちらからも見つからなかった場合
    return {
      blog: null,
      previousSlug: undefined,
      nextSlug: undefined,
    }
  } catch (error) {
    console.error(
      `統合ブログ個別取得でエラーが発生しました (slug: ${slug}):`,
      error,
    )
    return {
      blog: null,
      previousSlug: undefined,
      nextSlug: undefined,
    }
  }
}

/**
 * 統合ブログから通常のBlog型配列に変換
 *
 * @param aggregatedBlogs - 統合ブログの配列
 * @returns Blog型の配列
 */
export const convertToBlogArray = (
  aggregatedBlogs: AggregatedBlog[],
): Blog[] => {
  return aggregatedBlogs.map(
    ({ source: _source, originalData: _originalData, ...blog }) => blog,
  )
}
