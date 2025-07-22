/**
 * モーダルラッパーコンポーネント
 *
 * このコンポーネントでは以下の機能を提供します：
 * - モーダルの背景オーバーレイ
 * - 背景クリックでモーダルを閉じる機能
 * - レイアウトとモーダルコンテンツの分離
 *
 * 主な仕様：
 * - クライアントサイドでのイベントハンドリング
 * - useRouterによる画面遷移
 * - アクセシビリティ対応
 *
 * 制限事項：
 * - useRouterでの画面遷移が必要
 */

'use client'

import { useRouter, usePathname } from 'next/navigation'
import { IoMdCloseCircleOutline } from 'react-icons/io'
import styles from './style.module.css'

type Props = {
  /** モーダルコンテンツ */
  children: React.ReactNode
}

/**
 * モーダルコンポーネント
 *
 * @param {Props} props - コンポーネントのプロパティ
 * @returns {JSX.Element} モーダルラッパー
 */
export const BaseModal: React.FC<Props> = ({ children }) => {
  const { back, push } = useRouter()
  const pathname = usePathname()

  /**
   * 背景クリック時の処理
   */
  const handleClose = () => {
    if (pathname.startsWith('/blogs')) {
      push('/blogs')
      return
    }
    if (pathname.startsWith('/works')) {
      push('/')
      return
    }
    back()
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.modal}>
        <button className={styles.close} onClick={handleClose}>
          <IoMdCloseCircleOutline color="var(--color-primary)" size={32} />
        </button>
        {children}
      </div>
    </div>
  )
}
