import React from 'react'
import './Rating.scss'

interface RatingProps {
  value: number
  max?: number
  /** Number of reviews, rendered after the stars when given. */
  count?: number
  size?: 'sm' | 'md'
  /** Hides the stars and shows "4.6" next to a single star - for dense tables. */
  compact?: boolean
  label?: string
  className?: string
}

const Star = ({ fill }: { fill: number }) => (
  <span className="ui-rating__star" style={{ '--fill': `${fill * 100}%` } as React.CSSProperties}>
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M10 1.6l2.6 5.3 5.8.85-4.2 4.1 1 5.75L10 14.9l-5.2 2.7 1-5.75-4.2-4.1 5.8-.85z" />
    </svg>
  </span>
)

/** Star rating with partial fills, used on cards, the product page and tables. */
const Rating = ({
  value,
  max = 5,
  count,
  size = 'md',
  compact = false,
  label,
  className,
}: RatingProps) => {
  const safe = Math.max(0, Math.min(max, Number(value) || 0))
  const text = label ?? `${safe.toFixed(1)} out of ${max}`

  if (compact) {
    return (
      <span
        className={['ui-rating', 'ui-rating--compact', `ui-rating--${size}`, className ?? '']
          .filter(Boolean)
          .join(' ')}
        title={text}
      >
        <Star fill={1} />
        <span className="ui-rating__value numeric">{safe.toFixed(1)}</span>
        {count !== undefined && <span className="ui-rating__count">({count})</span>}
      </span>
    )
  }

  return (
    <span
      className={['ui-rating', `ui-rating--${size}`, className ?? ''].filter(Boolean).join(' ')}
      role="img"
      aria-label={text}
    >
      {Array.from({ length: max }, (_, index) => (
        <Star key={index} fill={Math.max(0, Math.min(1, safe - index))} />
      ))}
      {count !== undefined && <span className="ui-rating__count">({count})</span>}
    </span>
  )
}

export default Rating
