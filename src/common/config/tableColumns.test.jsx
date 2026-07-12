import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { buildProductColumns, buildOrderColumns, buildUserColumns } from './tableColumns'

describe('buildProductColumns', () => {
  const product = {
    id: 1,
    name: 'Áo thun nữ basic',
    imgPrimary: 'img.jpg',
    price: 150000,
    discount: 10,
    sold: 320,
    amount: 80,
    createdAt: '2024-01-05T00:00:00.000Z',
  }

  it('renders the product name and image inside the product column', () => {
    const columns = buildProductColumns()
    const productCol = columns.find((c) => c.key === 'product')
    render(<>{productCol.render(product)}</>)
    expect(screen.getByText('Áo thun nữ basic')).toBeInTheDocument()
    expect(screen.getByRole('img')).toHaveAttribute('src', 'img.jpg')
  })

  it('formats the price as currency', () => {
    const columns = buildProductColumns()
    const priceCol = columns.find((c) => c.key === 'price')
    expect(priceCol.render(product)).toBe(Intl.NumberFormat().format(150000))
  })

  it('formats createdAt as a localized date', () => {
    const columns = buildProductColumns()
    const dateCol = columns.find((c) => c.key === 'date')
    expect(dateCol.render(product)).toBe(new Date(product.createdAt).toLocaleDateString('vi-VN'))
  })

  it('renders an empty date when createdAt is missing', () => {
    const columns = buildProductColumns()
    const dateCol = columns.find((c) => c.key === 'date')
    expect(dateCol.render({ ...product, createdAt: undefined })).toBe('')
  })

  it('always shows an "Đang bán" status badge', () => {
    const columns = buildProductColumns()
    const statusCol = columns.find((c) => c.key === 'status')
    render(<>{statusCol.render(product)}</>)
    expect(screen.getByText('Đang bán')).toBeInTheDocument()
  })
})

describe('buildOrderColumns', () => {
  const order = {
    id: 1,
    name: 'Giày sneaker unisex',
    imgPrimary: 'img.jpg',
    amount: 1,
    price: 572000,
    description: 'Đen, size 40',
    idorder: 100001,
    iduser: '2',
    address: 'Huế',
    payment: 'COD',
    status: 'Đang chuẩn bị hàng',
  }

  it('exposes one column per order field', () => {
    const columns = buildOrderColumns()
    const keys = columns.map((c) => c.key)
    expect(keys).toEqual([
      'id', 'name', 'amount', 'price', 'description', 'idorder', 'iduser', 'address', 'payment', 'status',
    ])
  })

  it('formats price as currency and renders name+image together', () => {
    const columns = buildOrderColumns()
    expect(columns.find((c) => c.key === 'price').render(order)).toBe(
      Intl.NumberFormat().format(572000)
    )
    const nameCol = columns.find((c) => c.key === 'name')
    render(<>{nameCol.render(order)}</>)
    expect(screen.getByText('Giày sneaker unisex')).toBeInTheDocument()
  })
})

describe('buildUserColumns', () => {
  const user = { id: 2, fullname: 'Nguyễn Văn A', phone: '912345678', email: 'a@b.com', username: 'a' }

  it('prefixes the phone number with a leading 0', () => {
    const columns = buildUserColumns({ onDelete: jest.fn() })
    expect(columns.find((c) => c.key === 'phone').render(user)).toBe('0912345678')
  })

  it('renders an empty phone when missing', () => {
    const columns = buildUserColumns({ onDelete: jest.fn() })
    expect(columns.find((c) => c.key === 'phone').render({ ...user, phone: '' })).toBe('')
  })

  it('does not include a password column', () => {
    const columns = buildUserColumns({ onDelete: jest.fn() })
    expect(columns.some((c) => c.key === 'password')).toBe(false)
  })

  it('the action column view link points at the user detail page', () => {
    const columns = buildUserColumns({ onDelete: jest.fn() })
    const actionCol = columns.find((c) => c.key === 'action')
    render(<MemoryRouter>{actionCol.render(user)}</MemoryRouter>)
    expect(screen.getByRole('link', { name: 'Xem' })).toHaveAttribute(
      'href',
      '/admin/list-user/user/2'
    )
  })

  it('the action column delete button calls onDelete with the row id', async () => {
    const onDelete = jest.fn()
    const columns = buildUserColumns({ onDelete })
    const actionCol = columns.find((c) => c.key === 'action')
    render(<MemoryRouter>{actionCol.render(user)}</MemoryRouter>)
    screen.getByText('Xóa').click()
    expect(onDelete).toHaveBeenCalledWith(2)
  })
})
