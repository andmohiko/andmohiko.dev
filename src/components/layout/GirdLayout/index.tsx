import styles from './style.module.css'

export const GridTwoColumnLayout = ({
  children,
}: {
  children: React.ReactNode
}): React.ReactNode => {
  return <div className={styles.gridTwoColumnLayout}>{children}</div>
}

export const GridThreeColumnLayout = ({
  children,
}: {
  children: React.ReactNode
}): React.ReactNode => {
  return <div className={styles.gridThreeColumnLayout}>{children}</div>
}
