import React from 'react'
import './Badge.scss'

export type BadgeTone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info' | 'accent'

interface BadgeProps {
  tone?: BadgeTone
  /** `solid` for a filled pill, `soft` (default) for a tinted one. */
  variant?: 'soft' | 'solid' | 'outline'
  size?: 'sm' | 'md'
  /** Shows a leading dot - useful for order/stock status pills. */
  dot?: boolean
  icon?: React.ReactNode
  className?: string
  children: React.ReactNode
}

const Badge = ({
  tone = 'neutral',
  variant = 'soft',
  size = 'md',
  dot,
  icon,
  className,
  children,
}: BadgeProps) => (
  <span
    className={[
      'ui-badge',
      `ui-badge--${tone}`,
      `ui-badge--${variant}`,
      `ui-badge--${size}`,
      className ?? '',
    ]
      .filter(Boolean)
      .join(' ')}
  >
    {dot && <span className="ui-badge__dot" aria-hidden="true" />}
    {icon && <span className="ui-badge__icon">{icon}</span>}
    {children}
  </span>
)

export default Badge
