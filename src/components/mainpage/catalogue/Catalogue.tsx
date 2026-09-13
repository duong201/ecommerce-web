import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory, useLocation } from 'react-router-dom'
import './Catalogue.scss'
import { CloseIcon, SearchIcon, TuneIcon } from '../../../common/components/ui/icons'
import { useFetch } from '../../../common/hooks/useFetch'
import { categoryService, productService } from '../../../services'
import { formatPrice } from '../../../common/utils/format'
import ProductGridCard from '../../../common/components/ProductGridCard'
import {
  Badge,
  Button,
  Checkbox,
  EmptyState,
  IconButton,
  Pagination,
  Select,
  Skeleton,
} from '../../../common/components/ui'
import type { Category, Paginated, Product, ProductSort } from '../../../interface'

const PAGE_SIZE = 12
const DEBOUNCE_MS = 300

const EMPTY: Paginated<Product> = {
  data: [],
  meta: { total: 0, page: 1, limit: PAGE_SIZE, totalPages: 0 },
}

const SORT_VALUES = ['newest', 'price_asc', 'price_desc', 'rating', 'name']

const PRICE_PRESETS = [
  { key: 'under100', min: '', max: '100000' },
  { key: 'from100to300', min: '100000', max: '300000' },
  { key: 'from300to500', min: '300000', max: '500000' },
  { key: 'over500', min: '500000', max: '' },
]

type ParamChanges = Record<string, string | number | boolean | undefined>

const Catalogue = () => {
  const { t } = useTranslation()
  const history = useHistory()
  const location = useLocation()
  const params = useMemo(() => new URLSearchParams(location.search), [location.search])

  const q = params.get('q') ?? ''
  const categoryId = params.get('categoryId') ?? ''
  const minPrice = params.get('minPrice') ?? ''
  const maxPrice = params.get('maxPrice') ?? ''
  const inStock = params.get('inStock') === 'true'
  const isOrganic = params.get('isOrganic') === 'true'
  const sort = (params.get('sort') as ProductSort) || 'newest'
  const page = Math.max(1, Number(params.get('page')) || 1)

  const [term, setTerm] = useState(q)
  const [draftMin, setDraftMin] = useState(minPrice)
  const [draftMax, setDraftMax] = useState(maxPrice)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const setParams = useCallback(
    (changes: ParamChanges, keepPage = false) => {
      const next = new URLSearchParams(location.search)

      Object.entries(changes).forEach(([key, value]) => {
        if (value === undefined || value === '' || value === false) next.delete(key)
        else next.set(key, String(value))
      })
      if (!keepPage) next.delete('page')

      history.replace({ pathname: location.pathname, search: next.toString() })
    },
    [history, location.pathname, location.search],
  )

  useEffect(() => setTerm(q), [q])
  useEffect(() => setDraftMin(minPrice), [minPrice])
  useEffect(() => setDraftMax(maxPrice), [maxPrice])

  useEffect(() => {
    if (term === q) return undefined
    const timer = window.setTimeout(() => setParams({ q: term }), DEBOUNCE_MS)
    return () => window.clearTimeout(timer)
  }, [term, q, setParams])

  const fetchCategories = useCallback(() => categoryService.list(true), [])
  const { data: categories } = useFetch<Category[]>(fetchCategories, [], [])

  const fetchResults = useCallback(
    () =>
      productService.list({
        q: q || undefined,
        categoryId: categoryId || undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        inStock: inStock || undefined,
        isOrganic: isOrganic || undefined,
        sort,
        page,
        limit: PAGE_SIZE,
      }),
    [q, categoryId, minPrice, maxPrice, inStock, isOrganic, sort, page],
  )

  const { data: result, loading } = useFetch<Paginated<Product>>(
    fetchResults,
    [q, categoryId, minPrice, maxPrice, inStock, isOrganic, sort, page],
    EMPTY,
  )

  const activeCategory = categories.find((category) => category.id === categoryId)
  const heading = q
    ? t('catalogue.resultsFor', { query: q })
    : (activeCategory?.name ?? t('catalogue.allFruit'))
  const hasFilters = Boolean(categoryId || minPrice || maxPrice || inStock || isOrganic)
  const priceInvalid = Boolean(draftMin && draftMax && Number(draftMin) > Number(draftMax))

  const applyPrice = (event: React.FormEvent) => {
    event.preventDefault()
    if (priceInvalid) return
    setParams({ minPrice: draftMin, maxPrice: draftMax })
  }

  const clearAll = () => {
    setDraftMin('')
    setDraftMax('')
    history.replace({
      pathname: location.pathname,
      search: q ? `?q=${encodeURIComponent(q)}` : '',
    })
  }

  const filterPanel = (
    <div className="catalogue-filters__inner">
      <section className="catalogue-filters__group">
        <h3>{t('catalogue.price')}</h3>

        <form className="catalogue-filters__price" onSubmit={applyPrice}>
          <label>
            <span>{t('catalogue.min')}</span>
            <input
              type="number"
              min="0"
              step="1000"
              inputMode="numeric"
              placeholder="0"
              value={draftMin}
              onChange={(event) => setDraftMin(event.target.value)}
            />
          </label>

          <span className="catalogue-filters__price-sep" aria-hidden="true">
            –
          </span>

          <label>
            <span>{t('catalogue.max')}</span>
            <input
              type="number"
              min="0"
              step="1000"
              inputMode="numeric"
              placeholder={t('catalogue.maxPlaceholder')}
              value={draftMax}
              onChange={(event) => setDraftMax(event.target.value)}
            />
          </label>

          <Button type="submit" size="sm" disabled={priceInvalid}>
            {t('common.apply')}
          </Button>
        </form>

        {priceInvalid && (
          <p className="catalogue-filters__error" role="alert">
            {t('catalogue.priceInvalid')}
          </p>
        )}

        <div className="catalogue-filters__presets">
          {PRICE_PRESETS.map((preset) => {
            const active = minPrice === preset.min && maxPrice === preset.max
            return (
              <button
                key={preset.key}
                type="button"
                className={active ? 'is-active' : ''}
                aria-pressed={active}
                onClick={() =>
                  setParams(
                    active
                      ? { minPrice: '', maxPrice: '' }
                      : { minPrice: preset.min, maxPrice: preset.max },
                  )
                }
              >
                {t(`catalogue.preset.${preset.key}`)}
              </button>
            )
          })}
        </div>
      </section>

      <section className="catalogue-filters__group">
        <h3>{t('catalogue.category')}</h3>
        <ul className="catalogue-filters__categories">
          <li>
            <button
              type="button"
              className={!categoryId ? 'is-active' : ''}
              onClick={() => setParams({ categoryId: '' })}
            >
              {t('catalogue.allFruit')}
            </button>
          </li>
          {categories.map((category) => (
            <li key={category.id} className={category.parentId ? 'is-child' : ''}>
              <button
                type="button"
                className={categoryId === category.id ? 'is-active' : ''}
                onClick={() => setParams({ categoryId: category.id })}
              >
                {category.name}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="catalogue-filters__group">
        <h3>{t('catalogue.refine')}</h3>
        <div className="catalogue-filters__checks">
          <Checkbox
            label={t('catalogue.inStockToday')}
            checked={inStock}
            onChange={(event) => setParams({ inStock: event.target.checked })}
          />
          <Checkbox
            label={t('catalogue.organicOnly')}
            checked={isOrganic}
            onChange={(event) => setParams({ isOrganic: event.target.checked })}
          />
        </div>
      </section>

      {hasFilters && (
        <Button variant="ghost" block onClick={clearAll}>
          {t('catalogue.clearAll')}
        </Button>
      )}
    </div>
  )

  return (
    <div className="grid wide catalogue-page">
      <div className="catalogue-hero">
        <h1>{heading}</h1>
        <p>{t('catalogue.lede')}</p>

        <form
          className="catalogue-hero__form"
          role="search"
          onSubmit={(event) => event.preventDefault()}
        >
          <SearchIcon className="catalogue-hero__icon" />
          <input
            type="search"
            className="catalogue-hero__input"
            placeholder={t('catalogue.searchPlaceholder')}
            aria-label={t('catalogue.searchAria')}
            value={term}
            onChange={(event) => setTerm(event.target.value)}
          />
          {term && (
            <IconButton
              className="catalogue-hero__clear"
              label={t('catalogue.clearSearch')}
              icon={<CloseIcon />}
              onClick={() => setTerm('')}
            />
          )}
        </form>
      </div>

      <div className="catalogue-layout">
        <aside
          className={['catalogue-filters', filtersOpen ? 'is-open' : ''].filter(Boolean).join(' ')}
          aria-label={t('catalogue.filtersAria')}
        >
          <div className="catalogue-filters__head">
            <h2>{t('catalogue.filters')}</h2>
            <IconButton
              className="catalogue-filters__close"
              label={t('catalogue.hideFilters')}
              icon={<CloseIcon />}
              onClick={() => setFiltersOpen(false)}
            />
          </div>
          {filterPanel}
        </aside>

        <section className="catalogue-results">
          <div className="catalogue-results__toolbar">
            <p className="catalogue-results__count">
              {loading
                ? t('catalogue.searching')
                : t('catalogue.count', { count: result.meta.total })}
              {q && !loading && <span>{t('catalogue.forQuery', { query: q })}</span>}
            </p>

            <div className="catalogue-results__controls">
              <IconButton
                className="catalogue-results__filter-toggle"
                variant="outline"
                label={t('catalogue.showFilters')}
                icon={<TuneIcon />}
                onClick={() => setFiltersOpen(true)}
              />
              <Select
                aria-label={t('catalogue.sortAria')}
                options={SORT_VALUES.map((value) => ({
                  value,
                  label: t(`catalogue.sort.${value}`),
                }))}
                value={sort}
                size="sm"
                onChange={(event) => setParams({ sort: event.target.value })}
              />
            </div>
          </div>

          {hasFilters && (
            <div className="catalogue-results__chips">
              {activeCategory && <Badge tone="brand">{activeCategory.name}</Badge>}
              {(minPrice || maxPrice) && (
                <Badge tone="brand">
                  {t('catalogue.priceRange', {
                    min: minPrice ? formatPrice(Number(minPrice)) : t('catalogue.any'),
                    max: maxPrice ? formatPrice(Number(maxPrice)) : t('catalogue.any'),
                  })}
                </Badge>
              )}
              {inStock && <Badge tone="success">{t('catalogue.inStock')}</Badge>}
              {isOrganic && <Badge tone="success">{t('catalogue.organic')}</Badge>}
              <Button variant="link" size="sm" onClick={clearAll}>
                {t('common.clear')}
              </Button>
            </div>
          )}

          {loading && (
            <div className="product-grid">
              {Array.from({ length: 6 }, (_, index) => (
                <div className="catalogue-results__skeleton" key={index}>
                  <Skeleton height={18} radius="1rem" />
                  <Skeleton height={1.6} />
                  <Skeleton height={1.6} width="50%" />
                </div>
              ))}
            </div>
          )}

          {!loading && result.data.length === 0 && (
            <EmptyState
              title={q ? t('catalogue.emptyWithQuery', { query: q }) : t('catalogue.emptyTitle')}
              description={t('catalogue.emptyDescription')}
              action={
                hasFilters ? (
                  <Button onClick={clearAll}>{t('catalogue.clearAll')}</Button>
                ) : undefined
              }
            />
          )}

          {!loading && result.data.length > 0 && (
            <div className="product-grid">
              {result.data.map((product) => (
                <ProductGridCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <Pagination
            page={result.meta.page}
            totalPages={result.meta.totalPages}
            total={result.meta.total}
            onChange={(next) => setParams({ page: next }, true)}
          />
        </section>
      </div>

      {filtersOpen && (
        <button
          type="button"
          className="catalogue-filters__backdrop"
          aria-label={t('catalogue.hideFilters')}
          onClick={() => setFiltersOpen(false)}
        />
      )}
    </div>
  )
}

export default Catalogue
