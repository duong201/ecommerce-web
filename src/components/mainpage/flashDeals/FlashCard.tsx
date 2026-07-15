import React from 'react'
import { Link } from 'react-router-dom'
import Slider from 'react-slick'
import { useFetch } from '../../../common/hooks/useFetch'
import { getProducts } from '../../../common/api'
import { formatCurrency, getDiscountedPrice } from '../../../common/utils/format'
import type { Product } from '../../../interface'

interface ArrowProps {
  onClick?: () => void
}

const NextArrow = (props: ArrowProps) => {
  const { onClick } = props
  return (
    <div className="control-btn" onClick={onClick}>
      <button className="next btn">
        <i className="fa-solid fa-arrow-right"></i>
      </button>
    </div>
  )
}

const PrevArrow = (props: ArrowProps) => {
  const { onClick } = props
  return (
    <div className="control-btn" onClick={onClick}>
      <button className="prev btn">
        <i className="fa-solid fa-arrow-left"></i>
      </button>
    </div>
  )
}

// `products`/`seenProduct`/`addToCart` are accepted only so callers can keep
// forwarding them from FlashDeals — this component fetches its own data instead.
interface FlashCardProps {
  products?: Product[]
  seenProduct?: unknown
  addToCart?: (product: Product) => void
}

const FlashCard = (_props: FlashCardProps) => {
  const { data: products } = useFetch<Product[]>(getProducts, [], [])

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 4,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 1113, settings: { slidesToShow: 4, slidesToScroll: 3 } },
      { breakpoint: 740, settings: { slidesToShow: 3, slidesToScroll: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 2, slidesToScroll: 1 } },
    ],
  }

  return (
    <>
      <div className="flash-card">
        <Slider {...settings}>
          {products.map((product) => {
            return (
              <div className="box" key={product.id}>
                <Link to={`/product-detail/${product.id}`} className="product">
                  <span className="discount">- {product.discount} %</span>
                  <div
                    className="img"
                    style={{ backgroundImage: `url(${product.imgPrimary})` }}
                  ></div>
                  <div className="product-details">
                    <span className="name">{product.name}</span>
                    <div className="price">
                      <span className="old-price">{formatCurrency(product.price)}</span>
                      <span className="new-price">
                        {formatCurrency(getDiscountedPrice(product.price, product.discount))}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            )
          })}
        </Slider>
      </div>
    </>
  )
}

export default FlashCard
