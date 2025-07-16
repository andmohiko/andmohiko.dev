/**
 * ポートフォリオページ
 *
 * @returns {NextPage} ポートフォリオページ
 */

import React from 'react'
import { NextPage } from 'next'
import styles from './page.module.css'

const PortfolioPage: NextPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <h1>ポートフォリオ</h1>
      </div>
    </div>
  )
}

export default PortfolioPage
