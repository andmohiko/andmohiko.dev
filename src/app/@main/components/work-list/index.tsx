/**
 * ブログ記事一覧表示コンポーネント
 */

'use client'

import { Work } from '@/types/work'
import { WorkItem } from '../work-item'
import { usePathname } from 'next/navigation'

import styles from './style.module.css'

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
  const pathname = usePathname()
  // /works/123 のような子ページを開いているかどうか
  const isInWorkDetailPage = pathname.includes('/works/')
  // /works/123 のような子ページのIDを取得する
  const workId = pathname.split('/').pop()

  return (
    <div className={styles.workList}>
      {works.map((work) => (
        <WorkItem
          key={work.id}
          id={work.id}
          thumbnailUrl={work.thumbnail.url}
          title={work.title}
          description={work.description}
          isInWorkDetailPage={isInWorkDetailPage}
          isCurrentWork={workId === work.id}
        />
      ))}
    </div>
  )
}
