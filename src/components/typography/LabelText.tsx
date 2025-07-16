import React from 'react'
import classNames from 'classnames'

import styles from './style.module.css'
import type { FontSizes, TextColor } from './types'

type Props = {
  children: React.ReactNode
  size?: FontSizes
  color?: TextColor
}

export const LabelText = ({
  children,
  size = 'md',
  color = 'white',
}: Props): React.ReactElement => {
  const getFontSize = (size: FontSizes): number => {
    if (size === 'lg') {
      return 24
    }
    if (size === 'sm') {
      return 12
    }
    return 16
  }

  return (
    <span
      className={classNames(
        styles.labelText,
        styles[`_${color}`],
        styles[`_size${getFontSize(size)}`],
      )}
    >
      {children}
    </span>
  )
}
