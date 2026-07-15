import React, { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Products.css'
import { useFetch } from '../../../common/hooks/useFetch'
import { getProducts, getCategories } from '../../../common/api'
import { getDiscountedPrice } from '../../../common/utils/format'
import ProductGridCard from '../../../common/components/ProductGridCard'
import type { Product, Category } from '../../../interface'

const PAGE_SIZE = 12

const SORT_OPTIONS = [
  { key: 'popular', label: 'Phổ biến' },
  { key: 'newest', label: 'Mới nhất' },
  { key: 'bestseller', label: 'Bán chạy' },
]

const PRICE_SORT_OPTIONS = [
  { key: 'price-asc', label: 'Thấp đến Cao' },
  { key: 'price-desc', label: 'Cao đến Thấp' },
]

const sortProducts = (products: Product[], sortKey: string) => {
  const sorted = [...products]
  switch (sortKey) {
    case 'newest':
      return sorted.sort(
        (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime(),
      )
    case 'bestseller':
      return sorted.sort((a, b) => (b.sold || 0) - (a.sold || 0))
    case 'price-asc':
      return sorted.sort(
        (a, b) => getDiscountedPrice(a.price, a.discount) - getDiscountedPrice(b.price, b.discount),
      )
    case 'price-desc':
      return sorted.sort(
        (a, b) => getDiscountedPrice(b.price, b.discount) - getDiscountedPrice(a.price, a.discount),
      )
    default:
      return sorted
  }
}

const useQueryParam = (name: string) => {
  const { search } = useLocation()
  return useMemo(() => new URLSearchParams(search).get(name) || '', [search, name])
}

const Products = () => {
  const { data: products } = useFetch<Product[]>(getProducts, [], [])
  const { data: categorize } = useFetch<Category[]>(getCategories, [], [])
  const [category, setCategory] = useState<number | null>(null)
  const [sortKey, setSortKey] = useState('popular')
  const [page, setPage] = useState(1)
  const searchTerm = useQueryParam('search')

  useEffect(() => {
    setPage(1)
  }, [category, sortKey, searchTerm])

  const filteredProducts = useMemo(() => {
    let result = products
    if (category !== null) {
      result = result.filter((product) => product.idcategorize === category)
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter((product) => product.name.toLowerCase().includes(term))
    }
    return result
  }, [products, category, searchTerm])

  const sortedProducts = useMemo(
    () => sortProducts(filteredProducts, sortKey),
    [filteredProducts, sortKey],
  )

  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const visibleProducts = sortedProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  )

  return (
    <>
      <div className="grid wide">
        <div className="row box-products mgt-32">
          <div className="c-12 m-12 l-2">
            <div className="category-products">
              <span>
                <i className="fa-solid fa-list"></i> Tất cả danh mục
              </span>
              <ul className="category-list">
                <li className="category-item">
                  <button
                    type="button"
                    className={category === null ? 'active' : ''}
                    onClick={() => setCategory(null)}
                  >
                    Tất cả sản phẩm
                  </button>
                </li>
                {categorize.map((value) => {
                  return (
                    <li className="category-item" key={value.id}>
                      <button
                        type="button"
                        className={category === value.id ? 'active' : ''}
                        onClick={() => setCategory(value.id)}
                      >
                        {value.categorize}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
          <div className="c-12 m-12 l-10">
            {searchTerm && (
              <div className="search-summary">
                Kết quả tìm kiếm cho "<strong>{searchTerm}</strong>" ({sortedProducts.length} sản
                phẩm) <Link to="/products">Xóa tìm kiếm</Link>
              </div>
            )}
            <div className="row products-control">
              <div className="filter">
                <span className="filter-label">Sắp xếp theo</span>
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.key}
                    className={`btn ${sortKey === option.key ? 'active' : ''}`}
                    onClick={() => setSortKey(option.key)}
                  >
                    {option.label}
                  </button>
                ))}
                <span className="filter-label price">Giá</span>
                {PRICE_SORT_OPTIONS.map((option) => (
                  <button
                    key={option.key}
                    className={`btn ${sortKey === option.key ? 'active' : ''}`}
                    onClick={() => setSortKey(option.key)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <div className="paginate">
                <span className="paginate-num">
                  <span className="paginate-total">{currentPage}</span>/{totalPages}
                </span>
                <button
                  type="button"
                  className="prev btn"
                  disabled={currentPage <= 1}
                  onClick={() => setPage(currentPage - 1)}
                >
                  <i className="fa-solid fa-chevron-left"></i>
                </button>
                <button
                  type="button"
                  className="next btn"
                  disabled={currentPage >= totalPages}
                  onClick={() => setPage(currentPage + 1)}
                >
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
              </div>
            </div>

            <div className="row products-list">
              <div className="col ">
                <div className="row list-products">
                  {visibleProducts.length === 0 && (
                    <p className="no-items">Không tìm thấy sản phẩm phù hợp.</p>
                  )}
                  {visibleProducts.map((product) => (
                    <ProductGridCard
                      key={product.id}
                      product={product}
                      cardClassName="c-6 m-4 l-2-4 box-list-products"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Products
