/**
 * ブログ一覧ページコンポーネント
 *
 * 制限事項：
 * - ビルド時にContentfulからデータを取得
 * - ランタイムでのデータ更新なし
 */
import { Metadata } from 'next'
import { BlogList } from './components/blog-list'
import {
  getAllAggregatedBlogs,
  convertToBlogArray,
} from '@/lib/blog-aggregator'
import styles from './style.module.css'
import { ContentPaginator } from '@/components/navigation/content-paginator'

/**
 * ページメタデータの設定
 */
export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Web開発、フロントエンド技術、プログラミングに関するブログ記事を掲載しています。',
  openGraph: {
    title: 'Blog | andmohiko.dev',
    description:
      'Web開発、フロントエンド技術、プログラミングに関するブログ記事',
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
 * ブログ一覧ページコンポーネント
 *
 * @returns {Promise<JSX.Element>} ブログ一覧ページ
 */
export default async function BlogListPage(): Promise<React.ReactNode> {
  const aggregatedBlogs = await getAllAggregatedBlogs()
  const blogs = convertToBlogArray(aggregatedBlogs)

  return (
    <main className={styles.blogListMain}>
      <BlogList blogs={blogs} />
      <ContentPaginator
        previousLabel="work"
        nextLabel="profile"
        previousSlug="/"
        nextSlug="/profile"
      />
    </main>
  )
}
