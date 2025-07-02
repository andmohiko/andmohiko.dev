import { useState } from "react"
import type { ReactNode } from "react"
import type { Work } from "~/types/work"
import WorkCard from "~/components/cards/WorkCard"
import WorkDetailModal from "~/components/modals/WorkDetailModal"

import styles from './style.module.scss'

type Props = {
  works: Work[]
}

const WorkList = ({ works }: Props): ReactNode => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [selectedWork, setSelectedWork] = useState<Work | null>(null)

  const showDetail = (work: Work) => {
    setSelectedWork(work)
    setIsOpen(true)
    console.log('showDetail')
  }

  return (
    <>
      <div className={styles.worksList}>
        {works.map((work: Work) => (
          <WorkCard key={work.id} work={work} onClick={() => showDetail(work)} />
        ))}
      </div>

      {isOpen && selectedWork && (
        <WorkDetailModal work={selectedWork} isOpen={isOpen} onClose={() => setIsOpen(false)} />
      )}
    </>
  )
}

export default WorkList
