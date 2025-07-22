'use client'

import Link from 'next/link'

import styles from './style.module.css'

import { TitleText } from '@/components/typography/TitleText'
import Image from 'next/image'
import { ParagraphText } from '@/components/typography/ParagraphText'
import classNames from 'classnames'
import { getBlurPlaceholder, generateImageSizes } from '@/lib/blur-placeholder'

type Props = {
  id: string
  thumbnailUrl: string
  title: string
  description: string
  isInWorkDetailPage: boolean
  isCurrentWork: boolean
  /** LCP対策：最初の数枚を優先読み込みにするフラグ */
  isPriority?: boolean
}

export const WorkItem = ({
  id,
  thumbnailUrl,
  title,
  description,
  isInWorkDetailPage,
  isCurrentWork,
  isPriority = false,
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
          loading={isPriority ? undefined : 'lazy'}
          priority={isPriority}
          placeholder="blur"
          blurDataURL={getBlurPlaceholder()}
          sizes={generateImageSizes(276)}
          quality={75}
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
