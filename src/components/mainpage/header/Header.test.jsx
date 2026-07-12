import React from 'react'
import { screen, waitFor } from '@testing-library/react'
import { renderWithRouter } from '../../../test-utils/renderWithRouter'
import { mockApiResponse } from '../../../test-utils/mockApiResponse'
import { getCarts, getProducts } from '../../../common/api'
import Header from './Header'

jest.mock('../../../common/api')

describe('Header', () => {
  it('renders both the navbar and the search/cart bar', async () => {
    getCarts.mockReturnValue(mockApiResponse([]))
    getProducts.mockReturnValue(mockApiResponse([]))
    renderWithRouter(<Header />)
    expect(screen.getByRole('link', { name: 'Tipee' })).toBeInTheDocument()
    await waitFor(() => expect(getCarts).toHaveBeenCalled())
  })
})
