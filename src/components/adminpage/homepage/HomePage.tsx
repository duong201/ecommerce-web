import React, { useCallback } from 'react'
import type { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import './HomePage.scss'
import RevenueChart from '../Chart/Chart'
import RevenueTarget from './RevenueTarget'
import TopSellers from './TopSellers'
import { useFetch } from '../../../common/hooks/useFetch'
import { inventoryService, reportService } from '../../../services'
import {
  formatDate,
  formatExpiry,
  formatPrice,
  formatQuantity,
  expiryTone,
} from '../../../common/utils/format'
import { Card, CardHeader, EmptyState, StatCard, Table } from '../../../common/components/ui'
import type { StatTone, TableColumn } from '../../../common/components/ui'
import {
  MonetizationOnOutlinedIcon,
  AccountBalanceWalletOutlinedIcon,
  EventBusyOutlinedIcon,
  StoreMallDirectoryOutlinedIcon,
  PermIdentityIcon,
  DeleteOutlineIcon,
} from '../../../common/components/ui/icons'
import type { DashboardSummary, InventoryBatch, TopProductRow } from '../../../interface'

const EMPTY_SUMMARY: DashboardSummary = {
  revenueToday: 0,
  revenueThisMonth: 0,
  ordersToday: 0,
  ordersPending: 0,
  ordersUnpaid: 0,
  customersTotal: 0,
  productsActive: 0,
  variantsOutOfStock: 0,
  batchesExpiringSoon: 0,
  lossValueThisMonth: 0,
  reviewsPending: 0,
}

interface StatDefinition {
  key: string
  label: string
  tone: StatTone
  icon: React.ReactNode
  to?: string
  linkLabel?: string
  value: (summary: DashboardSummary) => React.ReactNode
  caption?: (summary: DashboardSummary, t: TFunction) => string
  alert?: (summary: DashboardSummary) => boolean
}

/**
 * The six numbers a shop manager checks first thing. Order matters: what needs
 * action today comes before what is merely informative.
 */
const STATS: StatDefinition[] = [
  {
    key: 'orders',
    label: 'admin.dashboard.ordersToHandle',
    tone: 'warning',
    icon: <MonetizationOnOutlinedIcon />,
    to: '/admin/don-hang',
    linkLabel: 'admin.dashboard.openOrders',
    value: (s) => s.ordersPending,
    caption: (s, t) => t('admin.dashboard.stillUnpaid', { count: s.ordersUnpaid }),
    alert: (s) => s.ordersPending > 0,
  },
  {
    key: 'expiring',
    label: 'admin.dashboard.batchesNearExpiry',
    tone: 'danger',
    icon: <EventBusyOutlinedIcon />,
    to: '/admin/kho',
    linkLabel: 'admin.dashboard.openStock',
    value: (s) => s.batchesExpiringSoon,
    caption: (s, t) => t('admin.dashboard.withinTwoDays'),
    alert: (s) => s.batchesExpiringSoon > 0,
  },
  {
    key: 'revenue',
    label: 'admin.dashboard.revenueThisMonth',
    tone: 'success',
    icon: <AccountBalanceWalletOutlinedIcon />,
    value: (s) => formatPrice(s.revenueThisMonth),
    caption: (s, t) => t('admin.dashboard.todayRevenue', { amount: formatPrice(s.revenueToday) }),
  },
  {
    key: 'products',
    label: 'admin.dashboard.productsOnSale',
    tone: 'brand',
    icon: <StoreMallDirectoryOutlinedIcon />,
    to: '/admin/san-pham',
    linkLabel: 'admin.dashboard.manageProducts',
    value: (s) => s.productsActive,
    caption: (s, t) => t('admin.dashboard.variantsOutOfStock', { count: s.variantsOutOfStock }),
    alert: (s) => s.variantsOutOfStock > 0,
  },
  {
    key: 'customers',
    label: 'admin.dashboard.customers',
    tone: 'info',
    icon: <PermIdentityIcon />,
    to: '/admin/nguoi-dung',
    linkLabel: 'admin.dashboard.viewCustomers',
    value: (s) => s.customersTotal,
  },
  {
    key: 'loss',
    label: 'admin.dashboard.writeOffsThisMonth',
    tone: 'accent',
    icon: <DeleteOutlineIcon />,
    to: '/admin/kho',
    linkLabel: 'admin.dashboard.stockLedger',
    value: (s) => formatPrice(s.lossValueThisMonth),
  },
]

const EXPIRING_COLUMNS: TableColumn<InventoryBatch>[] = [
  {
    key: 'batchCode',
    header: 'admin.columns.batch',
    render: (row) => <span className="cell-mono">{row.batchCode}</span>,
  },
  {
    key: 'variant',
    header: 'admin.columns.variant',
    render: (row) => row.variant?.name ?? row.variant?.sku ?? '—',
  },
  {
    key: 'remaining',
    header: 'admin.columns.remaining',
    align: 'right',
    numeric: true,
    render: (row) => formatQuantity(row.remainingQuantity),
  },
  {
    key: 'expiry',
    header: 'admin.columns.expiry',
    align: 'right',
    render: (row) => (
      <span className={`expiry expiry--${expiryTone(row.expiryDate)}`}>
        {formatDate(row.expiryDate)} <em>· {formatExpiry(row.expiryDate)}</em>
      </span>
    ),
  },
]

/** Admin landing page: KPI row, revenue chart, and the two lists that need action. */
const AdminDashboard = () => {
  const { t } = useTranslation()
  const fetchSummary = useCallback(() => reportService.dashboard(), [])
  const { data: summary, loading } = useFetch<DashboardSummary>(fetchSummary, [], EMPTY_SUMMARY)

  const fetchTop = useCallback(() => reportService.topProducts(10), [])
  const { data: topProducts, loading: topLoading } = useFetch<TopProductRow[]>(fetchTop, [], [])

  const fetchExpiring = useCallback(() => inventoryService.expiring(2), [])
  const { data: expiring, loading: expiringLoading } = useFetch<InventoryBatch[]>(
    fetchExpiring,
    [],
    [],
  )

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <h1>{t('admin.dashboard.title')}</h1>
        <p>{t('admin.dashboard.lede')}</p>
      </header>

      <div className="dashboard__stats">
        {STATS.map((stat) => (
          <StatCard
            key={stat.key}
            label={t(stat.label)}
            tone={stat.tone}
            icon={stat.icon}
            to={stat.to}
            linkLabel={stat.linkLabel ? t(stat.linkLabel) : undefined}
            loading={loading}
            value={stat.value(summary)}
            caption={stat.caption?.(summary, t)}
            alert={!loading && (stat.alert?.(summary) ?? false)}
          />
        ))}
      </div>

      <div className="dashboard__charts">
        <RevenueTarget summary={summary} />
        <RevenueChart />
      </div>

      <Card padding="none" className="dashboard__panel">
        <CardHeader
          title={t('admin.dashboard.batchesToday')}
          subtitle={t('admin.dashboard.batchesTodaySubtitle')}
          actions={
            <Link to="/admin/kho" className="ui-btn ui-btn--secondary ui-btn--sm">
              Open stock
            </Link>
          }
        />
        <Table
          columns={EXPIRING_COLUMNS}
          rows={expiring}
          loading={expiringLoading}
          density="compact"
          getRowKey={(row) => row.id}
          emptyTitle={t('admin.dashboard.batchesEmptyTitle')}
          emptyDescription={t('admin.dashboard.batchesEmptyDescription')}
        />
      </Card>

      <Card padding="none" className="dashboard__panel">
        <CardHeader
          title={t('admin.dashboard.topSellers')}
          subtitle={t('admin.dashboard.byRevenue')}
        />
        {topProducts.length === 0 && !topLoading ? (
          <EmptyState
            title={t('admin.dashboard.noSalesTitle')}
            description={t('admin.dashboard.noSalesDescription')}
          />
        ) : (
          <TopSellers rows={topProducts} loading={topLoading} />
        )}
      </Card>
    </div>
  )
}

export default AdminDashboard
