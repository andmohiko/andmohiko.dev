'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { IoLogoGithub } from 'react-icons/io5'
import { FaXTwitter } from 'react-icons/fa6'
import classNames from 'classnames'
import { LabelText } from '@/components/typography/LabelText'
import styles from './style.module.css'
import { ParagraphText } from '@/components/typography/ParagraphText'
import { isCurrentPath } from '../index'
import { navigationItems } from '../navigation-items'
import { usePathname } from 'next/navigation'

/**
 * SP用ナビゲーションコンポーネント
 *
 * @param {string} pathname - 現在のパス。usePathnameから取得したものを渡す
 * @param {Array<NavigationItem>} navigationItems - ナビゲーション項目の配列
 * @returns {JSX.Element} ナビゲーションコンポーネント
 */

// 白背景の上で利用する場合は primary
// 塗られた背景の上で利用する場合は white
type Color = 'primary' | 'white'

type Props = {
  color?: Color
  showCopyright?: boolean
}

const getTextColor = (color: Color, isCurrent: boolean): Color => {
  if (color === 'white') {
    return isCurrent ? 'primary' : 'white'
  }
  if (color === 'primary') {
    return isCurrent ? 'white' : 'primary'
  }
  return 'white'
}

export const SPNavi = ({ color = 'white', showCopyright = true }: Props) => {
  const pathname = usePathname()

  return (
    <nav className={styles.navigationSp} role="navigation">
      {/* logo */}
      <Image
        src={`/images/logo_${color}.png`}
        alt="logo"
        width={187}
        height={48}
        className={styles.logo}
      />
      {/* navigation */}
      <div className={styles.navigationList}>
        {navigationItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-label={item.ariaLabel}
            aria-current={
              isCurrentPath(pathname, item.href) ? 'page' : undefined
            }
            className={classNames(
              styles.navigationItem,
              isCurrentPath(pathname, item.href) && styles.current,
              styles[color],
            )}
          >
            <LabelText
              size="md"
              color={getTextColor(color, isCurrentPath(pathname, item.href))}
            >
              {item.label}
            </LabelText>
          </Link>
        ))}
      </div>
      {/* social */}
      <div className={classNames(styles.social, styles[color])}>
        <Link
          href="https://github.com/andmohiko"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.icon}
        >
          <IoLogoGithub size={48} color={`var(--color-${color})`} />
        </Link>
        <Link
          href="https://x.com/andmohiko"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.icon}
        >
          <FaXTwitter size={48} color={`var(--color-${color})`} />
        </Link>
      </div>
      {showCopyright && (
        <div className={styles.copyright}>
          <ParagraphText opacity="50" textAlign="center">
            &copy; andmohiko.dev
          </ParagraphText>
        </div>
      )}
    </nav>
  )
}
