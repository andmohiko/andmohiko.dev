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

'use client'

import React from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { IoLogoGithub } from 'react-icons/io5'
import { FaXTwitter } from 'react-icons/fa6'
import classNames from 'classnames'

import { LabelText } from '@/components/typography/LabelText'
import styles from './style.module.css'
import { ParagraphText } from '@/components/typography/ParagraphText'

/**
 * ナビゲーション項目の型定義
 */
type NavigationItem = {
  /** 表示名 */
  label: string
  /** リンク先パス */
  href: string
  /** アクセシビリティ用のaria-label */
  ariaLabel: string
}

/**
 * ナビゲーション項目の設定
 */
const navigationItems: NavigationItem[] = [
  {
    label: 'work',
    href: '/',
    ariaLabel: 'ポートフォリオ作品一覧へ移動',
  },
  {
    label: 'blog',
    href: '/blogs',
    ariaLabel: 'ブログ記事一覧へ移動',
  },
  {
    label: 'profile',
    href: '/profile',
    ariaLabel: 'プロフィールページへ移動',
  },
]

/**
 * カレントインジケーター付きナビゲーションコンポーネント
 *
 * @returns {JSX.Element} ナビゲーションコンポーネント
 */
export const GlobalNavigation: React.FC = () => {
  const pathname = usePathname()

  /**
   * 現在のパスがナビゲーション項目にマッチするかチェック
   *
   * @param {string} href - チェック対象のパス
   * @returns {boolean} マッチするかどうか
   */
  const isCurrentPath = (href: string): boolean => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* PC用 */}
      <nav className={styles.navigation} role="navigation">
        {/* logo */}
        <Image
          src="/images/logo.png"
          alt="logo"
          width={2000}
          height={516}
          className={styles.logo}
        />
        {/* navigation */}
        <div className={styles.navigationList}>
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.ariaLabel}
              aria-current={isCurrentPath(item.href) ? 'page' : undefined}
              className={classNames(
                styles.navigationItem,
                isCurrentPath(item.href) && styles.current,
              )}
            >
              <LabelText
                size="lg"
                color={isCurrentPath(item.href) ? 'primary' : 'white'}
              >
                {item.label}
              </LabelText>
            </Link>
          ))}
        </div>
        {/* social */}
        <div className={styles.social}>
          <Link
            href="https://github.com/andmohiko"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.icon}
          >
            <IoLogoGithub size={64} color="var(--color-white)" />
          </Link>
          <Link
            href="https://x.com/andmohiko"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.icon}
          >
            <FaXTwitter size={64} color="var(--color-white)" />
          </Link>
        </div>
        <div className={styles.copyright}>
          <ParagraphText size="xs" opacity="50" textAlign="center">
            &copy; andmohiko.dev
          </ParagraphText>
        </div>
      </nav>

      {/* SP用 */}
      <nav className={styles.navigationSp} role="navigation">
        {/* logo */}
        <Image
          src="/images/logo.png"
          alt="logo"
          width={2000}
          height={516}
          className={styles.logo}
        />
        {/* navigation */}
        <div className={styles.navigationList}>
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.ariaLabel}
              aria-current={isCurrentPath(item.href) ? 'page' : undefined}
              className={classNames(
                styles.navigationItem,
                isCurrentPath(item.href) && styles.current,
              )}
            >
              <LabelText
                size="md"
                color={isCurrentPath(item.href) ? 'primary' : 'white'}
              >
                {item.label}
              </LabelText>
            </Link>
          ))}
        </div>
        {/* social */}
        <div className={styles.social}>
          <Link
            href="https://github.com/andmohiko"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.icon}
          >
            <IoLogoGithub size={48} color="var(--color-white)" />
          </Link>
          <Link
            href="https://x.com/andmohiko"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.icon}
          >
            <FaXTwitter size={48} color="var(--color-white)" />
          </Link>
        </div>
        <div className={styles.copyright}>
          <ParagraphText opacity="50" textAlign="center">
            &copy; andmohiko.dev
          </ParagraphText>
        </div>
      </nav>
    </>
  )
}
