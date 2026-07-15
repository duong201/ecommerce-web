import React from 'react'
import { Link } from 'react-router-dom'
import '../cart/Cart.css'
import { useFetch } from '../../../common/hooks/useFetch'
import { getUserWishlist, removeFromWishlist, addToCart } from '../../../common/api'
import { formatCurrency, getDiscountedPrice } from '../../../common/utils/format'
import { getCurrentUserId } from '../../../common/utils/session'
import type { AxiosResponse } from 'axios'
import type { WishlistItem } from '../../../interface'

const Wishlist = () => {
  const idUser = getCurrentUserId()
  const { data: wishlist, setData: setWishlist } = useFetch<WishlistItem[]>(
    () =>
      idUser
        ? getUserWishlist(idUser)
        : (Promise.resolve({ data: [] }) as unknown as Promise<AxiosResponse<WishlistItem[]>>),
    [idUser],
    [],
  )

  const removeItem = (idproduct: number) => {
    removeFromWishlist(idUser as string, idproduct).then(() => {
      setWishlist((current) => current.filter((item) => item.idproduct !== idproduct))
    })
  }

  const moveToCart = (item: WishlistItem) => {
    addToCart({
      iduser: idUser as string,
      idproduct: item.idproduct,
      name: item.name,
      imgPrimary: item.imgPrimary,
      price: item.price,
      discount: item.discount,
      amount: 1,
    }).then((response) => {
      if (response.data.status === 'success') {
        removeItem(item.idproduct)
      }
    })
  }

  if (!idUser) {
    return (
      <div className="mgt-32">
        <div className="grid wide">
          <h1 className="no-items product">Đăng nhập để xem danh sách yêu thích</h1>
          <Link to="/user/login">Đăng nhập</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mgt-32">
      <div className="grid wide">
        <div className="cart-details">
          {wishlist.length === 0 && <h1 className="no-items product">Danh sách yêu thích trống</h1>}

          {wishlist.map((item) => (
            <div className="cart-list product" key={item.id}>
              <div className="row cart-item">
                <div className="l-2 img">
                  <img src={item.imgPrimary} alt="" />
                </div>

                <div className="l-5 name">
                  <Link to={`/product-detail/${item.idproduct}`} className="text-hover">
                    {item.name}
                  </Link>
                  <div className="original-price">
                    <span className="old-price">{formatCurrency(item.price)}</span>
                    <span className="new-price">
                      {formatCurrency(getDiscountedPrice(item.price, item.discount))}
                    </span>
                  </div>
                </div>

                <div className="l-3 t-a-ct">
                  <button className="btn" onClick={() => moveToCart(item)}>
                    <i className="fa-solid fa-cart-plus"></i> Thêm vào giỏ
                  </button>
                </div>

                <div className="l-2 cart-items-function">
                  <div className="remove-cart">
                    <button className="btn" onClick={() => removeItem(item.idproduct)}>
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Wishlist
