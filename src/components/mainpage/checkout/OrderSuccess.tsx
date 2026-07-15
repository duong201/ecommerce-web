import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import './OrderSuccess.css'
import { formatCurrency } from '../../../common/utils/format'
import { getCurrentUserId } from '../../../common/utils/session'

interface OrderSuccessState {
  orderCount?: number
  total?: number
}

const OrderSuccess = () => {
  const { state } = useLocation<OrderSuccessState | undefined>()
  const { orderCount, total } = state || {}
  const idUser = getCurrentUserId()

  return (
    <div className="mgt-32">
      <div className="grid wide">
        <div className="order-success">
          <i className="fa-solid fa-circle-check"></i>
          <h1>Đặt hàng thành công!</h1>
          {orderCount && (
            <p>
              Đơn hàng gồm {orderCount} sản phẩm
              {total ? `, tổng cộng ${formatCurrency(total)} đ` : ''} đã được tiếp nhận.
            </p>
          )}
          <div className="order-success-actions">
            <Link to="/products" className="btn">
              Tiếp tục mua sắm
            </Link>
            {idUser && (
              <Link to={`/user/info/${idUser}`} className="btn">
                Xem đơn hàng của tôi
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderSuccess
