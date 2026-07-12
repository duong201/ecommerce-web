import React, { useEffect, useMemo, useState } from 'react'
import './ProductDetail.scss'
import { useParams } from 'react-router-dom'
import { useFetch } from '../../../common/hooks/useFetch'
import {
  getProduct,
  getProducts,
  getCarts,
  addToCart as postAddToCart,
  updateCartAmount,
  getProductReviews,
  addReview,
  getUserWishlist,
  addToWishlist,
  removeFromWishlist,
} from '../../../common/api'
import { getCurrentUserId, getCurrentUserName } from '../../../common/utils/session'
import { formatCurrency, getDiscountedPrice } from '../../../common/utils/format'
import { getErrorMessage } from '../../../common/utils/errorMessage'
import ProductGridCard from '../../../common/components/ProductGridCard'

const COLORS = ['Đen', 'Trắng', 'Xám']
const SIZES = ['28', '29', '30']

const showLoginPrompt = () => {
  document.getElementById('notiCart').classList.add('active')
  setTimeout(() => document.getElementById('notiCart').classList.remove('active'), 2000)
}

const Product = () => {
  const { id } = useParams()
  const idUser = getCurrentUserId()
  const userName = getCurrentUserName()

  const { data: product } = useFetch(() => getProduct(id), [id], {})
  const { data: products } = useFetch(getProducts, [])
  const { data: cartItem, setData: setCartItem } = useFetch(getCarts, [])
  const { data: reviews, setData: setReviews } = useFetch(() => getProductReviews(id), [id])
  const { data: wishlist, setData: setWishlist } = useFetch(
    () => (idUser ? getUserWishlist(idUser) : Promise.resolve({ data: [] })),
    [id, idUser],
  )

  const [selectedColor, setSelectedColor] = useState(COLORS[0])
  const [selectedSize, setSelectedSize] = useState(SIZES[0])

  const isWishlisted = useMemo(
    () => wishlist.some((item) => String(item.idproduct) === String(product.id)),
    [wishlist, product.id],
  )

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0
    return reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
  }, [reviews])

  const addToCart = (product) => {
    if (!idUser) {
      showLoginPrompt()
      return
    }

    const findCart = cartItem.find(
      (data) =>
        data.idproduct === product.id &&
        String(data.iduser) === String(idUser) &&
        (data.color || '') === selectedColor &&
        (data.size || '') === selectedSize,
    )

    if (findCart) {
      const nextAmount = findCart.amount + 1
      updateCartAmount({ amount: nextAmount, id: findCart.id }).then(() => {
        setCartItem((current) =>
          current.map((data) => (data.id === findCart.id ? { ...data, amount: nextAmount } : data)),
        )
      })
    } else {
      postAddToCart({
        iduser: idUser,
        idproduct: product.id,
        name: product.name,
        imgPrimary: product.imgPrimary,
        price: product.price,
        discount: product.discount,
        amount: 1,
        color: selectedColor,
        size: selectedSize,
      }).then((response) => {
        if (response.data.status === 'success') {
          setCartItem((current) => [...current, response.data.cart])
        }
      })
    }
  }

  const toggleWishlist = () => {
    if (!idUser) {
      showLoginPrompt()
      return
    }

    if (isWishlisted) {
      removeFromWishlist(idUser, product.id).then(() => {
        setWishlist((current) =>
          current.filter((item) => String(item.idproduct) !== String(product.id)),
        )
      })
    } else {
      addToWishlist({
        iduser: idUser,
        idproduct: product.id,
        name: product.name,
        imgPrimary: product.imgPrimary,
        price: product.price,
        discount: product.discount,
      }).then((response) => {
        if (response.data.wishlistItem) {
          setWishlist((current) => [...current, response.data.wishlistItem])
        }
      })
    }
  }

  const submitReview = ({ rating, comment }) => {
    return addReview(
      {
        idproduct: product.id,
        iduser: idUser,
        userName: userName || 'Khách hàng',
        rating,
        comment,
      },
      { silentError: true },
    ).then((response) => {
      setReviews((current) => [...current, response.data.review])
    })
  }

  return (
    <>
      <div className="grid wide">
        <div className="row mgt-32">
          <ShowProduct
            product={product}
            addToCart={addToCart}
            colors={COLORS}
            sizes={SIZES}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            isWishlisted={isWishlisted}
            toggleWishlist={toggleWishlist}
            averageRating={averageRating}
            reviewCount={reviews.length}
          />
        </div>

        <ReviewsSection reviews={reviews} canReview={Boolean(idUser)} onSubmit={submitReview} />

        <div className="grid wide">
          <div className="row">
            <div className="l-12 suggest-header mgt-32 ">
              <span className="l-2 active">Gợi ý hôm nay</span>
            </div>
          </div>

          <div className="row box-product">
            {products.map((item) => (
              <ProductGridCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

const Stars = ({ value }) => {
  const rounded = Math.round(value)
  return (
    <div className="rate">
      {[1, 2, 3, 4, 5].map((star) => (
        <i key={star} className={star <= rounded ? 'fa-solid fa-star' : 'fa-regular fa-star'}></i>
      ))}
    </div>
  )
}

const ShowProduct = ({
  product,
  addToCart,
  colors,
  sizes,
  selectedColor,
  setSelectedColor,
  selectedSize,
  setSelectedSize,
  isWishlisted,
  toggleWishlist,
  averageRating,
  reviewCount,
}) => {
  return (
    <>
      <div className="row box-details">
        <div className="c-12 m-12 l-5">
          <div className="img-main" style={{ backgroundImage: `url(${product.imgPrimary})` }}></div>
          <div className="img-list">
            <div
              className="l-2 img-item"
              style={{ backgroundImage: `url(${product.productImage})` }}
            ></div>
            <div
              className="l-2 img-item"
              style={{ backgroundImage: `url(${product.productImage})` }}
            ></div>
            <div
              className="l-2 img-item"
              style={{ backgroundImage: `url(${product.productImage})` }}
            ></div>
            <div
              className="l-2 img-item"
              style={{ backgroundImage: `url(${product.productImage})` }}
            ></div>
            <div
              className="l-2 img-item"
              style={{ backgroundImage: `url(${product.productImage})` }}
            ></div>
          </div>
        </div>

        <div className="c-12 m-12 l-7 describe">
          <span className="name">{product.name}</span>
          <button
            type="button"
            className={`wishlist-toggle ${isWishlisted ? 'active' : ''}`}
            aria-label="Yêu thích"
            onClick={toggleWishlist}
          >
            <i className={isWishlisted ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i>
          </button>

          <ul className="list-reviews">
            <li className="item-reviews separate">
              <span>{averageRating.toFixed(1)}</span>
              <Stars value={averageRating} />
            </li>
            <li className="item-reviews separate">
              <span>{reviewCount}</span>
              Đánh giá
            </li>
            <li className="item-reviews">
              <span>{product.sold}</span>
              Đã bán
            </li>
          </ul>

          <div className="price">
            <span>{formatCurrency(product.price)}</span>
            <span>
              {formatCurrency(getDiscountedPrice(product.price, product.discount))}
              <i>đ</i>
            </span>
            <span className="discountPrice">{product.discount}% Giảm</span>
          </div>

          <div className="clotherColor">
            <div className="clotherColor-item">Màu:</div>
            {colors.map((color) => (
              <div
                key={color}
                className={`clotherColor-item ${selectedColor === color ? 'active' : ''}`}
                onClick={() => setSelectedColor(color)}
              >
                {color}
              </div>
            ))}
          </div>

          <div className="clotherSize">
            <div className="clotherSize-item">Size:</div>
            {sizes.map((size) => (
              <div
                key={size}
                className={`clotherSize-item ${selectedSize === size ? 'active' : ''}`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </div>
            ))}
          </div>

          <button className="btn" onClick={() => addToCart(product)}>
            <i className="fa-solid fa-cart-plus"></i>
            Thêm vào giỏ hàng
          </button>

          <span id="notiCart" className="notiCart">
            Bạn cần đăng nhập để thực hiện thao tác này.
          </span>
        </div>
      </div>
    </>
  )
}

const ReviewsSection = ({ reviews, canReview, onSubmit }) => {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setRating(5)
  }, [canReview])

  const handleSubmit = (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    onSubmit({ rating, comment })
      .then(() => {
        setComment('')
      })
      .catch((err) => {
        setError(getErrorMessage(err))
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  return (
    <div className="row reviews-section">
      <div className="l-12">
        <h3>Đánh giá sản phẩm ({reviews.length})</h3>

        {canReview ? (
          <form className="review-form" onSubmit={handleSubmit}>
            <div className="review-form-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  aria-label={`${star} sao`}
                  onClick={() => setRating(star)}
                >
                  <i className={star <= rating ? 'fa-solid fa-star' : 'fa-regular fa-star'}></i>
                </button>
              ))}
            </div>
            <textarea
              placeholder="Chia sẻ cảm nhận của bạn về sản phẩm này"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
            />
            {error && <p className="form-error">{error}</p>}
            <button type="submit" className="btn" disabled={submitting}>
              Gửi đánh giá
            </button>
          </form>
        ) : (
          <p className="review-login-hint">Đăng nhập để đánh giá sản phẩm này.</p>
        )}

        <ul className="review-list">
          {reviews.length === 0 && (
            <li className="no-items">Chưa có đánh giá nào cho sản phẩm này.</li>
          )}
          {reviews.map((review) => (
            <li key={review.id} className="review-item">
              <div className="review-item-header">
                <strong>{review.userName}</strong>
                <Stars value={review.rating} />
                <span className="review-date">
                  {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
              {review.comment && <p>{review.comment}</p>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Product
