import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import OrderSuccess from './OrderSuccess'

describe('OrderSuccess', () => {
  afterEach(() => {
    sessionStorage.clear()
  })

  it('shows a generic success message with no state', () => {
    render(
      <MemoryRouter initialEntries={['/order-success']}>
        <OrderSuccess />
      </MemoryRouter>,
    )
    expect(screen.getByText('Đặt hàng thành công!')).toBeInTheDocument()
  })

  it('shows the order count and total when passed via navigation state', () => {
    render(
      <MemoryRouter
        initialEntries={[{ pathname: '/order-success', state: { orderCount: 2, total: 300000 } }]}
      >
        <OrderSuccess />
      </MemoryRouter>,
    )
    expect(screen.getByText(/Đơn hàng gồm 2 sản phẩm/)).toBeInTheDocument()
  })

  it("links to the user's orders page only when logged in", () => {
    sessionStorage.setItem('id', '2')
    render(
      <MemoryRouter initialEntries={['/order-success']}>
        <OrderSuccess />
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: 'Xem đơn hàng của tôi' })).toHaveAttribute(
      'href',
      '/user/info/2',
    )
  })
})
