import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Switch } from 'react-router-dom'
import { renderWithRouter } from '../../../test-utils/renderWithRouter'
import { mockApiResponse } from '../../../test-utils/mockApiResponse'
import { getCarts, getProducts } from '../../../common/api'
import Search from './Search'

jest.mock('../../../common/api')

const carts = [
  { id: 1, iduser: '2', idproduct: 1 },
  { id: 2, iduser: '2', idproduct: 2 },
  { id: 3, iduser: '9', idproduct: 3 },
]

const products = [
  { id: 1, name: 'Áo thun nữ basic' },
  { id: 2, name: 'Áo sơ mi nam công sở' },
]

describe('Search', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    sessionStorage.clear()
    getCarts.mockReturnValue(mockApiResponse(carts))
    getProducts.mockReturnValue(mockApiResponse(products))
  })

  it('shows the cart badge count for only the current user', async () => {
    sessionStorage.setItem('id', '2')
    renderWithRouter(<Search />)
    await waitFor(() => expect(screen.getByText('2')).toBeInTheDocument())
  })

  it('shows 0 when the user has no cart items', async () => {
    sessionStorage.setItem('id', '404')
    renderWithRouter(<Search />)
    await waitFor(() => expect(getCarts).toHaveBeenCalled())
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('links the logo home and the cart icon to /cart', async () => {
    renderWithRouter(<Search />)
    await waitFor(() => expect(getCarts).toHaveBeenCalled())
    expect(screen.getByRole('link', { name: 'Tipee' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: '0' })).toHaveAttribute('href', '/cart')
  })

  it('shows matching suggestions while typing', async () => {
    renderWithRouter(<Search />)
    const input = screen.getByPlaceholderText('Nhập để tìm kiếm')

    await userEvent.click(input)
    await userEvent.type(input, 'thun')

    expect(await screen.findByText('Áo thun nữ basic')).toBeInTheDocument()
    expect(screen.queryByText('Áo sơ mi nam công sở')).not.toBeInTheDocument()
  })

  it('submitting the search form navigates to /products?search=...', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Switch>
          <Route path="/products">
            <span>Products page</span>
          </Route>
          <Route path="/">
            <Search />
          </Route>
        </Switch>
      </MemoryRouter>
    )
    const input = screen.getByPlaceholderText('Nhập để tìm kiếm')

    await userEvent.type(input, 'áo')
    await userEvent.keyboard('{Enter}')

    expect(await screen.findByText('Products page')).toBeInTheDocument()
  })
})
