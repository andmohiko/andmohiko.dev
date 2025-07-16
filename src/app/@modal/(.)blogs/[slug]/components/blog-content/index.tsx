/**
 * ブログ詳細コンポーネント
 */

'use client'

import { ContentfulBlog } from '@/types/blog'
import styles from './style.module.css'
import { BaseModal } from '@/components/layout/base-modal'
import { TitleText } from '@/components/typography/TitleText'
import { ParagraphText } from '@/components/typography/ParagraphText'
import dayjs from 'dayjs'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ContentPaginator } from '@/components/navigation/content-paginator'

/**
 * BlogModalコンポーネントのプロパティ型
 */
type BlogModalProps = {
  blog: ContentfulBlog
  previousSlug?: string
  nextSlug?: string
}

/**
 * ブログ詳細モーダルコンポーネント
 *
 * @param {BlogModalProps} props - コンポーネントのプロパティ
 * @returns {JSX.Element} ブログ詳細モーダル
 */
export const BlogContent: React.FC<BlogModalProps> = ({
  blog,
  previousSlug,
  nextSlug,
}) => {
  return (
    <div className={styles.wrapper}>
      <BaseModal>
        <div className={styles.content}>
          <div className={styles.title}>
            <TitleText level="h1" size="lg" color="primary">
              {blog.fields.title}
            </TitleText>
          </div>
          <div className={styles.date}>
            <ParagraphText size="lg" color="primary">
              {dayjs(blog.fields.publishedAt).format('YYYY.MM.DD')}
            </ParagraphText>
          </div>
          <div className={styles.body}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {blog.fields.body}
            </ReactMarkdown>
          </div>
        </div>
      </BaseModal>
      <ContentPaginator previousSlug={previousSlug} nextSlug={nextSlug} />
    </div>
  )
}
