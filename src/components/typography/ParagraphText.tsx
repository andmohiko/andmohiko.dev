import React from 'react'
import classNames from 'classnames'

import styles from './style.module.css'
import type { FontSizes, TextColor } from './types'

type Props = {
  children: React.ReactNode
  weight?: 'normal' | 'bold'
  size?: FontSizes
  color?: TextColor
  textAlign?: 'left' | 'center' | 'right'
}

export const ParagraphText = ({
  children,
  weight = 'normal',
  size = 'md',
  color = 'white',
  textAlign = 'left',
}: Props): React.ReactElement => {
  const getFontSize = (size: FontSizes): number => {
    if (size === 'sm') {
      return 10
    }
    return 12
  }

  return (
    <p
      className={classNames(
        styles.paragraphText,
        styles[`_${color}`],
        styles[`_size${getFontSize(size)}`],
        styles[`_${weight}`],
        styles[`_${textAlign}`],
      )}
    >
      {children}
    </p>
  )
}
