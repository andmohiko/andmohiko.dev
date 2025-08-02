/**
 * ブログ一覧ページコンポーネント
 *
 * 制限事項：
 * - ビルド時にContentfulからデータを取得
 * - ランタイムでのデータ更新なし
 */
import { Metadata } from 'next'
import { getAllWorks } from '@/lib/microcms'
import styles from './page.module.css'
import { ContentPaginator } from '@/components/navigation/content-paginator'
import { WorkList } from './components/work-list'

/**
 * ページメタデータの設定
 */
export const metadata: Metadata = {
  description:
    'andmohikoのポートフォリオサイト。ブログと人生と過去につくったもの。',
  openGraph: {
    description:
      'andmohikoのポートフォリオサイト。ブログと人生と過去につくったもの。',
    type: 'website',
  },
}

/**
 * 静的生成の設定
 * ビルド時にContentfulからデータを取得して静的ページを生成
 */
export const dynamic = 'force-static'
export const revalidate = false

/**
 * ポートフォリオページコンポーネント
 *
 * @returns {Promise<JSX.Element>} ポートフォリオページ
 */
export default async function WorksListPage(): Promise<React.ReactNode> {
  const works = await getAllWorks()
  return (
    <main className={styles.workListMain}>
      <WorkList works={works} />
      <ContentPaginator
        previousLabel="profile"
        nextLabel="blog"
        previousSlug="/profile"
        nextSlug="/blogs"
      />
    </main>
  )
}
