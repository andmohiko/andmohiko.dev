/**
 * ブログ記事一覧表示コンポーネント
 */

'use client'

import { Work } from '@/types/work'
import { WorkItem } from '../work-item'

import styles from './style.module.css'
import { Fragment } from 'react'
import { TitleText } from '@/components/typography/TitleText'

/**
 * WorkListコンポーネントのプロパティ型
 */
type Props = {
  /** 表示するポートフォリオ配列 */
  works: Work[]
}

/**
 * ポートフォリオ一覧表示コンポーネント
 *
 * @param {Props} props - コンポーネントのプロパティ
 * @returns {React.ReactElement} ポートフォリオ一覧表示
 */
export const WorkList: React.FC<Props> = ({ works }) => {
  return (
    <div className={styles.workList}>
      {works.map((work) => (
        <WorkItem
          key={work.id}
          id={work.id}
          thumbnailUrl={work.thumbnail.url}
          title={work.title}
          description={work.description}
        />
      ))}
    </div>
  )
}
