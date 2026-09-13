import React from 'react'
import { useTranslation } from 'react-i18next'
import { LoadingState, EmptyState } from './Feedback'
import './Table.scss'

export interface TableColumn<T> {
  key: string
  header: React.ReactNode
  /** Column body; falls back to `row[key]` when omitted. */
  render?: (row: T) => React.ReactNode
  align?: 'left' | 'center' | 'right'
  /** Any CSS width - keeps narrow columns (status, actions) from stretching. */
  width?: string
  /** Adds `numeric` so figures line up on the decimal. */
  numeric?: boolean
  className?: string
}

interface TableProps<T> {
  columns: TableColumn<T>[]
  rows: T[]
  getRowKey?: (row: T) => string | number
  loading?: boolean
  emptyTitle?: string
  emptyDescription?: string
  emptyAction?: React.ReactNode
  /** Renders an extra full-width row directly under a matching row. */
  renderExpanded?: (row: T) => React.ReactNode
  onRowClick?: (row: T) => void
  /** Compact row height for dense admin lists. */
  density?: 'comfortable' | 'compact'
  caption?: string
  className?: string
}

/**
 * The single table used across the admin. It is a plain semantic <table> inside
 * a horizontal scroll container, so wide admin grids scroll on their own
 * instead of pushing the page sideways, and the header row stays put while the
 * body scrolls vertically.
 */
const Table = <T,>({
  columns,
  rows,
  getRowKey = (row: T) => (row as { id: string | number }).id,
  loading = false,
  emptyTitle,
  emptyDescription,
  emptyAction,
  renderExpanded,
  onRowClick,
  density = 'comfortable',
  caption,
  className,
}: TableProps<T>) => {
  const { t } = useTranslation()

  if (loading) return <LoadingState />
  if (rows.length === 0) {
    return (
      <EmptyState
        title={emptyTitle ?? t('ui.nothingToShow')}
        description={emptyDescription}
        action={emptyAction}
      />
    )
  }

  return (
    <div
      className={['ui-table-wrap', `ui-table-wrap--${density}`, className ?? '']
        .filter(Boolean)
        .join(' ')}
    >
      <table className="ui-table">
        {caption && <caption className="ui-table__caption">{caption}</caption>}

        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                style={{ width: column.width }}
                className={[
                  `is-${column.align ?? 'left'}`,
                  column.numeric ? 'numeric' : '',
                  column.className ?? '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => {
            const key = getRowKey(row)
            const expanded = renderExpanded?.(row)

            return (
              <React.Fragment key={key}>
                <tr
                  className={onRowClick ? 'is-clickable' : undefined}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      data-label={typeof column.header === 'string' ? column.header : undefined}
                      className={[
                        `is-${column.align ?? 'left'}`,
                        column.numeric ? 'numeric' : '',
                        column.className ?? '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    >
                      {column.render
                        ? column.render(row)
                        : ((row as Record<string, unknown>)[column.key] as React.ReactNode)}
                    </td>
                  ))}
                </tr>

                {expanded && (
                  <tr className="ui-table__expanded">
                    <td colSpan={columns.length}>{expanded}</td>
                  </tr>
                )}
              </React.Fragment>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

/** Cell helper: a thumbnail next to a wrapping label. */
export const TableCellMedia = ({
  src,
  alt = '',
  title,
  subtitle,
}: {
  src?: string | null
  alt?: string
  title: React.ReactNode
  subtitle?: React.ReactNode
}) => (
  <div className="ui-table-media">
    {src && <img src={src} alt={alt} loading="lazy" />}
    <span className="ui-table-media__text">
      <span className="ui-table-media__title">{title}</span>
      {subtitle && <span className="ui-table-media__subtitle">{subtitle}</span>}
    </span>
  </div>
)

/** Cell helper: right-aligned row of link-styled buttons. */
export const TableActions = ({ children }: { children: React.ReactNode }) => (
  <div className="ui-table-actions">{children}</div>
)

export default Table
