import { LabelText } from '@/components/typography/LabelText'
import styles from './style.module.css'

type Props = {
  label: string
}

export const LabelBadge: React.FC<Props> = ({ label }) => {
  return (
    <div className={styles.labelBadge}>
      <LabelText size="sm" color="primary">
        {label}
      </LabelText>
    </div>
  )
}
