import React, { forwardRef } from 'react'
import './IconButton.scss'

interface IconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Required: the button has no visible text. */
  label: string
  icon: React.ReactNode
  variant?: 'ghost' | 'solid' | 'outline' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  /** Small count bubble, e.g. unread notifications. */
  badge?: number | string
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, icon, variant = 'ghost', size = 'md', badge, className, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={rest.type ?? 'button'}
      className={['ui-icon-btn', `ui-icon-btn--${variant}`, `ui-icon-btn--${size}`, className ?? '']
        .filter(Boolean)
        .join(' ')}
      aria-label={label}
      title={label}
      {...rest}
    >
      <span className="ui-icon-btn__icon" aria-hidden="true">
        {icon}
      </span>
      {badge !== undefined && badge !== 0 && (
        <span className="ui-icon-btn__badge" aria-hidden="true">
          {badge}
        </span>
      )}
    </button>
  )
})

export default IconButton
