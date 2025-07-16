/**
 * ブログ一覧ページコンポーネント
 *
 * 制限事項：
 * - ビルド時にContentfulからデータを取得
 * - ランタイムでのデータ更新なし
 */
import { Metadata } from 'next'
import { getAllBlogPosts } from '@/lib/contentful'
import { BlogList } from './components/blog-list'
import { getAllEntries } from '@/lib/microcms'
import { Blog } from '@/types/blog'
import dayjs from 'dayjs'
import styles from './style.module.css'

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
const BlogListPage = async (): Promise<React.ReactNode> => {
  const posts = await getAllBlogPosts()
  const microcmsEntries = await getAllEntries()

  const contentfulBlogs: Blog[] = posts.map((post) => ({
    body: post.fields.body,
    description: post.fields.description,
    headerImageUrl: post.fields.headerImage?.fields.file.url,
    id: post.sys.id,
    publishedAt: post.fields.publishedAt,
    slug: post.fields.slug,
    title: post.fields.title,
    url: undefined,
  }))
  const entries: Blog[] = microcmsEntries.map((entry) => ({
    body: undefined,
    description: undefined,
    headerImageUrl: undefined,
    id: entry.id,
    media: entry.media,
    publishedAt: entry.publishAt,
    slug: undefined,
    title: entry.title,
    url: entry.link,
  }))

  const blogs = [...contentfulBlogs, ...entries].sort((a, b) =>
    dayjs(a.publishedAt).isBefore(dayjs(b.publishedAt)) ? 1 : -1,
  )

  return (
    <div className={styles.blogListPage}>
      <main className={styles.blogListMain}>
        <BlogList blogs={blogs} />
      </main>
    </div>
  )
}

export default BlogListPage
