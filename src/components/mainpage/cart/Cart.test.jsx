import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Switch } from 'react-router-dom'
import { renderWithRouter } from '../../../test-utils/renderWithRouter'
import { mockApiResponse } from '../../../test-utils/mockApiResponse'
import {
  getCarts,
  deleteCartItem,
  changeCartAmount,
  getProducts,
} from '../../../common/api'
import Cart from './Cart'

jest.mock('../../../common/api')

const carts = [
  { id: 1, iduser: '2', idproduct: 1, name: 'Áo thun nữ basic', imgPrimary: 'img1.jpg', price: 150000, discount: 10, amount: 2 },
  { id: 2, iduser: '9', idproduct: 5, name: 'Not mine', imgPrimary: 'img2.jpg', price: 500000, discount: 0, amount: 1 },
]

describe('Cart', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    sessionStorage.setItem('id', '2')
    getCarts.mockReturnValue(mockApiResponse(carts))
    getProducts.mockReturnValue(mockApiResponse([]))
  })

  afterEach(() => {
    sessionStorage.clear()
  })

  it('only shows cart items belonging to the logged-in user', async () => {
    renderWithRouter(<Cart />)
    await waitFor(() => expect(screen.getByText('Áo thun nữ basic')).toBeInTheDocument())
    expect(screen.queryByText('Not mine')).not.toBeInTheDocument()
  })

  it('shows an empty-cart message when the user has no items', async () => {
    sessionStorage.setItem('id', '404')
    renderWithRouter(<Cart />)
    await waitFor(() => expect(screen.getByText('Giỏ hàng trống')).toBeInTheDocument())
  })

  it('computes the discounted line total and grand total', async () => {
    renderWithRouter(<Cart />)
    await waitFor(() => expect(screen.getByText('Áo thun nữ basic')).toBeInTheDocument())
    // 150000 * 0.9 * 2 = 270000
    expect(screen.getByText(Intl.NumberFormat().format(270000))).toBeInTheDocument()
  })

  it('increments the amount and calls the API with the new absolute amount', async () => {
    changeCartAmount.mockReturnValue(mockApiResponse({ status: 'success' }))
    renderWithRouter(<Cart />)
    await waitFor(() => expect(screen.getByText('Áo thun nữ basic')).toBeInTheDocument())

    await userEvent.click(screen.getAllByRole('button', { name: '' }).find((btn) =>
      btn.querySelector('.fa-plus')
    ))

    await waitFor(() =>
      expect(changeCartAmount).toHaveBeenCalledWith({ id: 1, amount: 3 })
    )
  })

  it('does not let amount drop below 1', async () => {
    getCarts.mockReturnValue(mockApiResponse([{ ...carts[0], amount: 1 }]))
    renderWithRouter(<Cart />)
    await waitFor(() => expect(screen.getByText('Áo thun nữ basic')).toBeInTheDocument())

    await userEvent.click(screen.getAllByRole('button', { name: '' }).find((btn) =>
      btn.querySelector('.fa-minus')
    ))

    expect(changeCartAmount).not.toHaveBeenCalled()
  })

  it('removes an item and calls deleteCartItem', async () => {
    deleteCartItem.mockReturnValue(mockApiResponse({ status: 'success' }))
    renderWithRouter(<Cart />)
    await waitFor(() => expect(screen.getByText('Áo thun nữ basic')).toBeInTheDocument())

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
      </MemoryRouter>
    )
    await waitFor(() => expect(screen.getByText('Áo thun nữ basic')).toBeInTheDocument())

    await userEvent.click(screen.getByRole('button', { name: 'Thanh toán' }))

    expect(await screen.findByText('Checkout page')).toBeInTheDocument()
  })
})
