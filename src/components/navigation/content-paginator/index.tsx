import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5'
import Link from 'next/link'
import styles from './style.module.css'

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
          <IoChevronBackOutline size={24} />
          {previousLabel}
        </Link>
      )}
      {nextSlug && (
        <Link href={nextSlug} className={styles.next}>
          {nextLabel}
          <IoChevronForwardOutline size={24} />
        </Link>
      )}
    </div>
  )
}
