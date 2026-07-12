import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Switch } from 'react-router-dom'
import { renderWithRouter } from '../../../test-utils/renderWithRouter'
import { mockApiResponse } from '../../../test-utils/mockApiResponse'
import { getCarts, getUser, addOrder, clearUserCart, applyCoupon } from '../../../common/api'
import Checkout from './Checkout'

jest.mock('../../../common/api')

const carts = [
  {
    id: 1,
    iduser: '2',
    idproduct: 1,
    name: 'Áo thun nữ basic',
    imgPrimary: 'img1.jpg',
    price: 150000,
    discount: 10,
    amount: 2,
    color: 'Đen',
    size: '28',
  },
]

const user = { id: 2, fullname: 'Nguyễn Văn A', phone: '912345678', address: '45 Trần Phú, Huế' }

describe('Checkout', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    sessionStorage.setItem('id', '2')
    getCarts.mockReturnValue(mockApiResponse(carts))
    getUser.mockReturnValue(mockApiResponse(user))
  })

  afterEach(() => {
    sessionStorage.clear()
  })

  it('shows an empty-cart message when there is nothing to check out', async () => {
    getCarts.mockReturnValue(mockApiResponse([]))
    renderWithRouter(<Checkout />)
    await screen.findByText('Giỏ hàng trống')
  })

  it('prefills the address and phone from the user profile', async () => {
    renderWithRouter(<Checkout />)
    await screen.findByText('Áo thun nữ basic')
    await screen.findByDisplayValue('45 Trần Phú, Huế')
    expect(screen.getByDisplayValue('912345678')).toBeInTheDocument()
  })

  it('shows a validation error when placing an order without an address', async () => {
    renderWithRouter(<Checkout />)
    await screen.findByText('Áo thun nữ basic')

    const addressInput = screen.getByPlaceholderText(/Số nhà, đường/)
    await userEvent.clear(addressInput)

    await userEvent.click(screen.getByRole('button', { name: 'Đặt hàng' }))

    expect(screen.getByText('Vui lòng nhập địa chỉ giao hàng')).toBeInTheDocument()
    expect(addOrder).not.toHaveBeenCalled()
  })

  it('applies a coupon and reduces the total', async () => {
    applyCoupon.mockReturnValue(
      mockApiResponse({ status: 'success', coupon: { code: 'GIAM10' }, discount: 27000 }),
    )
    renderWithRouter(<Checkout />)
    await screen.findByText('Áo thun nữ basic')

    await userEvent.type(screen.getByPlaceholderText('Nhập mã giảm giá'), 'GIAM10')
    await userEvent.click(screen.getByRole('button', { name: 'Áp dụng' }))

    await screen.findByText(/Đã áp dụng mã/)
    // subtotal 270000 - discount 27000 = 243000
    expect(screen.getByText(`${Intl.NumberFormat().format(243000)} đ`)).toBeInTheDocument()
  })

  it('shows an error message for an invalid coupon', async () => {
    const rejection = Promise.reject({
      response: { data: { message: 'Mã giảm giá không hợp lệ' } },
    })
    rejection.catch(() => {})
    applyCoupon.mockReturnValue(rejection)
    renderWithRouter(<Checkout />)
    await screen.findByText('Áo thun nữ basic')

    await userEvent.type(screen.getByPlaceholderText('Nhập mã giảm giá'), 'NOPE')
    await userEvent.click(screen.getByRole('button', { name: 'Áp dụng' }))

    await screen.findByText('Mã giảm giá không hợp lệ')
  })

  it('places one order per cart item, clears the cart, then redirects to the success page', async () => {
    addOrder.mockReturnValue(mockApiResponse({ status: 'success', order: {} }))
    clearUserCart.mockReturnValue(mockApiResponse({ status: 'success' }))

    render(
      <MemoryRouter initialEntries={['/checkout']}>
        <Switch>
          <Route path="/order-success">
            <span>Order success page</span>
          </Route>
          <Route path="/checkout">
            <Checkout />
          </Route>
        </Switch>
      </MemoryRouter>,
    )

    await screen.findByText('Áo thun nữ basic')
    await screen.findByDisplayValue('45 Trần Phú, Huế')
    await userEvent.click(screen.getByRole('button', { name: 'Đặt hàng' }))

    await waitFor(() => expect(addOrder).toHaveBeenCalledTimes(1))
    expect(addOrder).toHaveBeenCalledWith(
      expect.objectContaining({
        iduser: '2',
        name: 'Áo thun nữ basic',
        amount: 2,
        description: 'Đen, size 28',
      }),
      { silentError: true },
    )
    await waitFor(() => expect(clearUserCart).toHaveBeenCalledWith('2'))
    expect(await screen.findByText('Order success page')).toBeInTheDocument()
  })
})
