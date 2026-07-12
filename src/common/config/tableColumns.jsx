import React from 'react'
import { Link } from 'react-router-dom'
import { formatCurrency } from '../utils/format'

export const buildProductColumns = () => [
  { key: 'id', header: 'ID', className: 'id' },
  {
    key: 'product',
    header: 'Sản phẩm',
    className: 'product',
    render: (row) => (
      <div className="cellWrapper">
        <img src={row.imgPrimary} alt="" />
        <span>{row.name}</span>
      </div>
    ),
  },
  {
    key: 'date',
    header: 'Ngày bán',
    className: 'date',
    render: (row) => (row.createdAt ? new Date(row.createdAt).toLocaleDateString('vi-VN') : ''),
  },
  {
    key: 'price',
    header: 'Giá bán',
    className: 'price',
    render: (row) => formatCurrency(row.price),
  },
  { key: 'discount', header: 'Discount', className: 'discount' },
  { key: 'sold', header: 'Đã bán', className: 'sold' },
  { key: 'amount', header: 'Số lượng còn', className: 'amount' },
  {
    key: 'status',
    header: 'Trạng thái',
    className: 'status',
    render: () => <span className="on-sale">Đang bán</span>,
  },
]

export const buildOrderColumns = () => [
  { key: 'id', header: 'ID', className: 'id' },
  {
    key: 'name',
    header: 'Sản phẩm',
    className: 'name',
    render: (row) => (
      <div className="cellWrapper">
        <img src={row.imgPrimary} alt="" />
        <span>{row.name}</span>
      </div>
    ),
  },
  { key: 'amount', header: 'Số lượng', className: 'amount' },
  {
    key: 'price',
    header: 'Tổng tiền',
    className: 'price',
    render: (row) => formatCurrency(row.price),
  },
  { key: 'description', header: 'Mô tả', className: 'description' },
  { key: 'idorder', header: 'Mã order', className: 'idorder' },
  { key: 'iduser', header: 'Mã người order', className: 'iduser' },
  { key: 'address', header: 'Địa chỉ', className: 'address' },
  { key: 'payment', header: 'Thanh toán', className: 'payment' },
  { key: 'status', header: 'Trạng thái', className: 'status' },
]

export const buildUserColumns = ({ onDelete }) => [
  { key: 'id', header: 'ID', className: 'id' },
  { key: 'country', header: '', className: 'country' },
  {
    key: 'fullname',
    header: 'Họ và tên',
    className: 'fullname',
    render: (row) => (
      <div className="cellWrapper">
        <span>{row.fullname}</span>
      </div>
    ),
  },
  {
    key: 'phone',
    header: 'Số điện thoại',
    className: 'phone',
    render: (row) => (row.phone ? `0${row.phone}` : ''),
  },
  { key: 'email', header: 'Email', className: 'email' },
  { key: 'username', header: 'Username', className: 'username' },
  {
    key: 'action',
    header: 'Tùy chỉnh',
    className: 'action',
    render: (row) => (
      <div className="userAction">
        <Link to={`/admin/list-user/user/${row.id}`} className="viewBtn">
          Xem
        </Link>
        <span className="deleteBtn" onClick={() => onDelete(row.id)}>
          Xóa
        </span>
      </div>
    ),
  },
]
