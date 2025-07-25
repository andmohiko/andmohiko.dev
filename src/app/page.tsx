/**
 * ポートフォリオページ
 *
 * このコンポーネントでは以下の機能を提供します：
 * - ルートページのポートフォリオ表示
 * - 静的サイト生成によるパフォーマンス最適化
 * - SEO対応のメタデータ設定
 *
 * 主な仕様：
 * - ビルド時に静的ページを生成
 * - CDN配信による高速表示
 *
 * 制限事項：
 * - ランタイムでのデータ更新なし
 *
 * @returns {NextPage} ポートフォリオページ
 */

import { NextPage } from 'next'

/**
 * 静的生成の設定
 * ビルド時に静的ページを生成
 */
export const dynamic = 'force-static'
export const revalidate = false

const PortfolioPage: NextPage = () => {
  return <h1>andmohiko.dev</h1>
}

export default PortfolioPage
