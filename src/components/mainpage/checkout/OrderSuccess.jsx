import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import './OrderSuccess.css'
import { formatCurrency } from '../../../common/utils/format'
import { getCurrentUserId } from '../../../common/utils/session'

const OrderSuccess = () => {
  const { state = {} } = useLocation()
  const idUser = getCurrentUserId()

  return (
    <div className="mgt-32">
      <div className="grid wide">
        <div className="order-success">
          <i className="fa-solid fa-circle-check"></i>
          <h1>Đặt hàng thành công!</h1>
          {state.orderCount && (
            <p>
              Đơn hàng gồm {state.orderCount} sản phẩm
              {state.total ? `, tổng cộng ${formatCurrency(state.total)} đ` : ''} đã được tiếp nhận.
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
