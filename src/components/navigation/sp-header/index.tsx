import Image from 'next/image'
import styles from './style.module.css'
import { HumbergarMenu } from './humbergar-menu'

export const SPHeader = () => {
  return (
    <>
      <header className={styles.spHeader}>
        <Image
          src="/images/logo_white.png"
          alt="logo"
          width={124}
          height={32}
        />
        <HumbergarMenu />
      </header>

      <div className={styles.spacer} />
    </>
  )
}
