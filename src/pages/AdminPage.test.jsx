import React from 'react'
import { screen, waitFor } from '@testing-library/react'
import { renderWithRouter } from '../test-utils/renderWithRouter'
import { mockApiResponse } from '../test-utils/mockApiResponse'
import { getUsers, getProducts, getOrders } from '../common/api'
import AdminPage from './AdminPage'

jest.mock('../common/api')

describe('AdminPage', () => {
  beforeEach(() => {
    sessionStorage.clear()
    jest.clearAllMocks()
    getUsers.mockReturnValue(mockApiResponse([]))
    getProducts.mockReturnValue(mockApiResponse([]))
    getOrders.mockReturnValue(mockApiResponse([]))
  })

  it('renders nothing (and redirects) when there is no admin session', async () => {
    const { container } = renderWithRouter(<AdminPage />)
    await waitFor(() => expect(container).toBeEmptyDOMElement())
  })

  it('renders the dashboard when an admin session exists', async () => {
    sessionStorage.setItem('idAdmin', '1')
    renderWithRouter(<AdminPage />)
    await screen.findByText('Top 10 bán chạy')
  })
})
