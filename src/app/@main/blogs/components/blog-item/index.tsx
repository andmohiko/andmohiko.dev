import dayjs from 'dayjs'
import Link from 'next/link'

import styles from './style.module.css'

import { LabelText } from '@/components/typography/LabelText'
import { TitleText } from '@/components/typography/TitleText'

type Props = {
  publishedAt: string
  title: string
  slug: string
}

export const BlogItem = ({ publishedAt, title, slug }: Props) => {
  return (
    <div className={styles.blogItem}>
      <Link href={`/blog/${slug}`} className={styles.link}>
        <LabelText size="md">{dayjs(publishedAt).format('MM.DD')}</LabelText>
        <TitleText level="span" size="md">
          {title}
        </TitleText>
      </Link>
    </div>
  )
}
