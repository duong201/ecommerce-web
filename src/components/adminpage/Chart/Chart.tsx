import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import './Chart.scss'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useFetch } from '../../../common/hooks/useFetch'
import { reportService } from '../../../services'
import { formatPrice } from '../../../common/utils/format'
import { Card, EmptyState, LoadingState } from '../../../common/components/ui'
import type { RevenuePoint } from '../../../interface'

/** Axis labels: full amounts do not fit, so millions and thousands are abbreviated. */
const compactAmount = (value: number): string => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${Math.round(value / 1_000)}k`
  return String(value)
}

const RevenueChart = () => {
  const { t } = useTranslation()
  const fetchRevenue = useCallback(() => reportService.revenue(30), [])
  const { data: series, loading } = useFetch<RevenuePoint[]>(fetchRevenue, [], [])

  const data = series.map((point) => ({
    name: point.date.slice(5),
    total: point.revenue,
    orders: point.orders,
  }))

  return (
    <Card padding="lg" className="revenue-chart">
      <h2>{t('admin.dashboard.revenue30')}</h2>

      <div className="revenue-chart__body" data-testid="chart-body">
        {loading && <LoadingState label={t('admin.dashboard.chartLoading')} />}

        {!loading && data.length === 0 && (
          <EmptyState
            title={t('admin.dashboard.noRevenueTitle')}
            description={t('admin.dashboard.noRevenueDescription')}
          />
        )}

        {!loading && data.length > 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                {/* Fades to transparent so the card surface shows through in both themes. */}
                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--brand)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--brand)" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid stroke="var(--border-subtle)" strokeDasharray="4 4" vertical={false} />
              <XAxis
                dataKey="name"
                minTickGap={28}
                tickLine={false}
                axisLine={false}
                tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
              />
              <YAxis
                width={52}
                tickFormatter={compactAmount}
                tickLine={false}
                axisLine={false}
                tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
              />
              <Tooltip
                cursor={{ stroke: 'var(--border-strong)', strokeDasharray: '4 4' }}
                formatter={(value) => [formatPrice(Number(value)), t('admin.dashboard.revenue')]}
                contentStyle={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  boxShadow: '0 12px 16px -4px rgba(16,24,40,.08)',
                  color: 'var(--text-strong)',
                  fontSize: '13px',
                }}
                labelStyle={{ color: 'var(--text-muted)' }}
              />
              <Area
                type="monotone"
                dataKey="total"
                name={t('admin.dashboard.revenue')}
                stroke="var(--brand)"
                strokeWidth={2}
                fill="url(#revenueFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  )
}

export default RevenueChart
