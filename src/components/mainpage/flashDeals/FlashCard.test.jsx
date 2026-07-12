import React from 'react'
import { screen, waitFor } from '@testing-library/react'
import { renderWithRouter } from '../../../test-utils/renderWithRouter'
import { mockApiResponse } from '../../../test-utils/mockApiResponse'
import { getProducts } from '../../../common/api'
import FlashCard from './FlashCard'

jest.mock('../../../common/api')

describe('FlashCard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the discount badge and prices for each fetched product', async () => {
    getProducts.mockReturnValue(
      mockApiResponse([
        { id: 1, name: 'Tai nghe bluetooth', price: 550000, discount: 25, sold: 530 },
      ]),
    )

    renderWithRouter(<FlashCard />)

    // react-slick clones slides for infinite scrolling, so each product can render more than once
    await waitFor(() => expect(screen.getAllByText('Tai nghe bluetooth').length).toBeGreaterThan(0))
    expect(screen.getAllByText('- 25 %').length).toBeGreaterThan(0)
    expect(screen.getAllByText(Intl.NumberFormat().format(550000)).length).toBeGreaterThan(0)
    expect(screen.getAllByText(Intl.NumberFormat().format(412500)).length).toBeGreaterThan(0)
  })
})
