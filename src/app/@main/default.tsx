/**
 * @mainスロット用デフォルトページ
 *
 * このコンポーネントは、@mainスロットでルートがマッチしない場合に
 * 表示されるフォールバックページです。
 *
 * 主な仕様：
 * - Parallel Routesのフォールバック表示
 * - ホームページへの導線を提供
 *
 * 制限事項：
 * - Next.js App RouterのParallel Routesが必要
 */

import React from 'react'
import Link from 'next/link'

/**
 * メインスロットのデフォルトコンポーネント
 *
 * @returns {React.ReactElement} デフォルトページ
 */
const MainDefault: React.FC = () => {
  return (
    <div className="default-page">
      <div className="default-content">
        <h1>Welcome to andmohiko.dev</h1>
        <p>ポートフォリオサイトへようこそ</p>

        <nav className="default-navigation">
          <Link href="/blog" className="nav-link">
            Blog
          </Link>
          <Link href="/work" className="nav-link">
            Works
          </Link>
        </nav>
      </div>
    </div>
  )
}

export default MainDefault
