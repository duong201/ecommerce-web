import React from 'react'
import './Suggest.css'
import { useFetch } from '../../../common/hooks/useFetch'
import { getProducts } from '../../../common/api'
import ProductGridCard from '../../../common/components/ProductGridCard'
import type { Product } from '../../../interface'

// `products`/`seenProduct` are accepted only so callers can keep forwarding
// them — this component fetches its own data instead.
interface SuggestProps {
  products?: Product[]
  seenProduct?: unknown
}

const Suggest = (_props: SuggestProps) => {
  const { data: products } = useFetch<Product[]>(getProducts, [], [])

  return (
    <>
      <div className="grid wide">
        <div className="row">
          <div className="l-12 suggest-header mgt-32 ">
            <span className="l-2 active">Gợi ý hôm nay</span>
          </div>
        </div>

        <div className="row box-product">
          {products.map((product) => (
            <ProductGridCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </>
  )
}

export default Suggest
