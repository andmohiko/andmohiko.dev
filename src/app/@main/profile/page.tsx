/**
 * プロフィールページコンポーネント
 *
 * このコンポーネントでは以下の機能を提供します：
 * - プロフィール情報の表示
 * - ライフイベントタイムラインの表示
 * - 静的サイト生成によるパフォーマンス最適化
 * - コンテンツページネーター機能
 *
 * 主な仕様：
 * - ビルド時に静的ページを生成
 * - CDN配信による高速表示
 * - レスポンシブデザイン対応
 *
 * 制限事項：
 * - Next.js App RouterのParallel Routesが必要
 * - ランタイムでのデータ更新なし
 */

import { Metadata } from 'next'
import styles from './style.module.css'
import { ProfileContent } from './components/profile-content'
import { ContentPaginator } from '@/components/navigation/content-paginator'
import { LifeEventsTimeline } from './components/life-events-timeline'

/**
 * ページメタデータの設定
 */
export const metadata: Metadata = {
  title: 'Profile',
  description: 'andmohikoのプロフィールと人生年表',
  openGraph: {
    title: 'Profile | andmohiko.dev',
    description: 'andmohikoのプロフィールと人生年表',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Profile | andmohiko.dev',
    description: 'andmohikoのプロフィールと人生年表',
    creator: '@andmohiko',
  },
}

/**
 * 静的生成の設定
 * ビルド時に静的ページを生成
 */
export const dynamic = 'force-static'
export const revalidate = false

export default async function ProfilePage() {
  return (
    <main className={styles.profileMain}>
      <ProfileContent />
      <LifeEventsTimeline />
      <ContentPaginator
        previousLabel="blog"
        nextLabel="work"
        previousSlug="/blogs"
        nextSlug="/"
      />
    </main>
  )
}
