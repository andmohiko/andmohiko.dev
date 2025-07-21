'use client'

import styles from './style.module.css'
import { SPNavi } from '../../global-navigation/sp-navigation/sp-navigation'
import { useState } from 'react'
import { IoMdCloseCircleOutline } from 'react-icons/io'
import classNames from 'classnames'

export const HumbergarMenu = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={styles.humbergarMenu}>
      <button
        className={styles.button}
        aria-label={isOpen ? 'メニューを閉じる' : 'メニューを開く'}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span
          className={classNames(styles.closeButton, isOpen && styles.show)}
          aria-hidden="true"
        >
          <IoMdCloseCircleOutline color="var(--color-primary)" size={32} />
        </span>
        <span
          className={classNames(styles.openButton, !isOpen && styles.show)}
          aria-hidden="true"
        >
          <span />
          <span />
          <span />
        </span>
      </button>

      <nav className={classNames(styles.nav, isOpen && styles.open)}>
        <div
          className={classNames(styles.content, isOpen && styles.contentOpen)}
        >
          <SPNavi color="primary" showCopyright={false} />
        </div>
      </nav>
    </div>
  )
}
