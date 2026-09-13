import { Trans, useTranslation } from 'react-i18next'
import React, { useCallback, useMemo, useState } from 'react'
import { translateLabel } from '../../../common/utils/labels'
import {
  AccountBalanceOutlinedIcon,
  PaymentsOutlinedIcon,
  QrCode2OutlinedIcon,
  ScaleOutlinedIcon,
  WalletOutlinedIcon,
} from '../../../common/components/ui/icons'
import { useHistory } from 'react-router-dom'
import './Checkout.scss'
import { useFetch } from '../../../common/hooks/useFetch'
import { cartService, deliveryService, orderService } from '../../../services'
import { DELIVERY_FEE_AMOUNT, FREE_DELIVERY_THRESHOLD } from '../../../common/constants'
import { formatDate, formatPrice, formatQuantity, formatUnit } from '../../../common/utils/format'
import { getCurrentUser } from '../../../common/utils/session'
import { toast } from '../../../common/utils/toast'
import {
  Alert,
  Button,
  Card,
  EmptyState,
  Input,
  LoadingState,
  RadioGroup,
  Textarea,
} from '../../../common/components/ui'
import type { Cart, DeliverySlot, PaymentProvider } from '../../../interface'

const EMPTY_CART: Cart = {
  id: '',
  status: 'active',
  couponCode: null,
  items: [],
  subtotalAmount: 0,
  discountAmount: 0,
  couponMessage: null,
  itemCount: 0,
  hasIssues: false,
}

const PAYMENT_VALUES: PaymentProvider[] = ['cod', 'vnpay', 'momo', 'bank_transfer']

const PAYMENT_ICONS: Record<PaymentProvider, React.ReactNode> = {
  cod: <PaymentsOutlinedIcon />,
  vnpay: <QrCode2OutlinedIcon />,
  momo: <WalletOutlinedIcon />,
  bank_transfer: <AccountBalanceOutlinedIcon />,
}

/**
 * Checkout: contact, address, delivery slot, payment, then the order summary.
 *
 * The summary is sticky on desktop so the total is always in view while the
 * form is filled in - the previous layout pushed it below a seven-field address
 * block where nobody saw it.
 */
const Checkout = () => {
  const { t } = useTranslation()
  const history = useHistory()
  const currentUser = getCurrentUser()

  const fetchCart = useCallback(() => cartService.get(), [])
  const { data: cart, loading: cartLoading } = useFetch<Cart>(fetchCart, [], EMPTY_CART)

  const fetchSlots = useCallback(() => deliveryService.listAvailable(7), [])
  const { data: slots } = useFetch<DeliverySlot[]>(fetchSlots, [], [])

  const [form, setForm] = useState({
    customerName: currentUser?.fullName ?? '',
    customerPhone: currentUser?.phone ?? '',
    recipientName: currentUser?.fullName ?? '',
    phone: currentUser?.phone ?? '',
    line1: '',
    ward: '',
    district: '',
    province: 'Ho Chi Minh City',
    deliveryNote: '',
    customerNote: '',
  })
  const [slotId, setSlotId] = useState('')
  const [provider, setProvider] = useState<PaymentProvider>('cod')
  const [submitting, setSubmitting] = useState(false)

  const slotsByDate = useMemo(
    () =>
      slots.reduce<Record<string, DeliverySlot[]>>((acc, slot) => {
        acc[slot.slotDate] = [...(acc[slot.slotDate] ?? []), slot]
        return acc
      }, {}),
    [slots],
  )

  const selectedSlot = slots.find((slot) => slot.id === slotId)
  const deliveryFee = cart.subtotalAmount >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE_AMOUNT
  const grandTotal = cart.subtotalAmount - cart.discountAmount + deliveryFee
  const hasWeighted = cart.items.some((line) => line.isWeighted)

  const setField =
    (field: keyof typeof form) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: event.target.value }))

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!selectedSlot) {
      toast.error(t('checkout.chooseSlotFirst'))
      return
    }

    setSubmitting(true)
    try {
      const order = await orderService.checkout({
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        address: {
          recipientName: form.recipientName,
          phone: form.phone,
          line1: form.line1,
          ward: form.ward || null,
          district: form.district,
          province: form.province,
          deliveryNote: form.deliveryNote || null,
        },
        deliveryDate: selectedSlot.slotDate,
        deliverySlotId: selectedSlot.id,
        paymentProvider: provider,
        customerNote: form.customerNote || undefined,
      })

      history.push(`/dat-hang-thanh-cong/${order.id}`)
    } catch (error) {
      toast.error((error as Error).message || t('checkout.placeFailed'))
    } finally {
      setSubmitting(false)
    }
  }

  if (cartLoading) {
    return (
      <div className="grid wide">
        <LoadingState variant="page" />
      </div>
    )
  }

  if (cart.items.length === 0) {
    return (
      <div className="grid wide">
        <EmptyState
          variant="page"
          title={t('checkout.emptyTitle')}
          description={t('checkout.emptyDescription')}
          action={
            <Button onClick={() => history.push('/san-pham')}>{t('common.browseFruit')}</Button>
          }
        />
      </div>
    )
  }

  return (
    <form className="grid wide checkout" onSubmit={handleSubmit}>
      <h1 className="checkout__title">{t('checkout.title')}</h1>

      <div className="checkout__layout">
        <div className="checkout__form">
          <Card padding="lg" className="checkout__section">
            <h2>{t('checkout.whoIsOrdering')}</h2>
            <div className="checkout__fields checkout__fields--two">
              <Input
                label={t('address.fullName')}
                required
                value={form.customerName}
                onChange={setField('customerName')}
              />
              <Input
                label={t('address.phone')}
                required
                type="tel"
                value={form.customerPhone}
                onChange={setField('customerPhone')}
              />
            </div>
          </Card>

          <Card padding="lg" className="checkout__section">
            <h2>{t('checkout.deliveryAddress')}</h2>
            <div className="checkout__fields checkout__fields--two">
              <Input
                label={t('address.recipient')}
                required
                value={form.recipientName}
                onChange={setField('recipientName')}
              />
              <Input
                label={t('address.recipientPhone')}
                required
                type="tel"
                value={form.phone}
                onChange={setField('phone')}
              />
              <Input
                className="is-wide"
                label={t('address.line1')}
                placeholder={t('address.line1Placeholder')}
                required
                value={form.line1}
                onChange={setField('line1')}
              />
              <Input label={t('address.ward')} value={form.ward} onChange={setField('ward')} />
              <Input
                label={t('address.district')}
                required
                value={form.district}
                onChange={setField('district')}
              />
              <Input
                label={t('address.province')}
                required
                value={form.province}
                onChange={setField('province')}
              />
              <Textarea
                className="is-wide"
                label={t('address.note')}
                hint={t('address.noteHint')}
                rows={2}
                value={form.deliveryNote}
                onChange={setField('deliveryNote')}
              />
            </div>
          </Card>

          <Card padding="lg" className="checkout__section">
            <h2>{t('checkout.deliverySlot')}</h2>

            {slots.length === 0 ? (
              <Alert tone="warning">{t('checkout.noSlots')}</Alert>
            ) : (
              Object.entries(slotsByDate).map(([date, daySlots]) => (
                <div className="slot-day" key={date}>
                  <h3>{formatDate(date)}</h3>
                  <div className="slot-day__list">
                    {daySlots.map((slot) => (
                      <button
                        type="button"
                        key={slot.id}
                        className={['slot-option', slot.id === slotId ? 'is-selected' : '']
                          .filter(Boolean)
                          .join(' ')}
                        aria-pressed={slot.id === slotId}
                        disabled={slot.remaining <= 0}
                        onClick={() => setSlotId(slot.id)}
                      >
                        <span className="slot-option__label">{slot.label}</span>
                        <span className="slot-option__left">
                          {slot.remaining > 0
                            ? t('checkout.placesLeft', { count: slot.remaining })
                            : t('checkout.slotFull')}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </Card>

          <Card padding="lg" className="checkout__section">
            <h2>{t('checkout.howToPay')}</h2>
            <RadioGroup
              name="provider"
              value={provider}
              options={PAYMENT_VALUES.map((value) => ({
                value,
                label: translateLabel('paymentProvider', value),
                description: t(`checkout.pay.${value}`),
                icon: PAYMENT_ICONS[value],
              }))}
              onChange={setProvider}
            />
          </Card>

          <Card padding="lg" className="checkout__section">
            <h2>{t('checkout.anythingElse')}</h2>
            <Textarea
              aria-label={t('checkout.noteAria')}
              placeholder={t('checkout.notePlaceholder')}
              value={form.customerNote}
              onChange={setField('customerNote')}
            />
          </Card>
        </div>

        <aside className="checkout__summary">
          <Card padding="lg">
            <h2>{t('checkout.yourOrder')}</h2>

            <ul className="checkout-summary__items">
              {cart.items.map((line) => (
                <li key={line.variantId}>
                  <span className="checkout-summary__name">
                    {line.productName}
                    <em>{line.variantName}</em>
                  </span>
                  <span className="checkout-summary__qty numeric">
                    {formatQuantity(line.quantity)} {formatUnit(line.unitType)}
                  </span>
                  <strong className="numeric">{formatPrice(line.lineTotal)}</strong>
                </li>
              ))}
            </ul>

            <dl className="checkout-summary__totals">
              <div>
                <dt>{t('checkout.goodsTotal')}</dt>
                <dd className="numeric">{formatPrice(cart.subtotalAmount)}</dd>
              </div>
              {cart.discountAmount > 0 && (
                <div className="is-discount">
                  <dt>
                    {t('checkout.discount')}
                    {cart.couponCode ? ` (${cart.couponCode})` : ''}
                  </dt>
                  <dd className="numeric">−{formatPrice(cart.discountAmount)}</dd>
                </div>
              )}
              <div>
                <dt>{t('checkout.delivery')}</dt>
                <dd className="numeric">
                  {deliveryFee === 0 ? t('common.free') : formatPrice(deliveryFee)}
                </dd>
              </div>
              <div className="is-total">
                <dt>{t('checkout.total')}</dt>
                <dd className="numeric">{formatPrice(grandTotal)}</dd>
              </div>
            </dl>

            {selectedSlot && (
              <p className="checkout-summary__slot">
                <Trans
                  i18nKey="checkout.delivering"
                  values={{ date: formatDate(selectedSlot.slotDate), slot: selectedSlot.label }}
                  components={{ date: <strong /> }}
                />
              </p>
            )}

            {hasWeighted && (
              <Alert tone="info" icon={<ScaleOutlinedIcon />}>
                {t('checkout.weightedNotice')}
              </Alert>
            )}

            <Button type="submit" block size="lg" loading={submitting} disabled={!selectedSlot}>
              {t('checkout.placeOrder')}
            </Button>

            {!selectedSlot && <p className="checkout-summary__hint">{t('checkout.pickSlot')}</p>}
          </Card>
        </aside>
      </div>
    </form>
  )
}

export default Checkout
