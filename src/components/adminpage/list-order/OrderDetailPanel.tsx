import React from 'react'
import { useTranslation } from 'react-i18next'
import { formatDate, formatPrice, formatQuantity, formatUnit } from '../../../common/utils/format'
import { Button } from '../../../common/components/ui'
import type { Order } from '../../../interface'

interface OrderDetailPanelProps {
  order: Order
  onWeigh: (orderId: string, itemId: string, sku: string) => void
}

/** Statuses during which the picker is at the scale. */
const WEIGHABLE = ['confirmed', 'picking']

/**
 * The expanded row under an order: delivery details, the picking list, and the
 * money breakdown. Split out of ListOrder so the list component stays about
 * fetching and status transitions.
 */
const OrderDetailPanel = ({ order, onWeigh }: OrderDetailPanelProps) => {
  const { t } = useTranslation()
  const canWeigh = WEIGHABLE.includes(order.status)

  return (
    <div className="order-detail">
      <header className="order-detail__head">
        <div>
          <h3>{order.orderNumber}</h3>
          <p>
            {order.customerName} · {order.customerPhone}
          </p>
        </div>

        {order.address && (
          <address className="order-detail__address">
            {order.address.line1}
            {order.address.ward ? `, ${order.address.ward}` : ''}, {order.address.district},{' '}
            {order.address.province}
            <br />
            <strong>
              {formatDate(order.deliveryDate)}
              {order.deliverySlot ? ` · ${order.deliverySlot.label}` : ''}
            </strong>
          </address>
        )}
      </header>

      <div className="order-detail__table-wrap">
        <table className="order-detail__table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>{t('admin.columns.product')}</th>
              <th>{t('admin.columns.batch')}</th>
              <th>{t('admin.columns.bestBefore')}</th>
              <th className="is-right">{t('admin.columns.ordered')}</th>
              <th className="is-right">{t('admin.columns.weighed')}</th>
              <th className="is-right">{t('admin.columns.lineTotal')}</th>
              {canWeigh && <th />}
            </tr>
          </thead>
          <tbody>
            {(order.items ?? []).map((item) => (
              <tr key={item.id}>
                <td className="cell-mono">{item.sku}</td>
                <td>
                  {item.productName}
                  <em> — {item.variantName}</em>
                </td>
                <td className="cell-mono">{item.batchId ? item.batchId.slice(0, 8) : '—'}</td>
                <td>{item.expiryDate ? formatDate(item.expiryDate) : '—'}</td>
                <td className="is-right numeric">
                  {formatQuantity(item.orderedQuantity)} {formatUnit(item.unitType)}
                </td>
                <td className="is-right numeric">
                  {item.actualQuantity ? formatQuantity(item.actualQuantity) : '—'}
                </td>
                <td className="is-right numeric">{formatPrice(item.totalAmount)}</td>
                {canWeigh && (
                  <td className="is-right">
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => onWeigh(order.id, item.id, item.sku)}
                    >
                      Weigh
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <dl className="order-detail__totals">
        <div>
          <dt>{t('admin.columns.goods')}</dt>
          <dd className="numeric">{formatPrice(order.subtotalAmount)}</dd>
        </div>
        <div>
          <dt>{t('admin.columns.discount')}</dt>
          <dd className="numeric">−{formatPrice(order.discountAmount)}</dd>
        </div>
        <div>
          <dt>{t('admin.columns.delivery')}</dt>
          <dd className="numeric">{formatPrice(order.deliveryFeeAmount)}</dd>
        </div>
        <div>
          <dt>{t('admin.columns.weighingDifference')}</dt>
          <dd className="numeric">{formatPrice(order.weightAdjustAmount)}</dd>
        </div>
        <div className="is-total">
          <dt>{t('admin.columns.total')}</dt>
          <dd className="numeric">{formatPrice(order.grandTotalAmount)}</dd>
        </div>
      </dl>
    </div>
  )
}

export default OrderDetailPanel
