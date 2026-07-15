import React from 'react'
import { Link } from 'react-router-dom'
import './Home.css'

const Categories = () => {
  const data = [
    'Thời trang nữ',
    'Thời trang nam',
    'Giày dép nữ',
    'Giày dép nam',
    'Phụ kiện nữ',
    'Phụ kiện nam',
    'Đồng hồ',
    'Thiết bị điện tử',
    'Phụ kiện & điện thoại',
    'Thiết bị gia dụng',
    'Mẹ & Bé',
    'Nhà cửa & đời sống',
    'Thể thao & du lịch',
    'Sắc đẹp & sức khỏe',
    'Nhà sách online',
  ]

  return (
    <>
      <div className="category">
        {data.map((value, index) => {
          return (
            <Link className="box" to="/products" key={index}>
              <span>{value}</span>
            </Link>
          )
        })}
      </div>
    </>
  )
}

export default Categories
