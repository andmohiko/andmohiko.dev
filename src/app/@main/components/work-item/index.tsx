'use client'

import Link from 'next/link'

import styles from './style.module.css'

import { TitleText } from '@/components/typography/TitleText'
import Image from 'next/image'
import { ParagraphText } from '@/components/typography/ParagraphText'
import classNames from 'classnames'

type Props = {
  id: string
  thumbnailUrl: string
  title: string
  description: string
  isInWorkDetailPage: boolean
  isCurrentWork: boolean
}

export const WorkItem = ({
  id,
  thumbnailUrl,
  title,
  description,
  isInWorkDetailPage,
  isCurrentWork,
}: Props) => {
  return (
    <Link href={`/works/${id}`} className={styles.link}>
      <div
        className={classNames(styles.workItem, {
          [styles.overlay]: isInWorkDetailPage && !isCurrentWork,
        })}
      >
        <Image
          src={thumbnailUrl}
          alt={title}
          width={276}
          height={276}
          className={styles.thumbnail}
        />
        <div className={styles.texts}>
          <TitleText level="h3" size="lg">
            {title}
          </TitleText>
          <ParagraphText opacity="70">{description}</ParagraphText>
        </div>
        <div className={styles.textsSp}>
          <TitleText level="h3">{title}</TitleText>
          <ParagraphText opacity="70">{description}</ParagraphText>
        </div>
      </div>
    </Link>
  )
}
