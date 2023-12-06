import type { ReactNode } from 'react'
import styles from './style.module.scss'

type Props = {
  children: ReactNode
  isOpen: boolean
  onClose: () => void
}

const BaseModal = ({ children, isOpen, onClose }: Props): ReactNode => {
  return (
    <>
      <dialog open={isOpen} aria-modal="true" className={styles.baseModal}>
        <button className={styles.closeButton} onClick={onClose}>
          <img src="/images/svgs/close.svg" alt="close" />
        </button>
        {children}
      </dialog>
      <div className={styles.scrim} onClick={onClose} />
    </>
  )
}

export default BaseModal
