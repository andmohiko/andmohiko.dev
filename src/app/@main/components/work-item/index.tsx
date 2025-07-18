import Link from 'next/link'

import styles from './style.module.css'

import { TitleText } from '@/components/typography/TitleText'
import Image from 'next/image'
import { ParagraphText } from '@/components/typography/ParagraphText'

type Props = {
  id: string
  thumbnailUrl: string
  title: string
  description: string
}

export const WorkItem = ({ id, thumbnailUrl, title, description }: Props) => {
  return (
    <Link href={`/work/${id}`} className={styles.link}>
      <div className={styles.workItem}>
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
