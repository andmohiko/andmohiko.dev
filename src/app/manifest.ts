/**
 * Progressive Web App (PWA) マニフェスト設定
 *
 * このファイルではPWAとしての動作を定義します：
 * - アプリケーション名とアイコン設定
 * - ホーム画面追加時の表示方法
 * - テーマカラーとブランド設定
 * - スタンドアロンアプリとしての動作
 *
 * 主な仕様：
 * - Next.js App Router対応
 * - 日本語環境最適化
 * - モバイルファースト設計
 * - アクセシビリティ対応
 *
 * 制限事項：
 * - HTTPS環境が必要
 * - 対応ブラウザでの表示
 */

import type { MetadataRoute } from 'next'

/**
 * PWA マニフェスト設定
 *
 * @returns {MetadataRoute.Manifest} Web App Manifest設定オブジェクト
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    // アプリケーション基本情報
    name: 'andmohiko.dev - Portfolio & Blog',
    short_name: 'andmohiko',
    description:
      'andmohikoのポートフォリオサイト。Web開発の作品とブログを掲載しています。',

    // PWA表示設定
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',

    // 言語・文字方向設定
    lang: 'ja',
    dir: 'auto',

    // テーマカラー設定（既存の設定を維持）
    theme_color: '#652C8F',
    background_color: '#652C8F',

    // アイコン設定（既存のアイコンを使用）
    icons: [
      {
        src: '/icon512_maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon512_rounded.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon144.png',
        sizes: '144x144',
        type: 'image/png',
        purpose: 'any',
      },
    ],

    // カテゴリ設定
    categories: ['portfolio', 'blog', 'development', 'web'],

    // ショートカット設定（主要ページへの直接アクセス）
    shortcuts: [
      {
        name: 'ブログ一覧',
        short_name: 'ブログ',
        description: 'ブログ記事の一覧を表示',
        url: '/blogs',
        icons: [
          {
            src: '/icon96.png',
            sizes: '96x96',
            type: 'image/png',
          },
        ],
      },
      {
        name: 'プロフィール',
        short_name: 'プロフィール',
        description: 'プロフィール情報を表示',
        url: '/profile',
        icons: [
          {
            src: '/icon96.png',
            sizes: '96x96',
            type: 'image/png',
          },
        ],
      },
    ],
  }
}
