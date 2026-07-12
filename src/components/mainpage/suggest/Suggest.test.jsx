import React from 'react'
import { screen, waitFor } from '@testing-library/react'
import { renderWithRouter } from '../../../test-utils/renderWithRouter'
import { mockApiResponse } from '../../../test-utils/mockApiResponse'
import { getProducts } from '../../../common/api'
import Suggest from './Suggest'

jest.mock('../../../common/api')

describe('Suggest', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders a card for every fetched product', async () => {
    getProducts.mockReturnValue(
      mockApiResponse([
        { id: 1, name: 'Áo thun nữ basic', price: 150000, discount: 10, sold: 320 },
        { id: 2, name: 'Giày sneaker unisex', price: 650000, discount: 12, sold: 410 },
      ]),
    )

    renderWithRouter(<Suggest />)

    await screen.findByText('Áo thun nữ basic')
    expect(screen.getByText('Giày sneaker unisex')).toBeInTheDocument()
  })

  it('renders no cards when there are no products', async () => {
    getProducts.mockReturnValue(mockApiResponse([]))
    renderWithRouter(<Suggest />)
    await waitFor(() => expect(getProducts).toHaveBeenCalled())
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })
})
