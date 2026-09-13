import React from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '../../../common/components/ui'
import { formatPrice } from '../../../common/utils/format'
import type { DashboardSummary } from '../../../interface'

const MONTHLY_TARGET = 120_000_000

interface RevenueTargetProps {
  summary: DashboardSummary
}

/**
 * Progress toward the monthly revenue target, drawn as an SVG ring.
 *
 * This replaced `react-circular-progressbar`, whose stylesheet hard-coded its
 * own greys and could not follow the theme.
 */
const RevenueTarget = ({ summary }: RevenueTargetProps) => {
  const { t } = useTranslation()
  const ratio = Math.min(1, (Number(summary.revenueThisMonth) || 0) / MONTHLY_TARGET)
  const percent = Math.round(ratio * 100)

  const radius = 52
  const circumference = 2 * Math.PI * radius

  return (
    <Card padding="lg" className="revenue-target">
      <h2>{t('admin.dashboard.monthlyTarget')}</h2>

      <div className="revenue-target__ring">
        <svg viewBox="0 0 120 120" role="img" aria-label={`${percent}% of the monthly target`}>
          <circle className="revenue-target__track" cx="60" cy="60" r={radius} />
          <circle
            className="revenue-target__value"
            cx="60"
            cy="60"
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - ratio)}
          />
        </svg>
        <span className="revenue-target__percent numeric">{percent}%</span>
      </div>

      <p className="revenue-target__today">{t('admin.dashboard.revenueToday')}</p>
      <p className="revenue-target__amount numeric">{formatPrice(summary.revenueToday)}</p>

      <dl className="revenue-target__facts">
        <div>
          <dt>{t('admin.dashboard.thisMonth')}</dt>
          <dd className="numeric">{formatPrice(summary.revenueThisMonth)}</dd>
        </div>
        <div>
          <dt>{t('admin.dashboard.ordersToday')}</dt>
          <dd className="numeric">{summary.ordersToday}</dd>
        </div>
        <div>
          <dt>{t('admin.dashboard.reviewsWaiting')}</dt>
          <dd className="numeric">{summary.reviewsPending}</dd>
        </div>
      </dl>
    </Card>
  )
}

export default RevenueTarget
