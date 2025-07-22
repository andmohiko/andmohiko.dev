import styles from './style.module.css'

export const GridTwoColumnLayout = ({
  children,
  gap = 16,
}: {
  children: React.ReactNode
  gap?: number
}): React.ReactNode => {
  return (
    <div className={styles.gridTwoColumnLayout} style={{ gap: `${gap}px` }}>
      {children}
    </div>
  )
}

export const GridThreeColumnLayout = ({
  children,
}: {
  children: React.ReactNode
}): React.ReactNode => {
  return <div className={styles.gridThreeColumnLayout}>{children}</div>
}
