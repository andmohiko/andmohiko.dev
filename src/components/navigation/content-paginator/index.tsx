import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5'
import Link from 'next/link'
import styles from './style.module.css'
import { LabelText } from '@/components/typography/LabelText'

type ContentPaginatorProps = {
  previousLabel?: string
  nextLabel?: string
  previousSlug?: string
  nextSlug?: string
}

export const ContentPaginator = ({
  previousLabel = 'previous',
  nextLabel = 'next',
  previousSlug,
  nextSlug,
}: ContentPaginatorProps) => {
  return (
    <div className={styles.navigation}>
      {previousSlug && (
        <Link href={previousSlug} className={styles.previous}>
          <div className={styles.icon}>
            <IoChevronBackOutline size={24} />
          </div>
          <LabelText>{previousLabel}</LabelText>
        </Link>
      )}
      {nextSlug && (
        <Link href={nextSlug} className={styles.next}>
          <LabelText>{nextLabel}</LabelText>
          <div className={styles.icon}>
            <IoChevronForwardOutline size={24} />
          </div>
        </Link>
      )}
    </div>
  )
}
