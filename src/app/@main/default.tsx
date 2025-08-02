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
import { getAllWorks } from '@/lib/microcms'
import {
  getAllAggregatedBlogs,
  convertToBlogArray,
} from '@/lib/blog-aggregator'
import styles from './blogs/style.module.css'
import { DefaultContainer } from './components/default-container'

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
  const aggregatedBlogs = await getAllAggregatedBlogs()
  const blogs = convertToBlogArray(aggregatedBlogs)
  const works = await getAllWorks()

  return (
    <main className={styles.blogListMain}>
      <DefaultContainer works={works} blogs={blogs} />
    </main>
  )
}

export default MainDefault
