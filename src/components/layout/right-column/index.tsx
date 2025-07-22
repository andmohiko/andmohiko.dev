/**
 * モーダル表示制御コンポーネント
 *
 * このコンポーネントでは以下の機能を提供します：
 * - URLパスに基づくモーダル表示制御
 * - Parallel Routesの右スロットを管理
 *
 * 主な仕様：
 * - クライアントサイドでのパス判定
 * - 詳細ページ（/blogs/[slug], /works/[slug]）でのみモーダル表示
 *
 * 制限事項：
 * - usePathnameが必要（クライアントコンポーネント）
 */

'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { GlobalNavigation } from '@/components/navigation/global-navigation'
import styles from './style.module.css'
import classNames from 'classnames'

/**
 * モーダルコントローラーのプロパティ型
 */
type ModalControllerProps = {
  /** モーダルコンテンツ */
  modal: React.ReactNode
}

/**
 * モーダル表示制御コンポーネント
 *
 * @param {ModalControllerProps} props - コンポーネントのプロパティ
 * @returns {React.ReactNode} モーダルまたはnull
 */
export const RightColumn = ({ modal }: ModalControllerProps) => {
  const pathname = usePathname()
  // 詳細ページのパスパターンをチェック
  const isDetailPage = /^\/(blogs|works)\/[^/]+$/.test(pathname)

  // 詳細ページでかつmodalが存在する場合
  const isDetailModal = isDetailPage && modal && React.isValidElement(modal)

  return (
    <div
      className={classNames(
        styles.rightColumn,
        !!isDetailModal && styles.modal,
      )}
    >
      {isDetailModal ? (
        <>{modal}</>
      ) : (
        <aside className={styles.sidebar} role="complementary">
          <GlobalNavigation />
        </aside>
      )}
    </div>
  )
}
