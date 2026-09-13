import React from 'react'
import type { TFunction } from 'i18next'
import { translateLabel } from '../utils/labels'
import { NO_IMAGE_URL } from '../constants'
import {
  formatDate,
  formatDateTime,
  formatExpiry,
  formatPrice,
  formatQuantity,
  expiryTone,
} from '../utils/format'
import { Badge, Button, Rating, TableActions, TableCellMedia } from '../components/ui'
import type { BadgeTone, TableColumn } from '../components/ui'
import type {
  Coupon,
  DeliverySlot,
  InventoryBatch,
  Order,
  OrderStatus,
  Product,
  ProductStatus,
  Review,
  ReviewStatus,
  StockMovement,
  Supplier,
  User,
} from '../../interface'

/**
 * Status-to-colour maps.
 *
 * These live in one place because the same order status is rendered on the
 * admin list, the shopper's order history and the confirmation page - three
 * screens that previously each picked their own colour.
 */
export const ORDER_STATUS_TONE: Record<OrderStatus, BadgeTone> = {
  pending: 'warning',
  confirmed: 'info',
  picking: 'accent',
  delivering: 'brand',
  completed: 'success',
  cancelled: 'danger',
}

export const PRODUCT_STATUS_TONE: Record<ProductStatus, BadgeTone> = {
  draft: 'neutral',
  active: 'success',
  out_of_season: 'warning',
  archived: 'neutral',
}

export const REVIEW_STATUS_TONE: Record<ReviewStatus, BadgeTone> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'danger',
}

const activeBadge = (active: boolean, onLabel: string, offLabel: string) => (
  <Badge tone={active ? 'success' : 'neutral'} size="sm" dot>
    {active ? onLabel : offLabel}
  </Badge>
)

const expiryCell = (date?: string | null, withCountdown = true) => {
  if (!date) return '—'
  const tone = expiryTone(date)
  return (
    <span className={`expiry expiry--${tone}`}>
      {formatDate(date)}
      {withCountdown && <em> · {formatExpiry(date)}</em>}
    </span>
  )
}

// --- products ----------------------------------------------------------------

export const buildProductColumns = (t: TFunction): TableColumn<Product>[] => [
  {
    key: 'product',
    header: t('admin.columns.product'),
    width: '32%',
    render: (row) => (
      <TableCellMedia
        src={row.coverImageUrl ?? NO_IMAGE_URL}
        title={row.name}
        subtitle={row.category?.name}
      />
    ),
  },
  { key: 'origin', header: t('admin.columns.origin'), render: (row) => row.origin ?? '—' },
  {
    key: 'variants',
    header: t('admin.columns.variants'),
    align: 'center',
    numeric: true,
    render: (row) => `${row.variants?.length ?? 0} SKU`,
  },
  {
    key: 'price',
    header: t('admin.columns.from'),
    align: 'right',
    numeric: true,
    render: (row) => (row.priceFrom !== null ? formatPrice(row.priceFrom) : '—'),
  },
  {
    key: 'stock',
    header: t('admin.columns.available'),
    align: 'right',
    numeric: true,
    render: (row) => (
      <span className={row.availableQuantity > 0 ? 'tone-ok' : 'tone-bad'}>
        {formatQuantity(row.availableQuantity)}
      </span>
    ),
  },
  {
    key: 'status',
    header: t('admin.columns.status'),
    align: 'center',
    render: (row) => (
      <Badge tone={PRODUCT_STATUS_TONE[row.status] ?? 'neutral'} size="sm" dot>
        {row.status.replace('_', ' ')}
      </Badge>
    ),
  },
]

// --- orders ------------------------------------------------------------------

export const buildOrderColumns = (t: TFunction): TableColumn<Order>[] => [
  {
    key: 'orderNumber',
    header: t('admin.columns.order'),
    render: (row) => <span className="cell-mono">{row.orderNumber}</span>,
  },
  {
    key: 'customerName',
    header: t('admin.columns.customer'),
    render: (row) => <TableCellMedia title={row.customerName} subtitle={row.customerPhone} />,
  },
  {
    key: 'items',
    header: t('admin.columns.items'),
    align: 'center',
    numeric: true,
    render: (row) => row.items?.length ?? 0,
  },
  {
    key: 'grandTotalAmount',
    header: t('admin.columns.total'),
    align: 'right',
    numeric: true,
    render: (row) => formatPrice(row.grandTotalAmount),
  },
  {
    key: 'deliveryDate',
    header: t('admin.columns.delivery'),
    render: (row) => formatDate(row.deliveryDate),
  },
  {
    key: 'status',
    header: t('admin.columns.status'),
    align: 'center',
    render: (row) => (
      <Badge tone={ORDER_STATUS_TONE[row.status] ?? 'neutral'} size="sm" dot>
        {translateLabel('orderStatus', row.status)}
      </Badge>
    ),
  },
  {
    key: 'paymentStatus',
    header: t('admin.columns.payment'),
    align: 'center',
    render: (row) => (
      <Badge tone={row.paymentStatus === 'paid' ? 'success' : 'neutral'} size="sm">
        {translateLabel('paymentStatus', row.paymentStatus)}
      </Badge>
    ),
  },
]

// --- users -------------------------------------------------------------------

export const buildUserColumns = (
  t: TFunction,
  {
    onDelete,
  }: {
    onDelete: (user: User) => void
  },
): TableColumn<User>[] => [
  {
    key: 'fullName',
    header: t('admin.columns.name'),
    width: '28%',
    render: (row) => <TableCellMedia title={row.fullName} subtitle={row.email ?? undefined} />,
  },
  { key: 'phone', header: t('admin.columns.phone'), render: (row) => row.phone ?? '—' },
  {
    key: 'role',
    header: t('admin.columns.role'),
    render: (row) => translateLabel('role', row.roleId),
  },
  {
    key: 'isActive',
    header: t('admin.columns.status'),
    align: 'center',
    render: (row) => activeBadge(row.isActive, t('admin.badge.active'), t('admin.badge.disabled')),
  },
  {
    key: 'action',
    header: '',
    align: 'right',
    width: '1%',
    render: (row) => (
      <TableActions>
        <Button variant="link" size="sm" className="is-danger" onClick={() => onDelete(row)}>
          Disable
        </Button>
      </TableActions>
    ),
  },
]

// --- inventory ---------------------------------------------------------------

export const buildBatchColumns = (t: TFunction): TableColumn<InventoryBatch>[] => [
  {
    key: 'batchCode',
    header: t('admin.columns.batch'),
    render: (row) => <span className="cell-mono">{row.batchCode}</span>,
  },
  {
    key: 'product',
    header: t('admin.columns.variant'),
    width: '24%',
    render: (row) => (
      <TableCellMedia title={row.variant?.name ?? row.variantId} subtitle={row.variant?.sku} />
    ),
  },
  {
    key: 'supplier',
    header: t('admin.columns.supplier'),
    render: (row) => row.supplier?.name ?? '—',
  },
  {
    key: 'remaining',
    header: t('admin.columns.remaining'),
    align: 'right',
    numeric: true,
    render: (row) =>
      `${formatQuantity(row.remainingQuantity)} / ${formatQuantity(row.initialQuantity)}`,
  },
  {
    key: 'expiry',
    header: t('admin.columns.expiry'),
    // Colour is driven by days remaining - the whole point of batch tracking.
    render: (row) => expiryCell(row.expiryDate),
  },
  {
    key: 'unitCost',
    header: t('admin.columns.unitCost'),
    align: 'right',
    numeric: true,
    render: (row) => formatPrice(row.unitCostAmount),
  },
  {
    key: 'markdown',
    header: t('admin.columns.markdown'),
    align: 'right',
    numeric: true,
    render: (row) =>
      row.markdownPriceAmount ? (
        <span className="tone-bad">{formatPrice(row.markdownPriceAmount)}</span>
      ) : (
        '—'
      ),
  },
  {
    key: 'status',
    header: t('admin.columns.status'),
    align: 'center',
    render: (row) => (
      <Badge tone={row.status === 'active' ? 'success' : 'neutral'} size="sm" dot>
        {translateLabel('batchStatus', row.status)}
      </Badge>
    ),
  },
]

export const buildMovementColumns = (t: TFunction): TableColumn<StockMovement>[] => [
  {
    key: 'createdAt',
    header: t('admin.columns.when'),
    render: (row) => formatDateTime(row.createdAt),
  },
  {
    key: 'product',
    header: t('admin.columns.variant'),
    render: (row) => <span className="cell-mono">{row.variant?.sku ?? row.variantId}</span>,
  },
  {
    key: 'type',
    header: t('admin.columns.type'),
    render: (row) => translateLabel('movementType', row.type),
  },
  {
    key: 'quantityDelta',
    header: t('admin.columns.change'),
    align: 'right',
    numeric: true,
    render: (row) => {
      const delta = Number(row.quantityDelta)
      return (
        <span className={delta < 0 ? 'tone-bad' : 'tone-ok'}>
          {delta > 0 ? '+' : ''}
          {formatQuantity(delta)}
        </span>
      )
    },
  },
  {
    key: 'quantityAfter',
    header: t('admin.columns.stockAfter'),
    align: 'right',
    numeric: true,
    render: (row) => formatQuantity(row.quantityAfter),
  },
  { key: 'reason', header: t('admin.columns.reason'), render: (row) => row.reason ?? '—' },
]

// --- suppliers ---------------------------------------------------------------

export const buildSupplierColumns = (t: TFunction): TableColumn<Supplier>[] => [
  {
    key: 'code',
    header: t('admin.columns.code'),
    render: (row) => <span className="cell-mono">{row.code}</span>,
  },
  {
    key: 'name',
    header: t('admin.columns.supplier'),
    width: '26%',
    render: (row) => <TableCellMedia title={row.name} subtitle={row.province ?? undefined} />,
  },
  {
    key: 'certification',
    header: t('admin.columns.certification'),
    render: (row) =>
      row.certification && row.certification !== 'none' ? (
        <Badge tone="info" size="sm">
          {translateLabel('certification', row.certification)}
        </Badge>
      ) : (
        '—'
      ),
  },
  {
    key: 'certExpiry',
    header: t('admin.columns.certExpires'),
    render: (row) => expiryCell(row.certExpiry, false),
  },
  { key: 'phone', header: t('admin.columns.phone'), render: (row) => row.phone ?? '—' },
  {
    key: 'isActive',
    header: t('admin.columns.status'),
    align: 'center',
    render: (row) => activeBadge(row.isActive, t('admin.badge.active'), t('admin.badge.inactive')),
  },
]

// --- delivery slots ----------------------------------------------------------

export const buildSlotColumns = (t: TFunction): TableColumn<DeliverySlot>[] => [
  { key: 'slotDate', header: t('admin.columns.date'), render: (row) => formatDate(row.slotDate) },
  { key: 'label', header: t('admin.columns.slot') },
  {
    key: 'capacity',
    header: t('admin.columns.booked'),
    align: 'center',
    numeric: true,
    render: (row) => `${row.bookedCount} / ${row.maxOrders}`,
  },
  {
    key: 'remaining',
    header: t('admin.columns.remaining'),
    align: 'right',
    numeric: true,
    render: (row) => (
      <span className={row.remaining > 0 ? 'tone-ok' : 'tone-bad'}>{row.remaining}</span>
    ),
  },
  {
    key: 'isActive',
    header: t('admin.columns.status'),
    align: 'center',
    render: (row) => activeBadge(row.isActive, t('admin.badge.accepting'), t('admin.badge.closed')),
  },
]

// --- coupons -----------------------------------------------------------------

export const buildCouponColumns = (t: TFunction): TableColumn<Coupon>[] => [
  {
    key: 'code',
    header: t('admin.columns.code'),
    render: (row) => <span className="cell-mono">{row.code}</span>,
  },
  {
    key: 'name',
    header: t('admin.columns.programme'),
    width: '24%',
    render: (row) => <TableCellMedia title={row.name} />,
  },
  {
    key: 'value',
    header: t('admin.columns.value'),
    align: 'right',
    numeric: true,
    render: (row) => {
      if (row.type === 'percentage') return `${Number(row.value)}%`
      if (row.type === 'free_delivery') return t('admin.badge.freeDelivery')
      return formatPrice(row.value)
    },
  },
  {
    key: 'minOrderAmount',
    header: t('admin.columns.minimumOrder'),
    align: 'right',
    numeric: true,
    render: (row) => formatPrice(row.minOrderAmount),
  },
  {
    key: 'usage',
    header: t('admin.columns.used'),
    align: 'center',
    numeric: true,
    render: (row) => `${row.usedCount}${row.usageLimit !== null ? ` / ${row.usageLimit}` : ''}`,
  },
  {
    key: 'endsAt',
    header: t('admin.columns.ends'),
    render: (row) => (row.endsAt ? formatDate(row.endsAt) : t('admin.badge.noEndDate')),
  },
  {
    key: 'isActive',
    header: t('admin.columns.status'),
    align: 'center',
    render: (row) => activeBadge(row.isActive, t('admin.badge.active'), t('admin.badge.paused')),
  },
]

// --- reviews -----------------------------------------------------------------

export const buildReviewColumns = (
  t: TFunction,
  {
    onApprove,
    onReject,
  }: {
    onApprove: (id: string) => void
    onReject: (id: string) => void
  },
): TableColumn<Review>[] => [
  {
    key: 'createdAt',
    header: t('admin.columns.written'),
    render: (row) => formatDate(row.createdAt),
  },
  {
    key: 'product',
    header: t('admin.columns.product'),
    render: (row) => <TableCellMedia title={row.product?.name ?? '—'} />,
  },
  {
    key: 'user',
    header: t('admin.columns.customer'),
    render: (row) => (
      <TableCellMedia
        title={row.user?.fullName ?? t('admin.badge.anonymous')}
        subtitle={row.orderItemId ? t('admin.badge.verifiedPurchase') : undefined}
      />
    ),
  },
  {
    key: 'rating',
    header: t('admin.columns.rating'),
    align: 'center',
    render: (row) => <Rating value={row.rating} size="sm" compact />,
  },
  {
    key: 'freshnessRating',
    header: t('admin.columns.freshness'),
    align: 'center',
    render: (row) =>
      row.freshnessRating ? <Rating value={row.freshnessRating} size="sm" compact /> : '—',
  },
  {
    key: 'content',
    header: t('admin.columns.comment'),
    width: '26%',
    render: (row) => <span className="cell-clamp">{row.content ?? '—'}</span>,
  },
  {
    key: 'status',
    header: t('admin.columns.status'),
    align: 'center',
    render: (row) => (
      <Badge tone={REVIEW_STATUS_TONE[row.status] ?? 'neutral'} size="sm" dot>
        {translateLabel('reviewStatus', row.status)}
      </Badge>
    ),
  },
  {
    key: 'action',
    header: '',
    align: 'right',
    render: (row) =>
      row.status === 'pending' ? (
        <TableActions>
          <Button variant="link" size="sm" onClick={() => onApprove(row.id)}>
            Approve
          </Button>
          <Button variant="link" size="sm" className="is-danger" onClick={() => onReject(row.id)}>
            Reject
          </Button>
        </TableActions>
      ) : null,
  },
]
