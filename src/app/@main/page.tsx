/**
 * ポートフォリオページ
 *
 * このコンポーネントでは以下の機能を提供します：
 * - メインスロットでのポートフォリオ表示
 * - 静的サイト生成によるパフォーマンス最適化
 * - コンテンツページネーター機能
 *
 * 主な仕様：
 * - ビルド時に静的ページを生成
 * - CDN配信による高速表示
 * - ページネーション機能
 *
 * 制限事項：
 * - Next.js App RouterのParallel Routesが必要
 * - ランタイムでのデータ更新なし
 *
 * @returns {NextPage} ポートフォリオページ
 */

import React from 'react'
import { NextPage } from 'next'
import styles from './page.module.css'
import { ContentPaginator } from '@/components/navigation/content-paginator'

/**
 * 静的生成の設定
 * ビルド時に静的ページを生成
 */
export const dynamic = 'force-static'
export const revalidate = false

const PortfolioPage: NextPage = () => {
  return (
    <main className={styles.mainContent}>
      <h1>ポートフォリオ</h1>
      <ContentPaginator
        previousLabel="profile"
        nextLabel="blog"
        previousSlug="/profile"
        nextSlug="/blogs"
      />
    </main>
  )
}

export default PortfolioPage
