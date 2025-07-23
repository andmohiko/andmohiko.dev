/**
 * ブログ詳細コンポーネント
 */

'use client'

import Image from 'next/image'
import { ContentfulBlog } from '@/types/blog'
import styles from './style.module.css'
import { BaseModal } from '@/components/layout/base-modal'
import { TitleText } from '@/components/typography/TitleText'
import { ParagraphText } from '@/components/typography/ParagraphText'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ContentPaginator } from '@/components/navigation/content-paginator'
import { LabelText } from '@/components/typography/LabelText'

/**
 * BlogModalコンポーネントのプロパティ型
 */
type BlogModalProps = {
  /** ブログ記事データ */
  blog: ContentfulBlog
  /** サーバーサイドでフォーマット済みの日付文字列 */
  formattedDate: string
  /** 前の記事のスラッグ */
  previousSlug?: string
  /** 次の記事のスラッグ */
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
  formattedDate,
  previousSlug,
  nextSlug,
}) => {
  return (
    <div className={styles.wrapper}>
      <BaseModal>
        {blog ? (
          <article className={styles.content}>
            {blog.fields.headerImage && (
              <Image
                src={`https:${blog.fields.headerImage.fields.file.url}?fm=webp`}
                alt={blog.fields.title}
                width={568}
                height={300}
                className={styles.thumbnail}
              />
            )}
            <div className={styles.title}>
              <TitleText level="h1" size="lg" color="primary">
                {blog.fields.title}
              </TitleText>
            </div>
            <div className={styles.date}>
              <ParagraphText size="lg" color="primary">
                {formattedDate}
              </ParagraphText>
            </div>
            <div className={styles.body}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {blog.fields.body}
              </ReactMarkdown>
            </div>
          </article>
        ) : (
          <LabelText size="lg" color="primary">
            loading...
          </LabelText>
        )}
      </BaseModal>
      <ContentPaginator
        previousSlug={previousSlug ? `/blogs/${previousSlug}` : undefined}
        nextSlug={nextSlug ? `/blogs/${nextSlug}` : undefined}
      />
    </div>
  )
}
