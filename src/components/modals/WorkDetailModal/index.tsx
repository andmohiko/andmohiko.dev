import type { ReactNode } from 'react'
import WorkDetail from '~/components/cards/WorkDetail/index.tsx'
import BaseModal from '~/components/modals/BaseModal'
import type { Work } from '~/types/work'

type Props = {
  work: Work
  isOpen: boolean
  onClose: () => void
}

const WorkDetailModal = ({ work, isOpen, onClose }: Props): ReactNode => {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <WorkDetail work={work} />
    </BaseModal>
  )
}

export default WorkDetailModal
