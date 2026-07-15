import React, { MouseEventHandler } from 'react'
import { Link } from 'react-router-dom'
import { formatCurrency, getDiscountedPrice } from '../utils/format'
import type { Product } from '../../interface'

interface ProductGridCardProps {
  product: Product
  cardClassName?: string
  onClick?: MouseEventHandler<HTMLAnchorElement>
}

const ProductGridCard = ({
  product,
  cardClassName = 'c-6 m-4 l-2 card-product',
  onClick,
}: ProductGridCardProps) => (
  <div className={cardClassName} data-testid="product-grid-card">
    <Link className="product" to={`/product-detail/${product.id}`} onClick={onClick}>
      <div className="img" style={{ backgroundImage: `url(${product.imgPrimary})` }} />
      <div className="product-details">
        <div className="name">{product.name}</div>
        <div className="price">
          <span>{formatCurrency(getDiscountedPrice(product.price, product.discount))}</span>
          <p>Đã bán {product.sold}</p>
        </div>
      </div>
    </Link>
  </div>
)

export default ProductGridCard
