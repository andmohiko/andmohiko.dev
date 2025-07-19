import dayjs from 'dayjs'
import Link from 'next/link'

import styles from './style.module.css'

import { LabelText } from '@/components/typography/LabelText'
import { TitleText } from '@/components/typography/TitleText'
import classNames from 'classnames'

type Props = {
  publishedAt: string
  title: string
  slug?: string
  url?: string
  media?: string
  isInBlogDetailPage: boolean
  isCurrentBlog: boolean
}

export const BlogItem = ({
  publishedAt,
  title,
  slug,
  url,
  media,
  isInBlogDetailPage,
  isCurrentBlog,
}: Props) => {
  return (
    <div
      className={classNames(styles.blogItem, {
        [styles.overlay]: isInBlogDetailPage && !isCurrentBlog,
      })}
    >
      {slug ? (
        <Link href={`/blogs/${slug}`} className={styles.link}>
          {isCurrentBlog && <div className={styles.current} />}
          <LabelText size="md">{dayjs(publishedAt).format('MM.DD')}</LabelText>
          <TitleText level="span" size="md">
            {title}
          </TitleText>
        </Link>
      ) : (
        <Link
          href={`${url}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          <LabelText size="md">{dayjs(publishedAt).format('MM.DD')}</LabelText>
          <TitleText level="span" size="md">
            {`${title}${media ? ` (${media})` : ''}`}
          </TitleText>
        </Link>
      )}
    </div>
  )
}
