/**
 * メインレイアウトコンポーネント
 *
 * このコンポーネントでは以下の機能を提供します：
 * - Next.js App RouterのParallel Routesを使用した構成
 * - 左カラム：@mainスロット（ブログ・作品一覧）
 * - 右カラム：共通UI（ナビゲーション）
 * - モーダルレイヤー：@modalスロット
 * - グローバルスタイルとメタデータの設定
 *
 * 主な仕様：
 * - レスポンシブデザイン対応
 * - アクセシビリティ対応
 * - SEO最適化
 * - CSS Grid/Flexboxレイアウト
 *
 * 制限事項：
 * - Next.js App Routerが必要
 * - Parallel Routesの構成に依存
 * - モダンブラウザのCSS Grid対応が必要
 */

import React from 'react'
import type { Metadata } from 'next'
import { GlobalNavigation } from '@/components/navigation/GlobalNavigation'
import './globals.css'
import styles from './layout.module.css'

/**
 * サイトメタデータの設定
 */
export const metadata: Metadata = {
  title: {
    default: 'andmohiko.dev - Portfolio & Blog',
    template: '%s | andmohiko.dev',
  },
  description:
    'Frontend Engineer andmohikoのポートフォリオサイト。Web開発の作品とブログを掲載しています。',
  keywords: [
    'Portfolio',
    'Blog',
    'Frontend',
    'React',
    'Next.js',
    'TypeScript',
    'Web Development',
  ],
  authors: [{ name: 'andmohiko' }],
  creator: 'andmohiko',
  publisher: 'andmohiko',
  metadataBase: new URL('https://andmohiko.dev'),
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://andmohiko.dev',
    siteName: 'andmohiko.dev',
    title: 'andmohiko.dev - Portfolio & Blog',
    description: 'Frontend Engineer andmohikoのポートフォリオサイト',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'andmohiko.dev',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'andmohiko.dev - Portfolio & Blog',
    description: 'Frontend Engineer andmohikoのポートフォリオサイト',
    creator: '@andmohiko',
    images: ['/images/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
}

/**
 * ルートレイアウトコンポーネントのプロパティ型
 */
type RootLayoutProps = {
  /** メインコンテンツスロット（Parallel Routes） */
  main: React.ReactNode
  /** モーダルスロット（Parallel Routes） */
  modal: React.ReactNode
  /** 通常の子要素 */
  children: React.ReactNode
}

/**
 * ルートレイアウトコンポーネント
 *
 * @param {RootLayoutProps} props - レイアウトのプロパティ
 * @returns {JSX.Element} ルートレイアウト
 */
const RootLayout: React.FC<RootLayoutProps> = ({ main, modal, children }) => {
  return (
    <html lang="ja">
      <head>
        {/* プリロード・プリフェッチ設定 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* favicon設定 */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* PWA manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* テーマカラー */}
        <meta name="theme-color" content="#3b82f6" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
      </head>

      <body className={styles.body}>
        {/* メインアプリケーション構造 */}
        <div className={styles.container}>
          {/* 左カラム：メインコンテンツ */}
          <main className={styles.mainContent} role="main">
            {main || children}
          </main>

          {/* 右カラム：ナビゲーション */}
          <aside className={styles.sidebar} role="complementary">
            <GlobalNavigation />
          </aside>
        </div>

        {/* モーダルレイヤー */}
        {modal && (
          <div className={styles.modalOverlay} role="dialog" aria-modal="true">
            {modal}
          </div>
        )}
      </body>
    </html>
  )
}

export default RootLayout
