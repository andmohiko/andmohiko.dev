/**
 * @mainスロット用デフォルトページ
 *
 * このコンポーネントは、@mainスロットでルートがマッチしない場合に
 * 表示されるフォールバックページです。
 * ブログ詳細URLに直接アクセスした場合などに、ブログ一覧を表示します。
 *
 * 主な仕様：
 * - Parallel Routesのフォールバック表示
 * - ブログ一覧コンポーネントを表示
 * - ブログ詳細URL直接アクセス時の対応
 *
 * 制限事項：
 * - Next.js App RouterのParallel Routesが必要
 * - ContentfulとmicroCMSからのデータ取得が必要
 */

import React from 'react'
import { getAllBlogPosts } from '@/lib/contentful'
import { BlogList } from './blogs/components/blog-list'
import { getAllEntries } from '@/lib/microcms'
import { Blog } from '@/types/blog'
import dayjs from 'dayjs'
import styles from './blogs/style.module.css'

/**
 * 静的生成の設定
 * ビルド時にContentfulからデータを取得して静的ページを生成
 */
export const dynamic = 'force-static'
export const revalidate = false

/**
 * メインスロットのデフォルトコンポーネント
 * ブログ一覧を表示する
 *
 * @returns {Promise<React.ReactElement>} ブログ一覧ページ
 */
const MainDefault: React.FC = async () => {
  const posts = await getAllBlogPosts()
  const microcmsEntries = await getAllEntries()

  const contentfulBlogs: Blog[] = posts.map((post) => ({
    body: post.fields.body,
    description: post.fields.description,
    headerImageUrl: post.fields.headerImage?.fields.file.url,
    id: post.sys.id,
    publishedAt: post.fields.publishedAt,
    slug: post.fields.slug,
    title: post.fields.title,
    url: undefined,
  }))
  const entries: Blog[] = microcmsEntries.map((entry) => ({
    body: undefined,
    description: undefined,
    headerImageUrl: undefined,
    id: entry.id,
    media: entry.media,
    publishedAt: entry.publishAt,
    slug: undefined,
    title: entry.title,
    url: entry.link,
  }))

  const blogs = [...contentfulBlogs, ...entries].sort((a, b) =>
    dayjs(a.publishedAt).isBefore(dayjs(b.publishedAt)) ? 1 : -1,
  )

  return (
    <div className={styles.blogListPage}>
      <main className={styles.blogListMain}>
        <BlogList blogs={blogs} />
      </main>
    </div>
  )
}

export default MainDefault
