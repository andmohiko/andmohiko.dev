import type { ReactNode } from 'react'

import type { Work } from '~/types/work'

import styles from './style.module.scss'

type Props = {
  work: Work
}

const WorkDetail = ({ work }: Props): ReactNode => {
  return (
    <article className={styles.workCard}>
      <div className={styles.header}>
        <h3 className={styles.title}>{work.title}</h3>
        <p className={styles.description}>{work.description}</p>
        <div className={styles.tags}>
          {work.tags.map((tag) => (<span className={styles.tag}>{tag}</span>))}
        </div>
      </div>
      <a href={work.link} target="_blank">
        <img src={work.thumbnail.url} alt={work.title} className={styles.thumbnail} />
      </a>
      <div dangerouslySetInnerHTML={{ __html: work.body }}></div>
    </article>
  )
}

export default WorkDetail
