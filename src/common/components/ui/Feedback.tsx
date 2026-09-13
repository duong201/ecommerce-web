import React from 'react'
import './Feedback.scss'

// --- Spinner -----------------------------------------------------------------

export const Spinner = ({
  size = 'md',
  label = 'Loading',
}: {
  size?: 'sm' | 'md' | 'lg'
  label?: string
}) => (
  <span className={`ui-spinner ui-spinner--${size}`} role="status" aria-label={label}>
    <span className="ui-spinner__ring" />
  </span>
)

// --- Skeleton ----------------------------------------------------------------

interface SkeletonProps {
  /** Any CSS length; numbers are treated as rem so `width={20}` is 200px. */
  width?: string | number
  height?: string | number
  radius?: string
  className?: string
}

const len = (value?: string | number) => (typeof value === 'number' ? `${value}rem` : value)

export const Skeleton = ({ width, height = 1.6, radius, className }: SkeletonProps) => (
  <span
    className={['ui-skeleton', className ?? ''].filter(Boolean).join(' ')}
    style={{ width: len(width), height: len(height), borderRadius: radius }}
    aria-hidden="true"
  />
)

/** A block of stacked skeleton lines, for card and list placeholders. */
export const SkeletonText = ({ lines = 3 }: { lines?: number }) => (
  <span className="ui-skeleton-text" aria-hidden="true">
    {Array.from({ length: lines }, (_, index) => (
      <Skeleton key={index} width={index === lines - 1 ? '60%' : '100%'} />
    ))}
  </span>
)

// --- Loading / empty / error states ------------------------------------------

interface StateProps {
  icon?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  /** `inline` keeps it compact inside a card; `page` centres it in the viewport. */
  variant?: 'inline' | 'page'
  tone?: 'neutral' | 'danger'
  className?: string
}

export const EmptyState = ({
  icon,
  title,
  description,
  action,
  variant = 'inline',
  tone = 'neutral',
  className,
}: StateProps) => (
  <div
    className={['ui-state', `ui-state--${variant}`, `ui-state--${tone}`, className ?? '']
      .filter(Boolean)
      .join(' ')}
  >
    {icon && <div className="ui-state__icon">{icon}</div>}
    <p className="ui-state__title">{title}</p>
    {description && <p className="ui-state__description">{description}</p>}
    {action && <div className="ui-state__action">{action}</div>}
  </div>
)

/** Centred spinner plus a line of text - the default "still fetching" panel. */
export const LoadingState = ({
  label = 'Loading…',
  variant = 'inline',
}: {
  label?: string
  variant?: 'inline' | 'page'
}) => (
  <div className={`ui-state ui-state--${variant}`} role="status">
    <Spinner size="lg" />
    <p className="ui-state__description">{label}</p>
  </div>
)

// --- Alert -------------------------------------------------------------------

interface AlertProps {
  tone?: 'info' | 'success' | 'warning' | 'danger'
  title?: React.ReactNode
  icon?: React.ReactNode
  action?: React.ReactNode
  className?: string
  children?: React.ReactNode
}

export const Alert = ({ tone = 'info', title, icon, action, className, children }: AlertProps) => (
  <div
    className={['ui-alert', `ui-alert--${tone}`, className ?? ''].filter(Boolean).join(' ')}
    role={tone === 'danger' ? 'alert' : 'status'}
  >
    {icon && <span className="ui-alert__icon">{icon}</span>}
    <div className="ui-alert__body">
      {title && <p className="ui-alert__title">{title}</p>}
      {children && <div className="ui-alert__text">{children}</div>}
    </div>
    {action && <div className="ui-alert__action">{action}</div>}
  </div>
)
