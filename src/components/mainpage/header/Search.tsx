import React, { useMemo, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useFetch } from '../../../common/hooks/useFetch'
import { getCarts, getProducts } from '../../../common/api'
import { getCurrentUserId } from '../../../common/utils/session'
import type { CartItem, Product } from '../../../interface'

const MAX_SUGGESTIONS = 5

// `cartItem` is accepted only so Header can keep forwarding it — this component
// fetches its own cart data instead.
interface SearchProps {
  cartItem?: CartItem[]
}

const Search = (_props: SearchProps) => {
  const idUser = getCurrentUserId()
  const history = useHistory()

  const { data: dataCart } = useFetch<CartItem[]>(getCarts, [], [])
  const { data: products } = useFetch<Product[]>(getProducts, [], [])

  const [query, setQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)

  const cartItem = useMemo(
    () => dataCart.filter((data) => String(data.iduser) === String(idUser)),
    [dataCart, idUser],
  )

  const suggestions = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return []
    return products
      .filter((product) => product.name.toLowerCase().includes(term))
      .slice(0, MAX_SUGGESTIONS)
  }, [products, query])

  const goToSearchResults = (term: string) => {
    setShowSuggestions(false)
    history.push(`/products${term ? `?search=${encodeURIComponent(term)}` : ''}`)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    goToSearchResults(query.trim())
  }

  const handleSuggestionClick = (product: Product) => {
    setShowSuggestions(false)
    setQuery('')
    history.push(`/product-detail/${product.id}`)
  }

  return (
    <>
      <div className="header-with-search">
        <div className="header__logo">
          <Link to="/">Tipee</Link>
        </div>

        <form className="header__search" onSubmit={handleSubmit} role="search">
          <input
            type="text"
            className="header__search-input"
            placeholder="Nhập để tìm kiếm"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setShowSuggestions(false)}
          />
          <button type="submit" className="header__search-btn">
            <i className="header__search-btn-icon fa-solid fa-magnifying-glass"></i>
          </button>

          {showSuggestions && suggestions.length > 0 && (
            <ul className="header__search-suggestions">
              {suggestions.map((product) => (
                <li key={product.id}>
                  <button type="button" onMouseDown={() => handleSuggestionClick(product)}>
                    {product.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </form>

        <Link to="/wishlist" className="header__cart">
          <i className="header__cart-icon fa-regular fa-heart"></i>
        </Link>

        <Link to="/cart" className="header__cart">
          <i className="header__cart-icon fa-solid fa-cart-shopping"></i>
          <span>{cartItem.length}</span>
        </Link>
      </div>
    </>
  )
}

export default Search
