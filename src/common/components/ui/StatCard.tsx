import React from 'react'
import { Link } from 'react-router-dom'
import './StatCard.scss'

export type StatTone = 'brand' | 'info' | 'success' | 'warning' | 'danger' | 'accent'

interface StatCardProps {
  label: React.ReactNode
  value: React.ReactNode
  caption?: React.ReactNode
  icon?: React.ReactNode
  tone?: StatTone
  /** Draws attention when the number needs action (unhandled orders, expiries). */
  alert?: boolean
  to?: string
  linkLabel?: string
  loading?: boolean
}

/** Dashboard KPI tile. One tone per metric so the row reads as a palette. */
const StatCard = ({
  label,
  value,
  caption,
  icon,
  tone = 'brand',
  alert = false,
  to,
  linkLabel = 'View',
  loading = false,
}: StatCardProps) => (
  <div
    className={['ui-stat', `ui-stat--${tone}`, alert ? 'is-alert' : ''].filter(Boolean).join(' ')}
    data-testid="widget"
  >
    <div className="ui-stat__top">
      <p className="ui-stat__label">{label}</p>
      {icon && <span className="ui-stat__icon">{icon}</span>}
    </div>

    <p className="ui-stat__value numeric">
      {loading ? <span className="ui-stat__placeholder" /> : value}
    </p>

    {caption && <p className="ui-stat__caption">{caption}</p>}

    {to && (
      <Link className="ui-stat__link" to={to}>
        {linkLabel}
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path
            d="M3.5 8h9M9 4.5L12.5 8 9 11.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>
    )}
  </div>
)

export default StatCard
