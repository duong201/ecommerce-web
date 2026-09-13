import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { BoltIcon } from '../../../common/components/ui/icons'
import { Link } from 'react-router-dom'
import './FlashDeals.scss'
import { useFetch } from '../../../common/hooks/useFetch'
import { inventoryService } from '../../../services'
import { NO_IMAGE_URL } from '../../../common/constants'
import {
  discountPercent,
  expiryTone,
  formatExpiry,
  formatPrice,
  formatQuantity,
} from '../../../common/utils/format'
import { Badge, Carousel, EmptyState, Skeleton } from '../../../common/components/ui'
import type { InventoryBatch } from '../../../interface'

/**
 * Near-expiry batches the shop has marked down. This is the section that turns
 * an inventory problem into a sale, so the card leads with the discount and the
 * days remaining rather than hiding them in small print.
 */
const FlashDeals = () => {
  const { t } = useTranslation()
  const fetchExpiring = useCallback(() => inventoryService.expiring(3), [])
  const { data: batches, loading } = useFetch<InventoryBatch[]>(fetchExpiring, [], [])

  const deals = batches.filter((batch) => batch.markdownPriceAmount !== null && batch.variant)

  return (
    <section className="flash-deals">
      <div className="grid wide">
        <header className="flash-deals__head">
          <div>
            <h2 className="flash-deals__title">
              <BoltIcon />
              {t('home.flash.title')}
            </h2>
            <p className="flash-deals__subtitle">{t('home.flash.subtitle')}</p>
          </div>
          <Link to="/san-pham" className="flash-deals__all">
            {t('home.flash.seeAll')}
          </Link>
        </header>

        {loading && (
          <div className="product-grid">
            {Array.from({ length: 5 }, (_, index) => (
              <div className="flash-card flash-card--skeleton" key={index}>
                <Skeleton height={16} radius="1rem" />
                <Skeleton height={1.6} />
                <Skeleton height={1.6} width="60%" />
              </div>
            ))}
          </div>
        )}

        {!loading && deals.length === 0 && (
          <EmptyState
            icon={<BoltIcon />}
            title={t('home.flash.emptyTitle')}
            description={t('home.flash.emptyDescription')}
          />
        )}

        {!loading && deals.length > 0 && (
          <Carousel ariaLabel={t('home.flash.listAria')}>
            {deals.map((batch) => {
              const variant = batch.variant!
              const listPrice = Number(variant.priceAmount)
              const dealPrice = Number(batch.markdownPriceAmount)
              const percentOff = discountPercent(dealPrice, listPrice)
              const tone = expiryTone(batch.expiryDate)

              return (
                <Link className="flash-card" key={batch.id} to={`/san-pham/${variant.productId}`}>
                  <div className="flash-card__media">
                    <img src={NO_IMAGE_URL} alt="" loading="lazy" />
                    <span className="flash-card__discount">−{percentOff}%</span>
                  </div>

                  <div className="flash-card__body">
                    <h3>{variant.name}</h3>
                    <p className="flash-card__sku">{variant.sku}</p>

                    <p className="flash-card__price">
                      <strong className="numeric">{formatPrice(dealPrice)}</strong>
                      <del className="numeric">{formatPrice(listPrice)}</del>
                    </p>

                    <div className="flash-card__footer">
                      <Badge tone={tone === 'danger' ? 'danger' : 'warning'} size="sm" dot>
                        {formatExpiry(batch.expiryDate)}
                      </Badge>
                      <span className="flash-card__stock numeric">
                        {t('home.flash.left', {
                          quantity: formatQuantity(batch.remainingQuantity),
                        })}
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </Carousel>
        )}
      </div>
    </section>
  )
}

export default FlashDeals
