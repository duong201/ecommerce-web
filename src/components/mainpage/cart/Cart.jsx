import React, { useMemo } from 'react'
import { Link, useHistory } from 'react-router-dom'
import Suggest from '../suggest/Suggest'
import './Cart.css'
import { useFetch } from '../../../common/hooks/useFetch'
import { getCarts, deleteCartItem, changeCartAmount } from '../../../common/api'
import { formatCurrency, getDiscountedPrice } from '../../../common/utils/format'
import { getCurrentUserId } from '../../../common/utils/session'

const Cart = () => {
  const idUser = getCurrentUserId();
  const history = useHistory()

  const { data: dataCart, setData: setDataCart } = useFetch(getCarts, [])

  const cartItem = useMemo(
    () => dataCart.filter((data) => String(data.iduser) === String(idUser)),
    [dataCart, idUser]
  )

  const deleteToCart = (id) => {
    deleteCartItem(id).then((response) => {
      if (response.data.status === 'success') {
        setDataCart((current) => current.filter((item) => item.id !== id))
      }
    })
  }

  const changeAmount = (item, delta) => {
    const nextAmount = item.amount + delta
    if (nextAmount < 1) return
    changeCartAmount({ amount: nextAmount, id: item.id }).then((response) => {
      if (response.data.status === 'success') {
        setDataCart((current) => current.map((data) => (data.id === item.id ? { ...data, amount: nextAmount } : data)))
      }
    })
  }

  const goToCheckout = () => history.push('/checkout')

  const totalPrice = cartItem.reduce((price, item) => price + item.amount * getDiscountedPrice(item.price, item.discount), 0)

  return (
    <>
      <div className="mgt-32">
        <div className="grid wide">
          <div className="row container">
            <div className="c-12 m-12 l-8">
              <div className="cart-details">
                {
                  cartItem.length === 0 && <h1 className="no-items product">Giỏ hàng trống</h1>
                }

                {
                  cartItem.map((item) => {
                    const productAmount = getDiscountedPrice(item.price, item.discount) * item.amount
                    return (
                      <div className="cart-list product" key={item.id}>
                        <div className="row cart-item">
                          <div className="l-2 img ">
                            <img src={item.imgPrimary} alt="" />
                          </div>

                          <div className="l-5 name ">
                            <Link to={`/product-detail/${item.idproduct}`} className='text-hover'>{item.name}</Link>
                            {
                              (item.color || item.size) && (
                                <p className='cart-item-variant'>
                                  {[item.color, item.size ? `size ${item.size}` : null].filter(Boolean).join(', ')}
                                </p>
                              )
                            }
                            <div className='original-price'>
                              <span className="old-price">{formatCurrency(item.price)}</span>
                              <span className="new-price">{formatCurrency(getDiscountedPrice(item.price, item.discount))}</span>
                            </div>
                          </div>


                          <div className="l-2 price t-a-ct box-amount">
                            <button className="btn btn-rem" onClick={() => changeAmount(item, -1)}>
                              <i className="fas fa-minus"></i>
                            </button>
                            <span className='primary-text amount'>{item.amount}</span>
                            <button className="btn btn-add" onClick={() => changeAmount(item, 1)}>
                              <i className="fas fa-plus"></i>
                            </button>
                          </div>

                          <span className='l-2 t-a-ct primary-text cart-item-total'>{formatCurrency(productAmount)}</span>

                          <div className="l-1 cart-items-function">
                            <div className="remove-cart">
                              <button className="btn" onClick={() => deleteToCart(item.id)}>Xóa</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                }
              </div>
            </div>
            <div className="c-12 m-12 l-4">
              <div className="cart-total">
                <div className="total-header">
                  <span>Tổng thanh toán</span>
                </div>
                <div className="total-price">
                  <p>Tổng tiền:</p>
                  <span>{formatCurrency(totalPrice)} đ</span>
                </div>
                <button className="btn" onClick={goToCheckout} disabled={cartItem.length === 0}>Thanh toán</button>
              </div>
            </div>
          </div>
        </div>
        <Suggest />
      </div>
    </>
  )
}

export default Cart
