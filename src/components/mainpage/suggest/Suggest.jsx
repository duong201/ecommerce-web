import React from 'react'
import './Suggest.css'
import { useFetch } from '../../../common/hooks/useFetch'
import { getProducts } from '../../../common/api'
import ProductGridCard from '../../../common/components/ProductGridCard'

const Suggest = () => {
  const { data: products } = useFetch(getProducts, [])

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
