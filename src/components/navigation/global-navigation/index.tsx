/**
 * ナビゲーションコンポーネント
 *
 * このコンポーネントでは以下の機能を提供します：
 * - ブログとポートフォリオとプロフィールページ間のナビゲーション
 *
 * 主な仕様：
 * - URLパスに基づく自動的なカレント状態の検出
 * - ホバーエフェクトとクリックアニメーション
 * - アクセシビリティ対応（WAI-ARIA準拠）
 *
 * 制限事項：
 * - Next.js App RouterのusePathname hookに依存
 */

import React from 'react'
import { PCNavi } from './pc-navigation'

/**
 * 現在のパスがナビゲーション項目にマッチするかチェック
 *
 * @param {string} pathname - 現在のパス。usePathnameから取得したものを渡す
 * @param {string} href - チェック対象のパス
 * @returns {boolean} マッチするかどうか
 */
export const isCurrentPath = (pathname: string, href: string): boolean => {
  if (href === '/') {
    return pathname === '/'
  }
  return pathname.startsWith(href)
}

/**
 * カレントインジケーター付きナビゲーションコンポーネント
 *
 * @returns {JSX.Element} ナビゲーションコンポーネント
 */
export const GlobalNavigation: React.FC = () => {
  return <PCNavi />
}
