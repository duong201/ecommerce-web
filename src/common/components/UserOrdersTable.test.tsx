import React from 'react'
import { screen, waitFor } from '@testing-library/react'
import { renderWithRouter } from '../../test-utils/renderWithRouter'
import { mockApiResponse } from '../../test-utils/mockApiResponse'
import { buildOrder } from '../../test-utils/fixtures'
import { getOrders } from '../api'
import UserOrdersTable from './UserOrdersTable'

jest.mock('../api')

const orders = [
  buildOrder({
    id: 1,
    iduser: '2',
    idorder: 100001,
    name: 'Giày sneaker unisex',
    amount: 1,
    price: 572000,
  }),
  buildOrder({
    id: 2,
    iduser: '3',
    idorder: 100002,
    name: 'Áo thun nữ basic',
    amount: 2,
    price: 270000,
  }),
]

describe('UserOrdersTable', () => {
  beforeEach(() => {
    jest.mocked(getOrders).mockReturnValue(mockApiResponse(orders))
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders only the orders belonging to the given userId', async () => {
    renderWithRouter(<UserOrdersTable userId="2" />)
    await screen.findByText('Giày sneaker unisex')
    expect(screen.queryByText('Áo thun nữ basic')).not.toBeInTheDocument()
  })

  it('compares iduser loosely (string vs number) so route params still match', async () => {
    renderWithRouter(<UserOrdersTable userId={3} />)
    await screen.findByText('Áo thun nữ basic')
  })

  it('renders no rows for a user with no orders', async () => {
    renderWithRouter(<UserOrdersTable userId="999" />)
    await waitFor(() => expect(getOrders).toHaveBeenCalled())
    expect(screen.queryByText('Giày sneaker unisex')).not.toBeInTheDocument()
    expect(screen.queryByText('Áo thun nữ basic')).not.toBeInTheDocument()
  })
})
