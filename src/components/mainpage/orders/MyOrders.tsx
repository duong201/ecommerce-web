import { useTranslation } from 'react-i18next'
import React, { useCallback, useState } from 'react'
import { translateLabel } from '../../../common/utils/labels'
import { ExpandMoreIcon, ReceiptLongOutlinedIcon } from '../../../common/components/ui/icons'
import './MyOrders.scss'
import { useFetch } from '../../../common/hooks/useFetch'
import { orderService } from '../../../services'

import {
  formatDate,
  formatDateTime,
  formatPrice,
  formatQuantity,
  formatUnit,
} from '../../../common/utils/format'
import { isLoggedIn } from '../../../common/utils/session'
import { toast } from '../../../common/utils/toast'
import {
  Badge,
  Button,
  EmptyState,
  LinkButton,
  LoadingState,
  Pagination,
  useDialog,
} from '../../../common/components/ui'
import type { BadgeTone } from '../../../common/components/ui'
import type { Order, OrderStatus, Paginated } from '../../../interface'

const EMPTY: Paginated<Order> = {
  data: [],
  meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
}

const CANCELLABLE: OrderStatus[] = ['pending', 'confirmed']

/** One tone per lifecycle stage, so the status colour is consistent everywhere. */
export const STATUS_TONE: Record<OrderStatus, BadgeTone> = {
  pending: 'warning',
  confirmed: 'info',
  picking: 'accent',
  delivering: 'brand',
  completed: 'success',
  cancelled: 'danger',
}

/** Order history for the signed-in shopper, with expandable line details. */
const MyOrders = () => {
  const { t } = useTranslation()
  const { prompt } = useDialog()
  const [page, setPage] = useState(1)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const fetchOrders = useCallback(() => orderService.list({ page, limit: 10 }), [page])
  const { data: orders, loading, refetch } = useFetch<Paginated<Order>>(fetchOrders, [page], EMPTY)

  const cancel = async (order: Order) => {
    const reason = await prompt({
      title: `Cancel ${order.orderNumber}?`,
      description: t('orders.cancelDescription'),
      label: t('orders.cancelReason'),
      defaultValue: t('orders.cancelDefault'),
      inputType: 'multiline',
      required: true,
      confirmLabel: t('orders.cancelConfirm'),
      cancelLabel: t('orders.cancelKeep'),
      tone: 'danger',
    })
    if (reason === null) return

    try {
      await orderService.cancel(order.id, reason)
      toast.success(t('orders.cancelled'))
      refetch()
    } catch (error) {
      toast.error((error as Error).message || t('orders.cancelFailed'))
    }
  }

  if (!isLoggedIn()) {
    return (
      <div className="grid wide">
        <EmptyState
          variant="page"
          icon={<ReceiptLongOutlinedIcon />}
          title={t('orders.signInTitle')}
          description={t('orders.signInDescription')}
          action={<LinkButton to="/dang-nhap">{t('common.signIn')}</LinkButton>}
        />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="grid wide">
        <LoadingState variant="page" label={t('orders.loading')} />
      </div>
    )
  }

  if (orders.data.length === 0) {
    return (
      <div className="grid wide">
        <EmptyState
          variant="page"
          icon={<ReceiptLongOutlinedIcon />}
          title={t('orders.emptyTitle')}
          description={t('orders.emptyDescription')}
          action={<LinkButton to="/san-pham">{t('common.startShopping')}</LinkButton>}
        />
      </div>
    )
  }

  return (
    <div className="grid wide my-orders">
      <header className="my-orders__header">
        <h1>{t('orders.title')}</h1>
        <p>{orders.meta.total} orders</p>
      </header>

      <div className="my-orders__list">
        {orders.data.map((order) => {
          const expanded = expandedId === order.id

          return (
            <article className="order-card" key={order.id}>
              <header className="order-card__head">
                <div className="order-card__id">
                  <strong>{order.orderNumber}</strong>
                  <time>{formatDateTime(order.createdAt)}</time>
                </div>

                <div className="order-card__status">
                  <Badge tone={STATUS_TONE[order.status]} dot>
                    {translateLabel('orderStatus', order.status)}
                  </Badge>
                  <Badge tone={order.paymentStatus === 'paid' ? 'success' : 'neutral'} size="sm">
                    {translateLabel('paymentStatus', order.paymentStatus)}
                  </Badge>
                </div>
              </header>

              <div className="order-card__body">
                <p>
                  Delivery <strong>{formatDate(order.deliveryDate)}</strong>
                  {order.deliverySlot ? ` · ${order.deliverySlot.label}` : ''}
                </p>
                <p className="order-card__total">
                  <span>{t('orders.total')}</span>
                  <strong className="numeric">{formatPrice(order.grandTotalAmount)}</strong>
                  {Number(order.weightAdjustAmount) !== 0 && (
                    <em>incl. {formatPrice(order.weightAdjustAmount)} weighing difference</em>
                  )}
                </p>
              </div>

              {expanded && (
                <ul className="order-card__items">
                  {(order.items ?? []).map((item) => (
                    <li key={item.id}>
                      <span>
                        {item.productName} — {item.variantName}
                      </span>
                      <em className="numeric">
                        {formatQuantity(item.actualQuantity ?? item.orderedQuantity)}{' '}
                        {formatUnit(item.unitType)}
                        {item.actualQuantity ? ' (weighed)' : ''}
                      </em>
                      <strong className="numeric">{formatPrice(item.totalAmount)}</strong>
                    </li>
                  ))}
                </ul>
              )}

              <footer className="order-card__footer">
                <Button
                  variant="link"
                  size="sm"
                  iconRight={
                    <ExpandMoreIcon
                      style={{ transform: expanded ? 'rotate(180deg)' : undefined }}
                    />
                  }
                  onClick={() => setExpandedId(expanded ? null : order.id)}
                >
                  {expanded
                    ? t('orders.hideDetails')
                    : t('orders.viewItems', { count: order.items?.length ?? 0 })}
                </Button>

                {CANCELLABLE.includes(order.status) && (
                  <Button
                    variant="link"
                    size="sm"
                    className="is-danger"
                    onClick={() => cancel(order)}
                  >
                    Cancel order
                  </Button>
                )}
              </footer>
            </article>
          )
        })}
      </div>

      <Pagination page={orders.meta.page} totalPages={orders.meta.totalPages} onChange={setPage} />
    </div>
  )
}

export default MyOrders
