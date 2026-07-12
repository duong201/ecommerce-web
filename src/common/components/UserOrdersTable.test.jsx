import React from 'react'
import { screen, waitFor } from '@testing-library/react'
import { renderWithRouter } from '../../test-utils/renderWithRouter'
import { mockApiResponse } from '../../test-utils/mockApiResponse'
import { getOrders } from '../api'
import UserOrdersTable from './UserOrdersTable'

jest.mock('../api')

const orders = [
  { id: 1, iduser: '2', idorder: 100001, name: 'Giày sneaker unisex', amount: 1, price: 572000 },
  { id: 2, iduser: '3', idorder: 100002, name: 'Áo thun nữ basic', amount: 2, price: 270000 },
]

describe('UserOrdersTable', () => {
  beforeEach(() => {
    getOrders.mockReturnValue(mockApiResponse(orders))
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders only the orders belonging to the given userId', async () => {
    renderWithRouter(<UserOrdersTable userId="2" />)
    await waitFor(() => expect(screen.getByText('Giày sneaker unisex')).toBeInTheDocument())
    expect(screen.queryByText('Áo thun nữ basic')).not.toBeInTheDocument()
  })

  it('compares iduser loosely (string vs number) so route params still match', async () => {
    renderWithRouter(<UserOrdersTable userId={3} />)
    await waitFor(() => expect(screen.getByText('Áo thun nữ basic')).toBeInTheDocument())
  })

  it('renders no rows for a user with no orders', async () => {
    renderWithRouter(<UserOrdersTable userId="999" />)
    await waitFor(() => expect(getOrders).toHaveBeenCalled())
    expect(screen.queryByText('Giày sneaker unisex')).not.toBeInTheDocument()
    expect(screen.queryByText('Áo thun nữ basic')).not.toBeInTheDocument()
  })
})
