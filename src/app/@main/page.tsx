/**
 * ポートフォリオページ
 *
 * @returns {NextPage} ポートフォリオページ
 */

import React from 'react'
import { NextPage } from 'next'
import styles from './page.module.css'
import { ContentPaginator } from '@/components/navigation/content-paginator'

const PortfolioPage: NextPage = () => {
  return (
    <main className={styles.mainContent}>
      <h1>ポートフォリオ</h1>
      <ContentPaginator
        previousLabel="profile"
        nextLabel="blog"
        previousSlug="/profile"
        nextSlug="/blogs"
      />
    </main>
  )
}

export default PortfolioPage
