import React from 'react'
import classNames from 'classnames'

import styles from './style.module.css'
import type { FontSizes, TextColor, TextOpacity } from './types'

type Props = {
  children: React.ReactNode
  weight?: 'normal' | 'bold'
  size?: FontSizes
  color?: TextColor
  textAlign?: 'left' | 'center' | 'right'
  opacity?: TextOpacity
}

export const ParagraphText = ({
  children,
  weight = 'normal',
  size = 'md',
  color = 'white',
  textAlign = 'left',
  opacity = '100',
}: Props): React.ReactElement => {
  const getFontSize = (size: FontSizes): number => {
    if (size === 'lg') {
      return 14
    }
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
        styles[`_opacity${opacity}`],
      )}
    >
      {children}
    </p>
  )
}
