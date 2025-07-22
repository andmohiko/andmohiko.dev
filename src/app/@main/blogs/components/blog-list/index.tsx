/**
 * ブログ記事一覧表示コンポーネント
 */

'use client'

import { Blog } from '@/types/blog'
import { BlogItem } from '../blog-item'

import styles from './style.module.css'
import { Fragment } from 'react'
import { TitleText } from '@/components/typography/TitleText'
import { usePathname } from 'next/navigation'

/**
 * BlogListコンポーネントのプロパティ型
 */
type Props = {
  /** 表示するブログ記事配列 */
  blogs: Blog[]
}

/**
 * ブログ記事一覧表示コンポーネント
 *
 * @param {Props} props - コンポーネントのプロパティ
 * @returns {React.ReactElement} ブログ一覧表示
 */
export const BlogList: React.FC<Props> = ({ blogs }) => {
  const showYear = (posts: Blog[], index: number) => {
    const year = posts[index].publishedAt.slice(0, 4)
    if (index === 0) return true
    const prevYear = posts[index - 1].publishedAt.slice(0, 4)
    return year !== prevYear
  }
  const pathname = usePathname()
  const isInBlogDetailPage = pathname.includes('/blogs/')
  const slug = pathname.split('/').pop()

  return (
    <div className={styles.blogList}>
      {blogs.map((blog, index) => (
        <Fragment key={blog.id}>
          {showYear(blogs, index) && (
            <div className={styles.year}>
              <TitleText level="span" size="lg" opacity="50">
                {blog.publishedAt.slice(0, 4)}
              </TitleText>
            </div>
          )}
          <BlogItem
            key={blog.id}
            publishedAt={blog.publishedAt}
            title={blog.title}
            slug={blog.slug}
            url={blog.url}
            media={blog.media}
            isInBlogDetailPage={isInBlogDetailPage}
            isCurrentBlog={slug === blog.slug}
          />
        </Fragment>
      ))}
    </div>
  )
}
