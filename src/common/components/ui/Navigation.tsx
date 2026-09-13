import React from 'react'
import { useTranslation } from 'react-i18next'
import Button from './Button'
import './Navigation.scss'

// --- Pagination --------------------------------------------------------------

interface PaginationProps {
  page: number
  totalPages: number
  total?: number
  onChange: (page: number) => void
  className?: string
}

/**
 * Page controls with a small window of numbered pages around the current one,
 * so a 40-page order list does not render 40 buttons.
 */
export const Pagination = ({ page, totalPages, total, onChange, className }: PaginationProps) => {
  const { t } = useTranslation()
  if (totalPages <= 1) return null

  const radius = 1
  const pages: (number | 'gap')[] = []
  for (let index = 1; index <= totalPages; index += 1) {
    const nearCurrent = Math.abs(index - page) <= radius
    if (index === 1 || index === totalPages || nearCurrent) {
      pages.push(index)
    } else if (pages[pages.length - 1] !== 'gap') {
      pages.push('gap')
    }
  }

  return (
    <nav
      className={['ui-pagination', className ?? ''].filter(Boolean).join(' ')}
      aria-label={t('ui.pagination')}
    >
      <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        {t('ui.previousPage')}
      </Button>

      <ul className="ui-pagination__pages">
        {pages.map((entry, index) =>
          entry === 'gap' ? (
            <li key={`gap-${index}`} className="ui-pagination__gap" aria-hidden="true">
              …
            </li>
          ) : (
            <li key={entry}>
              <button
                type="button"
                className={entry === page ? 'is-current' : ''}
                aria-current={entry === page ? 'page' : undefined}
                onClick={() => onChange(entry)}
              >
                {entry}
              </button>
            </li>
          ),
        )}
      </ul>

      <Button
        variant="secondary"
        size="sm"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
      >
        {t('ui.nextPage')}
      </Button>

      {total !== undefined && (
        <span className="ui-pagination__total">{t('ui.inTotal', { count: total })}</span>
      )}
    </nav>
  )
}

// --- Segmented control / filter chips ----------------------------------------

export interface SegmentOption<T extends string> {
  value: T
  label: React.ReactNode
  count?: number
}

interface SegmentedProps<T extends string> {
  options: SegmentOption<T>[]
  value: T
  onChange: (value: T) => void
  /** `tabs` underlines the active item; `chips` fills a pill. */
  variant?: 'tabs' | 'chips'
  ariaLabel?: string
  className?: string
}

export const Segmented = <T extends string>({
  options,
  value,
  onChange,
  variant = 'chips',
  ariaLabel,
  className,
}: SegmentedProps<T>) => (
  <div
    role="tablist"
    aria-label={ariaLabel}
    className={['ui-segmented', `ui-segmented--${variant}`, className ?? '']
      .filter(Boolean)
      .join(' ')}
  >
    {options.map((option) => (
      <button
        key={option.value}
        type="button"
        role="tab"
        aria-selected={option.value === value}
        className={option.value === value ? 'is-active' : ''}
        onClick={() => onChange(option.value)}
      >
        {option.label}
        {option.count !== undefined && <span className="ui-segmented__count">{option.count}</span>}
      </button>
    ))}
  </div>
)

// --- Page header -------------------------------------------------------------

interface PageHeaderProps {
  title: React.ReactNode
  /** Small line above the title - breadcrumb-ish context. */
  eyebrow?: React.ReactNode
  description?: React.ReactNode
  actions?: React.ReactNode
  /** Filters, search and tabs, rendered on a second line. */
  toolbar?: React.ReactNode
  className?: string
}

export const PageHeader = ({
  title,
  eyebrow,
  description,
  actions,
  toolbar,
  className,
}: PageHeaderProps) => (
  <header className={['ui-page-header', className ?? ''].filter(Boolean).join(' ')}>
    <div className="ui-page-header__top">
      <div className="ui-page-header__heading">
        {eyebrow && <p className="ui-page-header__eyebrow">{eyebrow}</p>}
        <h1 className="ui-page-header__title">{title}</h1>
        {description && <p className="ui-page-header__description">{description}</p>}
      </div>
      {actions && <div className="ui-page-header__actions">{actions}</div>}
    </div>

    {toolbar && <div className="ui-page-header__toolbar">{toolbar}</div>}
  </header>
)
