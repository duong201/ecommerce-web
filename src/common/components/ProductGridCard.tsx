import React, { MouseEventHandler } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { NO_IMAGE_URL } from '../constants'
import { discountPercent, formatPrice, formatUnit } from '../utils/format'
import { Badge, Rating } from './ui'
import './ProductGridCard.scss'
import type { Product } from '../../interface'

interface ProductGridCardProps {
  product: Product
  onClick?: MouseEventHandler<HTMLAnchorElement>
  className?: string
}

const ProductGridCard = ({ product, onClick, className }: ProductGridCardProps) => {
  const { t } = useTranslation()
  const outOfStock = product.availableQuantity <= 0
  const percentOff = discountPercent(product.priceFrom, product.compareAtFrom)
  const unit = formatUnit(product.variants?.[0]?.unitType)

  return (
    <article
      className={['product-card', outOfStock ? 'is-out' : '', className ?? '']
        .filter(Boolean)
        .join(' ')}
      data-testid="product-grid-card"
    >
      <Link className="product-card__link" to={`/san-pham/${product.slug}`} onClick={onClick}>
        <div className="product-card__media">
          <img
            src={product.coverImageUrl ?? NO_IMAGE_URL}
            alt={product.name}
            loading="lazy"
            className="product-card__image"
          />

          <div className="product-card__badges">
            {percentOff > 0 && (
              <Badge tone="danger" variant="solid" size="sm">
                −{percentOff}%
              </Badge>
            )}
            {product.isOrganic && (
              <Badge tone="success" size="sm">
                {t('product.organic')}
              </Badge>
            )}
          </div>

          {outOfStock && <span className="product-card__sold-out">{t('product.outOfStock')}</span>}
        </div>

        <div className="product-card__body">
          <h3 className="product-card__name">{product.name}</h3>

          <p className="product-card__meta">
            {product.origin && <span className="product-card__origin">{product.origin}</span>}
            <Rating
              value={Number(product.ratingAvg)}
              count={product.ratingCount}
              compact
              size="sm"
            />
          </p>

          <p className="product-card__price">
            <strong className="numeric">
              {product.priceFrom !== null ? formatPrice(product.priceFrom) : t('product.askUs')}
            </strong>
            {unit && <span className="product-card__unit">/ {unit}</span>}
            {percentOff > 0 && <del className="numeric">{formatPrice(product.compareAtFrom)}</del>}
          </p>
        </div>
      </Link>
    </article>
  )
}

export default ProductGridCard
