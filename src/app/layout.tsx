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
import { Zen_Maru_Gothic } from 'next/font/google'
import { LeftColumn } from '@/components/layout/left-column'
import { RightColumn } from '@/components/layout/right-column'
import { ServiceWorkerRegistration } from '@/components/pwa/service-worker-registration'
import './globals.css'
import styles from './layout.module.css'

/**
 * Google Fontsの設定
 */
const zenMaruGothic400 = Zen_Maru_Gothic({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-zen-maru-gothic',
})

const zenMaruGothic600 = Zen_Maru_Gothic({
  weight: '700',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-zen-maru-gothic',
})

/**
 * サイトメタデータの設定
 */
export const metadata: Metadata = {
  title: {
    default: 'andmohiko.dev - Portfolio & Blog',
    template: '%s | andmohiko.dev',
  },
  description:
    'andmohikoのポートフォリオサイト。Web開発の作品とブログを掲載しています。',
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
    description:
      'andmohikoのポートフォリオサイト。Web開発の作品とブログを掲載しています。',
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
    description:
      'andmohikoのポートフォリオサイト。Web開発の作品とブログを掲載しています。',
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
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* PWA manifest */}
        {/* Next.js App Routerが自動的にapp/manifest.tsを処理します */}

        {/* テーマカラー */}
        <meta name="theme-color" content="#652C8F" />
        <meta name="msapplication-TileColor" content="#652C8F" />
      </head>

      <body
        className={`${styles.body} ${zenMaruGothic400.variable} ${zenMaruGothic600.variable}`}
      >
        {/* PWA Service Worker登録 */}
        <ServiceWorkerRegistration />

        {/* メインアプリケーション構造 */}
        <main className={styles.container}>
          {/* 左カラム：メインコンテンツ */}
          <LeftColumn main={main} className={styles.mainContent}>
            {children}
          </LeftColumn>

          {/* 右カラム：ナビゲーション・モーダル */}
          <div className={styles.rightColumn}>
            <RightColumn modal={modal} />
          </div>
        </main>
      </body>
    </html>
  )
}

export default RootLayout
