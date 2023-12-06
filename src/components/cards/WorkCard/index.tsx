import type { ReactNode } from 'react'
import type { Work } from '~/types/work'

import styles from './style.module.scss'

type Props = {
  work: Work
  onClick?: () => void
}

const WorkCard = ({ work, onClick }: Props): ReactNode => {
  return (
    <article className={styles.workCard} onClick={onClick}>
      <img src={work.thumbnail.url} alt={work.title} className={styles.thumbnail} />
      <div className={styles.header}>
        <h3 className={styles.title}>{work.title}</h3>
        <p className={styles.description}>{work.description}</p>
        <div className={styles.tags}>
          {work.tags.map((tag) => (<span key={tag} className={styles.tag}>{tag}</span>))}
        </div>
      </div>
    </article>
  )
}

export default WorkCard