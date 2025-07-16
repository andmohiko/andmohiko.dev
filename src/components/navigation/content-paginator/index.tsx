import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5'
import Link from 'next/link'
import styles from './style.module.css'

type ContentPaginatorProps = {
  previousSlug?: string
  nextSlug?: string
}

export const ContentPaginator = ({
  previousSlug,
  nextSlug,
}: ContentPaginatorProps) => {
  return (
    <div className={styles.navigation}>
      {previousSlug && (
        <Link href={`/blogs/${previousSlug}`} className={styles.previous}>
          <IoChevronBackOutline size={24} />
          previous
        </Link>
      )}
      {nextSlug && (
        <Link href={`/blogs/${nextSlug}`} className={styles.next}>
          next
          <IoChevronForwardOutline size={24} />
        </Link>
      )}
    </div>
  )
}
