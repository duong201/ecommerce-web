import { useTranslation } from 'react-i18next'
import React, { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import './Suggest.scss'
import { useFetch } from '../../../common/hooks/useFetch'
import { productService } from '../../../services'
import ProductGridCard from '../../../common/components/ProductGridCard'
import { EmptyState, Segmented, Skeleton } from '../../../common/components/ui'
import type { Paginated, Product, ProductSort } from '../../../interface'

const LIMIT = 10

const EMPTY: Paginated<Product> = {
  data: [],
  meta: { total: 0, page: 1, limit: LIMIT, totalPages: 0 },
}

type Tab = 'rating' | 'newest' | 'price_asc'

const TABS = [
  { value: 'rating' as const, labelKey: 'favourites' },
  { value: 'newest' as const, labelKey: 'justArrived' },
  { value: 'price_asc' as const, labelKey: 'bestValue' },
]

const Suggest = () => {
  const { t } = useTranslation()
  const [tab, setTab] = useState<Tab>('rating')

  const fetchProducts = useCallback(
    () => productService.list({ limit: LIMIT, sort: tab as ProductSort, inStock: true }),
    [tab],
  )
  const { data: page, loading } = useFetch<Paginated<Product>>(fetchProducts, [tab], EMPTY)

  return (
    <section className="suggest">
      <div className="grid wide">
        <header className="suggest__head">
          <h2>{t('home.suggest.title')}</h2>
          <Segmented
            options={TABS.map((item) => ({
              value: item.value,
              label: t(`home.suggest.${item.labelKey}`),
            }))}
            value={tab}
            onChange={setTab}
            ariaLabel={t('home.suggest.sortAria')}
          />
        </header>

        {loading && (
          <div className="product-grid">
            {Array.from({ length: LIMIT }, (_, index) => (
              <div className="suggest__skeleton" key={index}>
                <Skeleton height={18} radius="1rem" />
                <Skeleton height={1.6} />
                <Skeleton height={1.6} width="50%" />
              </div>
            ))}
          </div>
        )}

        {!loading && page.data.length === 0 && (
          <EmptyState
            title={t('home.suggest.emptyTitle')}
            description={t('home.suggest.emptyDescription')}
          />
        )}

        {!loading && page.data.length > 0 && (
          <>
            <div className="product-grid">
              {page.data.map((product) => (
                <ProductGridCard key={product.id} product={product} />
              ))}
            </div>

            <div className="suggest__more">
              <Link to="/san-pham" className="ui-btn ui-btn--secondary ui-btn--lg">
                {t('home.suggest.browseAll', { count: page.meta.total })}
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default Suggest
