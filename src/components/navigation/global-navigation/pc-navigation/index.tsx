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
 * PC用ナビゲーションコンポーネント
 *
 * @param {string} pathname - 現在のパス。usePathnameから取得したものを渡す
 * @param {Array<NavigationItem>} navigationItems - ナビゲーション項目の配列
 * @returns {JSX.Element} ナビゲーションコンポーネント
 */

export const PCNavi = () => {
  const pathname = usePathname()

  return (
    <nav className={styles.navigation} role="navigation">
      {/* logo */}
      <Image
        src="/images/logo_white.png"
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
            aria-current={
              isCurrentPath(pathname, item.href) ? 'page' : undefined
            }
            className={classNames(
              styles.navigationItem,
              isCurrentPath(pathname, item.href) && styles.current,
            )}
          >
            <LabelText
              size="lg"
              color={isCurrentPath(pathname, item.href) ? 'primary' : 'white'}
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
          aria-label="GitHub"
        >
          <IoLogoGithub size={64} color="var(--color-white)" />
        </Link>
        <Link
          href="https://x.com/andmohiko"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.icon}
          aria-label="X"
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
  )
}
