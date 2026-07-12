import React from 'react'
import { screen, waitFor } from '@testing-library/react'
import { renderWithRouter } from '../../../test-utils/renderWithRouter'
import { mockApiResponse } from '../../../test-utils/mockApiResponse'
import { getOrders } from '../../../common/api'
import ListOrder from './ListOrder'

jest.mock('../../../common/api')

describe('ListOrder', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    getOrders.mockReturnValue(mockApiResponse([
      { id: 1, iduser: '2', idorder: 100001, name: 'Giày sneaker unisex', amount: 1, price: 572000 },
    ]))
  })

  it('renders the page title and the admin layout chrome', () => {
    renderWithRouter(<ListOrder />)
    expect(screen.getByText('Danh sách Order')).toBeInTheDocument()
    expect(screen.getByText('Tipee')).toBeInTheDocument()
  })

  it('renders a row per order, unfiltered by user', async () => {
    renderWithRouter(<ListOrder />)
    await waitFor(() => expect(screen.getByText('Giày sneaker unisex')).toBeInTheDocument())
    expect(screen.getByText('100001')).toBeInTheDocument()
  })
})
