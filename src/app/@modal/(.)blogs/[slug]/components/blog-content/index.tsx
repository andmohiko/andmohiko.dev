/**
 * ブログ詳細コンポーネント
 */

'use client'

import Image from 'next/image'
import { Blog } from '@/types/blog'
import styles from './style.module.css'
import { BaseModal } from '@/components/layout/base-modal'
import { TitleText } from '@/components/typography/TitleText'
import { ParagraphText } from '@/components/typography/ParagraphText'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import { ContentPaginator } from '@/components/navigation/content-paginator'
import { LabelText } from '@/components/typography/LabelText'

// iframe を許可するサニタイズ設定
const schema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames || []), 'iframe'],
  attributes: {
    ...defaultSchema.attributes,
    iframe: [
      'src',
      'width',
      'height',
      'title',
      'frameborder',
      'allow',
      'allowfullscreen',
      'referrerpolicy',
      'style',
    ],
  },
}

/**
 * BlogModalコンポーネントのプロパティ型
 */
type BlogModalProps = {
  /** ブログ記事データ */
  blog: Blog
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
            {blog.headerImageUrl && (
              <Image
                src={
                  blog.headerImageUrl.startsWith('/assets/posts/')
                    ? blog.headerImageUrl
                    : blog.headerImageUrl.startsWith('http')
                      ? blog.headerImageUrl
                      : `https:${blog.headerImageUrl}?fm=webp`
                }
                alt={blog.title}
                width={568}
                height={300}
                className={styles.thumbnail}
              />
            )}
            <div className={styles.title}>
              <TitleText level="h1" size="lg" color="primary">
                {blog.title}
              </TitleText>
            </div>
            <div className={styles.date}>
              <ParagraphText size="lg" color="primary">
                {formattedDate}
              </ParagraphText>
            </div>
            <div className={styles.body}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, [rehypeSanitize, schema]]}
              >
                {blog.body || ''}
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
