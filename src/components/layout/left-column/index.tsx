/**
 * メインコンテンツ表示コンポーネント
 *
 * このコンポーネントでは以下の機能を提供します：
 * - Parallel Routesのメインスロット管理
 * - mainスロットとchildrenの表示制御
 * - レスポンシブ対応のメインコンテンツエリア
 *
 * 主な仕様：
 * - mainスロットを優先表示
 * - mainが存在しない場合はchildrenを表示
 * - クライアントサイドでの表示制御
 *
 * 制限事項：
 * - Next.js App RouterのParallel Routesに依存
 * - クライアントコンポーネント必須
 */

'use client'

import classNames from 'classnames'
import React from 'react'

import styles from './style.module.css'
import { usePathname } from 'next/navigation'

import { SPHeader } from '@/components/navigation/sp-header'

/**
 * LeftColumnコンポーネントのプロパティ型
 */
type LeftColumnProps = {
  /** メインコンテンツスロット（Parallel Routes） */
  main?: React.ReactNode
  /** 通常の子要素 */
  children?: React.ReactNode
  /** CSSクラス名 */
  className?: string
}

/**
 * メインコンテンツ表示コンポーネント
 *
 * @param {LeftColumnProps} props - コンポーネントのプロパティ
 * @returns {React.ReactNode} メインコンテンツまたは子要素
 */
export const LeftColumn: React.FC<LeftColumnProps> = ({
  main,
  children,
  className,
}) => {
  const pathname = usePathname()
  // /blogs/[slug]または/works/[slug]の場合はモーダルを開く。正規表現で判定する
  const isOpenModal =
    /\/blogs\/[a-zA-Z0-9-]+$/.test(pathname) ||
    /\/works\/[a-zA-Z0-9-]+$/.test(pathname)
  return (
    <>
      <SPHeader />

      <div
        className={classNames(className, {
          [styles.overlay]: isOpenModal,
        })}
        role="main"
      >
        {main || children}
      </div>
    </>
  )
}
