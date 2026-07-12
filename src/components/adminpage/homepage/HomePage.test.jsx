import React from 'react'
import { screen, waitFor } from '@testing-library/react'
import { renderWithRouter } from '../../../test-utils/renderWithRouter'
import { mockApiResponse } from '../../../test-utils/mockApiResponse'
import { getUsers, getProducts, getOrders } from '../../../common/api'
import HomePage from './HomePage'

jest.mock('../../../common/api')

describe('HomePage (admin dashboard)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    getUsers.mockReturnValue(mockApiResponse([{ id: 1 }]))
    getProducts.mockReturnValue(mockApiResponse([
      { id: 1, name: 'Áo thun nữ basic', sold: 320, price: 150000, discount: 10, amount: 80 },
      { id: 2, name: 'Giày sneaker unisex', sold: 410, price: 650000, discount: 12, amount: 25 },
    ]))
    getOrders.mockReturnValue(mockApiResponse([]))
  })

  it('renders all four widgets and the top-selling products table', async () => {
    renderWithRouter(<HomePage />)

    expect(screen.getByText('users')).toBeInTheDocument()
    expect(screen.getByText('products')).toBeInTheDocument()
    expect(screen.getByText('orders')).toBeInTheDocument()
    expect(screen.getByText('My balance')).toBeInTheDocument()

    await waitFor(() => expect(screen.getByText('Giày sneaker unisex')).toBeInTheDocument())
    expect(screen.getByText('Áo thun nữ basic')).toBeInTheDocument()
  })

  it('sorts the top-selling table by sold descending', async () => {
    renderWithRouter(<HomePage />)
    await waitFor(() => expect(screen.getByText('Giày sneaker unisex')).toBeInTheDocument())

    const rows = screen.getAllByRole('row').slice(1) // skip header row
    expect(rows[0]).toHaveTextContent('Giày sneaker unisex')
    expect(rows[1]).toHaveTextContent('Áo thun nữ basic')
  })
})
