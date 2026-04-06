'use client'

import styles from './style.module.css'

type LinkCardProps = {
  url: string
  title: string
  description: string
  image: string
  siteName: string
  favicon: string
}

export const LinkCard: React.FC<LinkCardProps> = ({
  url,
  title,
  description,
  image,
  siteName,
  favicon,
}) => {
  const displayUrl = (() => {
    try {
      return new URL(url).hostname
    } catch {
      return url
    }
  })()

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.card}
    >
      {image && (
        <div className={styles.imageWrapper}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt={title} className={styles.image} />
        </div>
      )}
      <div className={styles.info}>
        <span className={styles.title}>{title}</span>
        {description && (
          <span className={styles.description}>{description}</span>
        )}
        <span className={styles.meta}>
          {favicon && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={favicon}
              alt=""
              className={styles.favicon}
              width={16}
              height={16}
            />
          )}
          <span className={styles.siteName}>
            {siteName || displayUrl}
          </span>
        </span>
      </div>
    </a>
  )
}
