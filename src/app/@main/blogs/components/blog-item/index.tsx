import dayjs from 'dayjs'
import Link from 'next/link'

import styles from './style.module.css'

import { LabelText } from '@/components/typography/LabelText'
import { TitleText } from '@/components/typography/TitleText'

type Props = {
  publishedAt: string
  title: string
  slug?: string
  url?: string
  media?: string
}

export const BlogItem = ({ publishedAt, title, slug, url, media }: Props) => {
  return (
    <div className={styles.blogItem}>
      {slug ? (
        <Link href={`/blogs/${slug}`} className={styles.link}>
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
