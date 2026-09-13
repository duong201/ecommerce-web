import { Trans, useTranslation } from 'react-i18next'
import React, { useCallback, useState } from 'react'
import {
  DeleteOutlineIcon,
  LocalOfferOutlinedIcon,
  ShoppingBagOutlinedIcon,
} from '../../../common/components/ui/icons'
import { Link, useHistory } from 'react-router-dom'
import './Cart.scss'
import { useFetch } from '../../../common/hooks/useFetch'
import { cartService } from '../../../services'
import {
  DELIVERY_FEE_AMOUNT,
  FREE_DELIVERY_THRESHOLD,
  NO_IMAGE_URL,
} from '../../../common/constants'
import { formatPrice, formatQuantity, formatUnit } from '../../../common/utils/format'
import { toast } from '../../../common/utils/toast'
import {
  Alert,
  Badge,
  Button,
  Card,
  EmptyState,
  IconButton,
  Input,
  LoadingState,
  Stepper,
  useDialog,
} from '../../../common/components/ui'
import type { Cart as CartModel } from '../../../interface'

const EMPTY_CART: CartModel = {
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

/**
 * Cart page. Every mutation goes through `run`, which owns the busy flag and
 * the error toast, so no individual button has to repeat that plumbing.
 */
const Cart = () => {
  const history = useHistory()
  const { confirm } = useDialog()

  const fetchCart = useCallback(() => cartService.get(), [])
  const { data: cart, setData: setCart, loading } = useFetch<CartModel>(fetchCart, [], EMPTY_CART)

  const { t } = useTranslation()
  const [couponInput, setCouponInput] = useState('')
  const [busy, setBusy] = useState(false)

  const run = async (action: () => Promise<CartModel>, successMessage?: string) => {
    setBusy(true)
    try {
      setCart(await action())
      if (successMessage) toast.success(successMessage)
    } catch (error) {
      toast.error((error as Error).message || t('common.somethingWrong'))
    } finally {
      setBusy(false)
    }
  }

  const emptyCart = async () => {
    const confirmed = await confirm({
      title: t('cart.emptyConfirmTitle'),
      description: t('cart.emptyConfirmDescription'),
      confirmLabel: t('cart.emptyConfirmLabel'),
      tone: 'danger',
    })
    if (confirmed) await run(() => cartService.clear(), t('cart.emptied'))
  }

  const deliveryFee = cart.subtotalAmount >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE_AMOUNT
  const grandTotal = cart.subtotalAmount - cart.discountAmount + deliveryFee
  const toFreeDelivery = FREE_DELIVERY_THRESHOLD - cart.subtotalAmount
  const freeProgress = Math.min(100, (cart.subtotalAmount / FREE_DELIVERY_THRESHOLD) * 100)

  if (loading) {
    return (
      <div className="grid wide">
        <LoadingState variant="page" label={t('cart.loading')} />
      </div>
    )
  }

  if (cart.items.length === 0) {
    return (
      <div className="grid wide">
        <EmptyState
          variant="page"
          icon={<ShoppingBagOutlinedIcon />}
          title={t('cart.emptyTitle')}
          description={t('cart.emptyDescription')}
          action={
            <Link to="/san-pham" className="ui-btn ui-btn--primary ui-btn--lg">
              {t('common.browseFruit')}
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="grid wide cart">
      <header className="cart__header">
        <h1>{t('cart.title')}</h1>
        <p>{t('cart.itemCount', { count: cart.itemCount })}</p>
      </header>

      <div className="cart__layout">
        <section className="cart__lines">
          {cart.items.map((line) => (
            <article className="cart-line" data-testid="cart-line" key={line.variantId}>
              <img
                className="cart-line__image"
                src={line.imageUrl ?? NO_IMAGE_URL}
                alt=""
                loading="lazy"
              />

              <div className="cart-line__info">
                <Link className="cart-line__name" to={`/san-pham/${line.productSlug}`}>
                  {line.productName}
                </Link>
                <p className="cart-line__variant">
                  {line.variantName} · <span className="cart-line__sku">{line.sku}</span>
                </p>

                {line.priceChanged && (
                  <Badge tone="warning" size="sm">
                    Price changed: {formatPrice(line.unitPriceAmount)} →{' '}
                    {formatPrice(line.currentPriceAmount)}
                  </Badge>
                )}
                {line.stockIssue && (
                  <Badge tone="danger" size="sm">
                    {line.stockIssue}
                  </Badge>
                )}
              </div>

              <Stepper
                className="cart-line__stepper"
                size="sm"
                disabled={busy}
                value={`${formatQuantity(line.quantity)} ${formatUnit(line.unitType)}`}
                onDecrease={() =>
                  run(() =>
                    cartService.setQuantity(
                      line.variantId,
                      Number((line.quantity - line.stepQuantity).toFixed(3)),
                    ),
                  )
                }
                onIncrease={() =>
                  run(() =>
                    cartService.setQuantity(
                      line.variantId,
                      Number((line.quantity + line.stepQuantity).toFixed(3)),
                    ),
                  )
                }
              />

              <p className="cart-line__total numeric">{formatPrice(line.lineTotal)}</p>

              <IconButton
                className="cart-line__remove"
                variant="danger"
                size="sm"
                label={t('cart.removeLine', { name: line.productName })}
                icon={<DeleteOutlineIcon />}
                disabled={busy}
                onClick={() => run(() => cartService.removeItem(line.variantId), t('cart.removed'))}
              />
            </article>
          ))}

          <div className="cart__lines-footer">
            <Link to="/san-pham" className="ui-btn ui-btn--ghost">
              Keep shopping
            </Link>
            <Button variant="ghost" disabled={busy} onClick={emptyCart}>
              Empty the cart
            </Button>
          </div>
        </section>

        <aside className="cart__summary">
          <Card padding="lg" className="cart-summary">
            <h2>{t('cart.summary')}</h2>

            <div className="cart-summary__coupon">
              {cart.couponCode ? (
                <div className="cart-summary__coupon-applied">
                  <Badge tone="success" icon={<LocalOfferOutlinedIcon />}>
                    {cart.couponCode}
                  </Badge>
                  <Button
                    variant="link"
                    size="sm"
                    disabled={busy}
                    onClick={() => run(() => cartService.removeCoupon(), t('cart.couponRemoved'))}
                  >
                    {t('cart.remove')}
                  </Button>
                </div>
              ) : (
                <div className="cart-summary__coupon-form">
                  <Input
                    aria-label={t('cart.couponCode')}
                    placeholder={t('cart.couponCode')}
                    size="sm"
                    value={couponInput}
                    onChange={(event) => setCouponInput(event.target.value)}
                  />
                  <Button
                    variant="secondary"
                    disabled={busy || !couponInput.trim()}
                    onClick={() =>
                      run(
                        () => cartService.applyCoupon(couponInput.trim()),
                        t('cart.couponApplied'),
                      )
                    }
                  >
                    {t('common.apply')}
                  </Button>
                </div>
              )}
              {cart.couponMessage && (
                <p className="cart-summary__coupon-message">{cart.couponMessage}</p>
              )}
            </div>

            <dl className="cart-summary__lines">
              <div>
                <dt>{t('cart.goodsTotal')}</dt>
                <dd className="numeric">{formatPrice(cart.subtotalAmount)}</dd>
              </div>
              {cart.discountAmount > 0 && (
                <div className="is-discount">
                  <dt>{t('cart.discount')}</dt>
                  <dd className="numeric">−{formatPrice(cart.discountAmount)}</dd>
                </div>
              )}
              <div>
                <dt>{t('cart.delivery')}</dt>
                <dd className="numeric">
                  {deliveryFee === 0 ? t('common.free') : formatPrice(deliveryFee)}
                </dd>
              </div>
              <div className="is-total">
                <dt>{t('cart.total')}</dt>
                <dd className="numeric">{formatPrice(grandTotal)}</dd>
              </div>
            </dl>

            {deliveryFee > 0 && (
              <div className="cart-summary__free-delivery">
                <p>
                  <Trans
                    i18nKey="cart.freeDeliveryHint"
                    values={{ amount: formatPrice(toFreeDelivery) }}
                    components={{ amount: <strong /> }}
                  />
                </p>
                <div
                  className="cart-summary__bar"
                  role="progressbar"
                  aria-valuenow={Math.round(freeProgress)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <span style={{ width: `${freeProgress}%` }} />
                </div>
              </div>
            )}

            <Button
              block
              size="lg"
              disabled={busy || cart.hasIssues}
              onClick={() => history.push('/thanh-toan')}
            >
              {t('cart.checkout')}
            </Button>

            {cart.hasIssues && (
              <Alert tone="danger" className="cart-summary__issues">
                {t('cart.resolveIssues')}
              </Alert>
            )}
          </Card>
        </aside>
      </div>
    </div>
  )
}

export default Cart
