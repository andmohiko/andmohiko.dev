import React from 'react'
import classNames from 'classnames'

import styles from './style.module.css'
import type { FontSizes, TextColor, TitleLevel } from './types'

type Props = {
  children: React.ReactNode
  level: TitleLevel
  size?: FontSizes
  color?: TextColor
}

export const TitleText = ({
  children,
  level,
  size = 'md',
  color = 'white',
}: Props): React.ReactElement => {
  const getFontSize = (size: FontSizes): number => {
    if (size === 'xl') {
      return 32
    }
    if (size === 'lg') {
      return 24
    }
    if (size === 'sm') {
      return 14
    }
    if (size === 'xs') {
      return 12
    }
    if (size === '2xs') {
      return 10
    }
    return 16
  }

  if (level === 'h1') {
    return (
      <h1
        className={classNames(
          styles.titleText,
          styles[`_${color}`],
          styles[`_size${getFontSize(size)}`],
        )}
      >
        {children}
      </h1>
    )
  }

  if (level === 'h2') {
    return (
      <h2
        className={classNames(
          styles.titleText,
          styles[`_${color}`],
          styles[`_size${getFontSize(size)}`],
        )}
      >
        {children}
      </h2>
    )
  }

  if (level === 'h3') {
    return (
      <h3
        className={classNames(
          styles.titleText,
          styles[`_${color}`],
          styles[`_size${getFontSize(size)}`],
        )}
      >
        {children}
      </h3>
    )
  }

  if (level === 'h4') {
    return (
      <h4
        className={classNames(
          styles.titleText,
          styles[`_${color}`],
          styles[`_size${getFontSize(size)}`],
        )}
      >
        {children}
      </h4>
    )
  }

  if (level === 'h5') {
    return (
      <h5
        className={classNames(
          styles.titleText,
          styles[`_${color}`],
          styles[`_size${getFontSize(size)}`],
        )}
      >
        {children}
      </h5>
    )
  }

  if (level === 'h6') {
    return (
      <h6
        className={classNames(
          styles.titleText,
          styles[`_${color}`],
          styles[`_size${getFontSize(size)}`],
        )}
      >
        {children}
      </h6>
    )
  }

  return (
    <span
      className={classNames(
        styles.titleText,
        styles[`_${color}`],
        styles[`_size${getFontSize(size)}`],
      )}
    >
      {children}
    </span>
  )
}
