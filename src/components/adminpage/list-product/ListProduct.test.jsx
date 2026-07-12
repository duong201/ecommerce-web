import React from 'react'
import { screen } from '@testing-library/react'
import { renderWithRouter } from '../../../test-utils/renderWithRouter'
import { mockApiResponse } from '../../../test-utils/mockApiResponse'
import { getProducts } from '../../../common/api'
import ListProduct from './ListProduct'

jest.mock('../../../common/api')

describe('ListProduct', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    getProducts.mockReturnValue(
      mockApiResponse([
        { id: 1, name: 'Áo thun nữ basic', price: 150000, discount: 10, sold: 320, amount: 80 },
      ]),
    )
  })

  it('renders the page title and the admin layout chrome', async () => {
    renderWithRouter(<ListProduct />)
    expect(screen.getByText('Danh sách Product')).toBeInTheDocument()
    expect(screen.getByText('Tipee')).toBeInTheDocument()
  })

  it('renders a row per product', async () => {
    renderWithRouter(<ListProduct />)
    await screen.findByText('Áo thun nữ basic')
  })
})
