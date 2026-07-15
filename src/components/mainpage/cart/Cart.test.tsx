import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Switch } from 'react-router-dom'
import { renderWithRouter } from '../../../test-utils/renderWithRouter'
import { mockApiResponse } from '../../../test-utils/mockApiResponse'
import { getCarts, deleteCartItem, changeCartAmount, getProducts } from '../../../common/api'
import Cart from './Cart'

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
  },
  {
    id: 2,
    iduser: '9',
    idproduct: 5,
    name: 'Not mine',
    imgPrimary: 'img2.jpg',
    price: 500000,
    discount: 0,
    amount: 1,
  },
]

describe('Cart', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    sessionStorage.setItem('id', '2')
    jest.mocked(getCarts).mockReturnValue(mockApiResponse(carts))
    jest.mocked(getProducts).mockReturnValue(mockApiResponse([]))
  })

  afterEach(() => {
    sessionStorage.clear()
  })

  it('only shows cart items belonging to the logged-in user', async () => {
    renderWithRouter(<Cart />)
    await screen.findByText('Áo thun nữ basic')
    expect(screen.queryByText('Not mine')).not.toBeInTheDocument()
  })

  it('shows an empty-cart message when the user has no items', async () => {
    sessionStorage.setItem('id', '404')
    renderWithRouter(<Cart />)
    await screen.findByText('Giỏ hàng trống')
  })

  it('computes the discounted line total and grand total', async () => {
    renderWithRouter(<Cart />)
    await screen.findByText('Áo thun nữ basic')
    // 150000 * 0.9 * 2 = 270000
    expect(screen.getByText(Intl.NumberFormat().format(270000))).toBeInTheDocument()
  })

  it('increments the amount and calls the API with the new absolute amount', async () => {
    jest.mocked(changeCartAmount).mockReturnValue(mockApiResponse({ status: 'success' }))
    renderWithRouter(<Cart />)
    await screen.findByText('Áo thun nữ basic')

    await userEvent.click(screen.getByRole('button', { name: 'Tăng số lượng' }))

    await waitFor(() => expect(changeCartAmount).toHaveBeenCalledWith({ id: 1, amount: 3 }))
  })

  it('does not let amount drop below 1', async () => {
    jest.mocked(getCarts).mockReturnValue(mockApiResponse([{ ...carts[0], amount: 1 }]))
    renderWithRouter(<Cart />)
    await screen.findByText('Áo thun nữ basic')

    await userEvent.click(screen.getByRole('button', { name: 'Giảm số lượng' }))

    expect(changeCartAmount).not.toHaveBeenCalled()
  })

  it('removes an item and calls deleteCartItem', async () => {
    jest.mocked(deleteCartItem).mockReturnValue(mockApiResponse({ status: 'success' }))
    renderWithRouter(<Cart />)
    await screen.findByText('Áo thun nữ basic')

    await userEvent.click(screen.getByRole('button', { name: 'Xóa' }))

    await waitFor(() => expect(deleteCartItem).toHaveBeenCalledWith(1))
  })

  it('navigates to /checkout instead of placing the order directly', async () => {
    render(
      <MemoryRouter initialEntries={['/cart']}>
        <Switch>
          <Route path="/checkout">
            <span>Checkout page</span>
          </Route>
          <Route path="/cart">
            <Cart />
          </Route>
        </Switch>
      </MemoryRouter>,
    )
    await screen.findByText('Áo thun nữ basic')

    await userEvent.click(screen.getByRole('button', { name: 'Thanh toán' }))

    expect(await screen.findByText('Checkout page')).toBeInTheDocument()
  })
})
