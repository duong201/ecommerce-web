import React from 'react'
import './Card.scss'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** `flat` drops the shadow; `raised` lifts it on hover (use for links). */
  elevation?: 'flat' | 'resting' | 'raised'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  as?: 'div' | 'article' | 'section' | 'aside'
}

/**
 * The surface every panel in the app sits on. Header / body / footer are
 * separate exports so a card can also be built with a scrolling body.
 */
const Card = ({
  elevation = 'resting',
  padding = 'md',
  as: Tag = 'div',
  className,
  children,
  ...rest
}: CardProps) => (
  <Tag
    className={['ui-card', `ui-card--${elevation}`, `ui-card--pad-${padding}`, className ?? '']
      .filter(Boolean)
      .join(' ')}
    {...rest}
  >
    {children}
  </Tag>
)

interface CardHeaderProps {
  title: React.ReactNode
  subtitle?: React.ReactNode
  actions?: React.ReactNode
  className?: string
}

export const CardHeader = ({ title, subtitle, actions, className }: CardHeaderProps) => (
  <div className={['ui-card__header', className ?? ''].filter(Boolean).join(' ')}>
    <div className="ui-card__heading">
      <h3 className="ui-card__title">{title}</h3>
      {subtitle && <p className="ui-card__subtitle">{subtitle}</p>}
    </div>
    {actions && <div className="ui-card__actions">{actions}</div>}
  </div>
)

export const CardBody = ({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) => <div className={['ui-card__body', className ?? ''].filter(Boolean).join(' ')}>{children}</div>

export const CardFooter = ({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) => (
  <div className={['ui-card__footer', className ?? ''].filter(Boolean).join(' ')}>{children}</div>
)

export default Card
