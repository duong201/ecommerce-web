import { useTranslation } from 'react-i18next'
import React, { useCallback } from 'react'
import { translateLabel } from '../../../common/utils/labels'
import { CheckCircleOutlineIcon } from '../../../common/components/ui/icons'
import { Link, useParams } from 'react-router-dom'
import './OrderSuccess.scss'
import { useFetch } from '../../../common/hooks/useFetch'
import { orderService } from '../../../services'

import { formatDate, formatPrice, formatQuantity, formatUnit } from '../../../common/utils/format'
import { Badge, Card, EmptyState, LinkButton, LoadingState } from '../../../common/components/ui'
import type { Order } from '../../../interface'

/** Confirmation page shown straight after checkout. */
const OrderSuccess = () => {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const fetchOrder = useCallback(() => orderService.get(id), [id])
  const { data: order, loading, error } = useFetch<Order | null>(fetchOrder, [id], null)

  if (loading) {
    return (
      <div className="grid wide">
        <LoadingState variant="page" label={t('orderSuccess.loading')} />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="grid wide">
        <EmptyState
          variant="page"
          tone="danger"
          title={t('orderSuccess.notFoundTitle')}
          description={t('orderSuccess.notFoundDescription')}
          action={<LinkButton to="/">{t('common.backToHome')}</LinkButton>}
        />
      </div>
    )
  }

  return (
    <div className="grid wide order-success">
      <div className="order-success__hero">
        <span className="order-success__tick" aria-hidden="true">
          <CheckCircleOutlineIcon />
        </span>
        <h1>{t('orderSuccess.title')}</h1>
        <p>
          Order <strong>{order.orderNumber}</strong> is with the shop. We will call to confirm
          before picking starts.
        </p>
        <div className="order-success__actions">
          <LinkButton to="/don-hang">{t('orderSuccess.viewOrders')}</LinkButton>
          <LinkButton to="/san-pham" variant="secondary">
            Keep shopping
          </LinkButton>
        </div>
      </div>

      <div className="order-success__layout">
        <Card padding="lg">
          <h2>{t('orderSuccess.whatYouOrdered')}</h2>
          <ul className="order-success__items">
            {(order.items ?? []).map((item) => (
              <li key={item.id}>
                <span className="order-success__item-name">
                  {item.productName}
                  <em>{item.variantName}</em>
                  {item.expiryDate && <small>Best before {formatDate(item.expiryDate)}</small>}
                </span>
                <span className="order-success__item-qty numeric">
                  {formatQuantity(item.orderedQuantity)} {formatUnit(item.unitType)}
                </span>
                <strong className="numeric">{formatPrice(item.totalAmount)}</strong>
              </li>
            ))}
          </ul>
        </Card>

        <Card padding="lg">
          <h2>{t('orderSuccess.deliveryAndPayment')}</h2>

          {order.address && (
            <address className="order-success__address">
              <strong>
                {order.address.recipientName} · {order.address.phone}
              </strong>
              <br />
              {order.address.line1}
              {order.address.ward ? `, ${order.address.ward}` : ''}, {order.address.district},{' '}
              {order.address.province}
            </address>
          )}

          <p className="order-success__when">
            Arriving <strong>{formatDate(order.deliveryDate)}</strong>
            {order.deliverySlot ? ` · ${order.deliverySlot.label}` : ''}
          </p>

          <dl className="order-success__totals">
            <div>
              <dt>{t('orderSuccess.goodsTotal')}</dt>
              <dd className="numeric">{formatPrice(order.subtotalAmount)}</dd>
            </div>
            {Number(order.discountAmount) > 0 && (
              <div className="is-discount">
                <dt>{t('orderSuccess.discount')}</dt>
                <dd className="numeric">−{formatPrice(order.discountAmount)}</dd>
              </div>
            )}
            <div>
              <dt>{t('orderSuccess.delivery')}</dt>
              <dd className="numeric">{formatPrice(order.deliveryFeeAmount)}</dd>
            </div>
            {Number(order.weightAdjustAmount) !== 0 && (
              <div>
                <dt>{t('orderSuccess.weighingDifference')}</dt>
                <dd className="numeric">{formatPrice(order.weightAdjustAmount)}</dd>
              </div>
            )}
            <div className="is-total">
              <dt>{t('orderSuccess.total')}</dt>
              <dd className="numeric">{formatPrice(order.grandTotalAmount)}</dd>
            </div>
          </dl>

          <p className="order-success__status">
            <Badge tone="brand">{translateLabel('orderStatus', order.status)}</Badge>
            <Badge tone={order.paymentStatus === 'paid' ? 'success' : 'warning'}>
              {translateLabel('paymentStatus', order.paymentStatus)}
            </Badge>
          </p>

          <Link to="/don-hang" className="order-success__track">
            Track this order
          </Link>
        </Card>
      </div>
    </div>
  )
}

export default OrderSuccess
