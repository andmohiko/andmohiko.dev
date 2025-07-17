/**
 * ブログ詳細通常ルートページコンポーネント
 *
 * 直接URLアクセス時（例：/blogs/my-first-post）に
 * @modalスロットで表示されるブログ詳細ページです。
 *
 * 主な仕様：
 * - 直接URLアクセス時のブログ詳細表示
 * - Intercepting Routesと同じコンテンツを表示
 * - 右カラムに配置される
 *
 * 制限事項：
 * - Contentfulからのデータ取得が必要
 * - Next.js App RouterのParallel Routesが必要
 */

import React from 'react'
import { BlogContent } from '../../(.)blogs/[slug]/components/blog-content'
import { getBlogById } from '@/lib/contentful'

/**
 * 静的生成の設定
 */
export const dynamic = 'force-static'
export const revalidate = false

/**
 * ページパラメータの型定義
 */
type BlogDetailPageProps = {
  /** ルートパラメータ */
  params: Promise<{
    /** ブログ記事のスラッグ */
    slug: string
  }>
}

/**
 * ブログ詳細通常ルートページコンポーネント
 *
 * @param {BlogDetailPageProps} props - ページのプロパティ
 * @returns {Promise<JSX.Element>} ブログ詳細ページ
 */
const BlogDetailPage: React.FC<BlogDetailPageProps> = async ({ params }) => {
  const param = await params
  const slug = (param.slug as string) || ''
  const { blog, previousSlug, nextSlug } = await getBlogById(slug)

  return blog ? (
    <BlogContent blog={blog} previousSlug={previousSlug} nextSlug={nextSlug} />
  ) : (
    <div>loading...</div>
  )
}

export default BlogDetailPage
