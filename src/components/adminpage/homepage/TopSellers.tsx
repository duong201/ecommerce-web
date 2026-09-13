import React from 'react'
import { formatPrice, formatQuantity } from '../../../common/utils/format'
import { LoadingState } from '../../../common/components/ui'
import type { TopProductRow } from '../../../interface'

interface TopSellersProps {
  rows: TopProductRow[]
  loading?: boolean
}

/**
 * Ranked bar list rather than a plain table: the bar length encodes each
 * product's share of the leader's revenue, so the shape of the month is
 * readable without comparing seven-digit numbers by eye.
 */
const TopSellers = ({ rows, loading = false }: TopSellersProps) => {
  if (loading) return <LoadingState />

  const max = Math.max(...rows.map((row) => Number(row.revenue) || 0), 1)

  return (
    <ol className="top-sellers">
      {rows.map((row, index) => {
        const revenue = Number(row.revenue) || 0

        return (
          <li className="top-sellers__row" key={`${row.sku}-${row.productName}`}>
            <span className="top-sellers__rank">{index + 1}</span>

            <div className="top-sellers__body">
              <div className="top-sellers__head">
                <span className="top-sellers__name">{row.productName}</span>
                <span className="top-sellers__revenue numeric">{formatPrice(revenue)}</span>
              </div>

              <div className="top-sellers__bar">
                <span style={{ width: `${(revenue / max) * 100}%` }} />
              </div>

              <p className="top-sellers__meta">
                <span className="cell-mono">{row.sku}</span>
                <span className="numeric">{formatQuantity(row.quantitySold)} sold</span>
              </p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

export default TopSellers
