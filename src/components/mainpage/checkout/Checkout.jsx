import React, { useEffect, useMemo, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import './Checkout.css'
import { useFetch } from '../../../common/hooks/useFetch'
import { getCarts, getUser, addOrder, clearUserCart, applyCoupon } from '../../../common/api'
import { formatCurrency, getDiscountedPrice } from '../../../common/utils/format'
import { getCurrentUserId } from '../../../common/utils/session'
import { getErrorMessage } from '../../../common/utils/errorMessage'

const PAYMENT_METHODS = [
  'Thanh toán khi nhận hàng',
  'Chuyển khoản ngân hàng',
  'Ví điện tử',
]

const DEFAULT_ORDER_STATUS = 'Đang chuẩn bị hàng'

const buildDescription = (item) => [item.color, item.size ? `size ${item.size}` : null].filter(Boolean).join(', ')

const Checkout = () => {
  const idUser = getCurrentUserId();
  const history = useHistory()

  const { data: dataCart } = useFetch(getCarts, [])
  const { data: user } = useFetch(() => getUser(idUser), [idUser], {})

  const cartItem = useMemo(
    () => dataCart.filter((data) => String(data.iduser) === String(idUser)),
    [dataCart, idUser]
  )

  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [payment, setPayment] = useState(PAYMENT_METHODS[0])
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponError, setCouponError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    if (user.address) setAddress((current) => current || user.address)
    if (user.phone) setPhone((current) => current || user.phone)
  }, [user])

  const subtotal = cartItem.reduce((total, item) => total + item.amount * getDiscountedPrice(item.price, item.discount), 0)
  const discount = appliedCoupon ? Math.min(appliedCoupon.discount, subtotal) : 0
  const total = subtotal - discount

  const handleApplyCoupon = () => {
    setCouponError('')
    if (!couponCode.trim()) return
    applyCoupon({ code: couponCode.trim(), subtotal }, { silentError: true }).then((response) => {
      setAppliedCoupon({ code: response.data.coupon.code, discount: response.data.discount })
    }).catch((error) => {
      setAppliedCoupon(null)
      setCouponError(getErrorMessage(error))
    })
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode('')
    setCouponError('')
  }

  const placeOrder = () => {
    if (!address.trim()) {
      setFormError('Vui lòng nhập địa chỉ giao hàng')
      return
    }
    setFormError('')
    setSubmitting(true)

    const orderRequests = cartItem.map((item) => {
      const itemSubtotal = item.amount * getDiscountedPrice(item.price, item.discount)
      const itemDiscount = subtotal > 0 ? Math.round((discount * itemSubtotal) / subtotal) : 0
      const idorder = Math.floor(Math.random() * (1000000 - 1)) + 1

      return addOrder({
        iduser: idUser,
        idorder,
        name: item.name,
        imgPrimary: item.imgPrimary,
        price: itemSubtotal - itemDiscount,
        description: buildDescription(item),
        status: DEFAULT_ORDER_STATUS,
        address: `${address.trim()}${phone.trim() ? ` - SĐT: ${phone.trim()}` : ''}`,
        payment,
        amount: item.amount,
        couponCode: appliedCoupon ? appliedCoupon.code : '',
        discountAmount: itemDiscount,
      }, { silentError: true })
    })

    Promise.all(orderRequests).then((responses) => {
      const allSucceeded = responses.every((response) => response.data.status === 'success')
      if (!allSucceeded) {
        setFormError('Đặt hàng thất bại, vui lòng thử lại')
        setSubmitting(false)
        return
      }
      return clearUserCart(idUser).then(() => {
        history.push('/order-success', { orderCount: cartItem.length, total })
      })
    }).catch((error) => {
      setFormError(getErrorMessage(error))
      setSubmitting(false)
    })
  }

  if (cartItem.length === 0) {
    return (
      <div className="mgt-32">
        <div className="grid wide">
          <h1 className="no-items product">Giỏ hàng trống</h1>
          <Link to="/products">Tiếp tục mua sắm</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mgt-32">
      <div className="grid wide">
        <div className="row container">
          <div className="c-12 m-12 l-8">
            <div className="checkout-section">
              <h3>Thông tin giao hàng</h3>
              <label className="checkout-field">
                Địa chỉ nhận hàng
                <input
                  type="text"
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
                />
              </label>
              <label className="checkout-field">
                Số điện thoại
                <input
                  type="text"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="Số điện thoại liên hệ"
                />
              </label>
            </div>

            <div className="checkout-section">
              <h3>Phương thức thanh toán</h3>
              {
                PAYMENT_METHODS.map((method) => (
                  <label key={method} className="checkout-radio">
                    <input
                      type="radio"
                      name="payment"
                      checked={payment === method}
                      onChange={() => setPayment(method)}
                    />
                    {method}
                  </label>
                ))
              }
            </div>

            <div className="checkout-section">
              <h3>Sản phẩm ({cartItem.length})</h3>
              {
                cartItem.map((item) => (
                  <div className="checkout-item" key={item.id}>
                    <img src={item.imgPrimary} alt="" />
                    <div className="checkout-item-info">
                      <span className="checkout-item-name">{item.name}</span>
                      {buildDescription(item) && <span className="checkout-item-variant">{buildDescription(item)}</span>}
                      <span className="checkout-item-qty">x{item.amount}</span>
                    </div>
                    <span className="checkout-item-price">
                      {formatCurrency(item.amount * getDiscountedPrice(item.price, item.discount))}
                    </span>
                  </div>
                ))
              }
            </div>
          </div>

          <div className="c-12 m-12 l-4">
            <div className="checkout-summary">
              <h3>Mã giảm giá</h3>
              <div className="checkout-coupon">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(event) => setCouponCode(event.target.value)}
                  placeholder="Nhập mã giảm giá"
                  disabled={Boolean(appliedCoupon)}
                />
                {
                  appliedCoupon
                    ? <button type="button" className="btn" onClick={removeCoupon}>Hủy</button>
                    : <button type="button" className="btn" onClick={handleApplyCoupon}>Áp dụng</button>
                }
              </div>
              {couponError && <p className="checkout-error">{couponError}</p>}
              {appliedCoupon && <p className="checkout-success">Đã áp dụng mã "{appliedCoupon.code}"</p>}

              <div className="checkout-summary-row">
                <span>Tạm tính</span>
                <span>{formatCurrency(subtotal)} đ</span>
              </div>
              {
                discount > 0 && (
                  <div className="checkout-summary-row">
                    <span>Giảm giá</span>
                    <span>-{formatCurrency(discount)} đ</span>
                  </div>
                )
              }
              <div className="checkout-summary-row checkout-total">
                <span>Tổng thanh toán</span>
                <span>{formatCurrency(total)} đ</span>
              </div>

              {formError && <p className="checkout-error">{formError}</p>}

              <button className="btn" disabled={submitting} onClick={placeOrder}>
                {submitting ? 'Đang xử lý...' : 'Đặt hàng'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
