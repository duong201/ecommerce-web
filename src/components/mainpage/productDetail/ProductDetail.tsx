import { useTranslation } from 'react-i18next'
import React, { useCallback, useEffect, useState } from 'react'
import { translateLabel } from '../../../common/utils/labels'
import {
  AcUnitOutlinedIcon,
  PlaceOutlinedIcon,
  ScaleOutlinedIcon,
  ShoppingCartOutlinedIcon,
} from '../../../common/components/ui/icons'
import { Link, useParams } from 'react-router-dom'
import './ProductDetail.scss'
import { useFetch } from '../../../common/hooks/useFetch'
import { cartService, productService, reviewService } from '../../../services'
import { NO_IMAGE_URL } from '../../../common/constants'
import {
  discountPercent,
  formatPrice,
  formatQuantity,
  formatQuantityWithUnit,
  formatUnit,
} from '../../../common/utils/format'
import { toast } from '../../../common/utils/toast'
import {
  Alert,
  Badge,
  Button,
  Card,
  EmptyState,
  LoadingState,
  Rating,
  Stepper,
} from '../../../common/components/ui'
import type { Paginated, Product, ProductVariant, Review } from '../../../interface'

const EMPTY_REVIEWS: Paginated<Review> = {
  data: [],
  meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
}

/**
 * Product page: gallery, variant picker, quantity stepper and reviews.
 *
 * Fruit is sold per variant (500g punnet, 1kg bag, a tray), and each variant
 * carries its own price, step size and stock - so the price, the stepper bounds
 * and the add-to-cart button all follow the selected variant rather than the
 * product.
 */
const ProductDetail = () => {
  const { t } = useTranslation()
  const { idOrSlug } = useParams<{ idOrSlug: string }>()

  const fetchProduct = useCallback(() => productService.get(idOrSlug), [idOrSlug])
  const { data: product, loading, error } = useFetch<Product | null>(fetchProduct, [idOrSlug], null)

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [adding, setAdding] = useState(false)

  const variants = product?.variants ?? []
  const selectedVariant: ProductVariant | undefined =
    variants.find((variant) => variant.id === selectedVariantId) ?? variants[0]

  useEffect(() => {
    if (!selectedVariant) return
    setSelectedVariantId(selectedVariant.id)
    setQuantity(Number(selectedVariant.stepQuantity))
  }, [selectedVariant?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchReviews = useCallback(
    () =>
      product
        ? reviewService.listForProduct(product.id, { limit: 10 })
        : Promise.resolve(EMPTY_REVIEWS),
    [product?.id], // eslint-disable-line react-hooks/exhaustive-deps
  )
  const { data: reviews } = useFetch<Paginated<Review>>(fetchReviews, [product?.id], EMPTY_REVIEWS)

  if (loading) {
    return (
      <div className="grid wide">
        <LoadingState variant="page" label={t('product.loading')} />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="grid wide">
        <EmptyState
          variant="page"
          tone="danger"
          title={t('product.notFoundTitle')}
          description={t('product.notFoundDescription')}
          action={
            <Link to="/san-pham" className="ui-btn ui-btn--primary">
              {t('common.browseFruit')}
            </Link>
          }
        />
      </div>
    )
  }

  const available = selectedVariant?.inventoryLevel?.availableQuantity ?? 0
  const step = Number(selectedVariant?.stepQuantity ?? 1)
  const percentOff = discountPercent(selectedVariant?.priceAmount, selectedVariant?.compareAtAmount)
  const images = product.images ?? []
  const unit = formatUnit(selectedVariant?.unitType)

  const changeQuantity = (delta: number) => {
    const next = Number((quantity + delta * step).toFixed(3))
    if (next < step) return
    if (next > available) {
      toast.warning(`Only ${formatQuantity(available)} ${unit} left`)
      return
    }
    setQuantity(next)
  }

  const handleAddToCart = async () => {
    if (!selectedVariant) return
    setAdding(true)
    try {
      await cartService.addItem(selectedVariant.id, quantity)
      toast.success(
        t('product.addedToCart', {
          quantity: formatQuantityWithUnit(quantity, selectedVariant.unitType),
        }),
      )
    } catch (err) {
      toast.error((err as Error).message || t('product.addFailed'))
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className="grid wide product-page">
      <nav className="product-page__crumbs" aria-label={t('product.breadcrumb')}>
        <Link to="/">{t('product.home')}</Link>
        <span aria-hidden="true">/</span>
        <Link to="/san-pham">{t('product.fruit')}</Link>
        {product.category && (
          <>
            <span aria-hidden="true">/</span>
            <Link to={`/san-pham?categoryId=${product.category.id}`}>{product.category.name}</Link>
          </>
        )}
      </nav>

      <div className="product-page__top">
        <section className="product-gallery">
          <div className="product-gallery__main">
            <img
              src={images[activeImage]?.url ?? product.coverImageUrl ?? NO_IMAGE_URL}
              alt={product.name}
            />
            {percentOff > 0 && <span className="product-gallery__discount">−{percentOff}%</span>}
          </div>

          {images.length > 1 && (
            <div className="product-gallery__thumbs">
              {images.map((image, index) => (
                <button
                  type="button"
                  key={image.id}
                  className={index === activeImage ? 'is-active' : ''}
                  onClick={() => setActiveImage(index)}
                  aria-label={`Show image ${index + 1}`}
                  aria-current={index === activeImage}
                >
                  <img src={image.url} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="product-info">
          <h1>{product.name}</h1>

          <div className="product-info__meta">
            <Rating value={Number(product.ratingAvg)} count={product.ratingCount} size="sm" />
            {product.origin && (
              <span className="product-info__chip">
                <PlaceOutlinedIcon />
                {product.origin}
              </span>
            )}
            <span className="product-info__chip">
              <AcUnitOutlinedIcon />
              {translateLabel('storageType', product.storageType)}
            </span>
            {product.isOrganic && <Badge tone="success">{t('product.organic')}</Badge>}
          </div>

          {product.shortDescription && (
            <p className="product-info__lead">{product.shortDescription}</p>
          )}

          <div className="product-info__price">
            <strong className="numeric" data-testid="headline-price">
              {formatPrice(selectedVariant?.priceAmount)}
            </strong>
            {unit && <span className="product-info__unit">/ {unit}</span>}
            {percentOff > 0 && (
              <>
                <del className="numeric">{formatPrice(selectedVariant?.compareAtAmount)}</del>
                <Badge tone="danger" variant="solid">
                  Save {percentOff}%
                </Badge>
              </>
            )}
          </div>

          <div className="product-info__variants">
            <h2>{t('product.chooseSize')}</h2>
            <div className="variant-list">
              {variants.map((variant) => {
                const variantAvailable = variant.inventoryLevel?.availableQuantity ?? 0
                const isSelected = variant.id === selectedVariant?.id

                return (
                  <button
                    type="button"
                    key={variant.id}
                    disabled={variantAvailable <= 0}
                    className={['variant-option', isSelected ? 'is-selected' : '']
                      .filter(Boolean)
                      .join(' ')}
                    aria-pressed={isSelected}
                    onClick={() => setSelectedVariantId(variant.id)}
                  >
                    <span className="variant-option__name">{variant.name}</span>
                    <span className="variant-option__price numeric">
                      {formatPrice(variant.priceAmount)}
                    </span>
                    <span className="variant-option__stock">
                      {variantAvailable > 0
                        ? t('product.left', {
                            quantity: formatQuantityWithUnit(variantAvailable, variant.unitType),
                          })
                        : t('product.outOfStock')}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {selectedVariant?.isWeighted && (
            <Alert tone="info" icon={<ScaleOutlinedIcon />} title={t('product.soldByWeight')}>
              The shop reweighs this at picking and charges the measured weight. Any difference
              appears on your order.
            </Alert>
          )}

          <div className="product-info__actions">
            <Stepper
              value={`${formatQuantity(quantity)} ${unit}`}
              onDecrease={() => changeQuantity(-1)}
              onIncrease={() => changeQuantity(1)}
              decreaseDisabled={quantity <= step}
              increaseDisabled={quantity >= available}
              disabled={available <= 0}
            />

            <Button
              size="lg"
              loading={adding}
              disabled={available <= 0}
              iconLeft={<ShoppingCartOutlinedIcon />}
              onClick={handleAddToCart}
            >
              {available <= 0 ? t('product.outOfStock') : t('product.addToCart')}
            </Button>
          </div>

          {product.supplier && (
            <p className="product-info__supplier">
              Supplied by <strong>{product.supplier.name}</strong>
              {product.supplier.certification && product.supplier.certification !== 'none' && (
                <Badge tone="info" size="sm">
                  {product.supplier.certification.toUpperCase()}
                </Badge>
              )}
            </p>
          )}
        </section>
      </div>

      <div className="product-page__bottom">
        {product.description && (
          <Card className="product-description" padding="lg">
            <h2>{t('product.about')}</h2>
            <p>{product.description}</p>
          </Card>
        )}

        <Card className="product-reviews" padding="lg">
          <h2>Reviews ({reviews.meta.total})</h2>

          {reviews.data.length === 0 ? (
            <EmptyState
              title={t('product.noReviewsTitle')}
              description={t('product.noReviewsDescription')}
            />
          ) : (
            <ul className="product-reviews__list">
              {reviews.data.map((review) => (
                <li className="review-item" key={review.id}>
                  <div className="review-item__head">
                    <strong>{review.user?.fullName ?? t('product.customer')}</strong>
                    {review.orderItemId && (
                      <Badge tone="info" size="sm">
                        Verified purchase
                      </Badge>
                    )}
                    <Rating value={review.rating} size="sm" compact />
                  </div>

                  {review.freshnessRating && (
                    <p className="review-item__freshness">
                      Freshness on arrival: <strong>{review.freshnessRating} / 5</strong>
                    </p>
                  )}

                  {review.content && <p className="review-item__body">{review.content}</p>}

                  {review.adminReply && (
                    <p className="review-item__reply">
                      <strong>{t('product.shopReply')}</strong> {review.adminReply}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  )
}

export default ProductDetail
