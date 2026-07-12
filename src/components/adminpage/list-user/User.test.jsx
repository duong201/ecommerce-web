import React from 'react'
import { screen, waitFor } from '@testing-library/react'
import { renderWithRouter } from '../../../test-utils/renderWithRouter'
import { mockApiResponse } from '../../../test-utils/mockApiResponse'
import { getUser, getOrders } from '../../../common/api'
import User from './User'

jest.mock('../../../common/api')

describe('User (admin user detail)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    getUser.mockReturnValue(mockApiResponse({
      id: 2, fullname: 'Nguyễn Văn A', country: 'VIE', phone: '912345678', email: 'a@b.com', address: 'Huế',
    }))
    getOrders.mockReturnValue(mockApiResponse([
      { id: 1, iduser: '2', name: 'Giày sneaker unisex', amount: 1, price: 572000 },
      { id: 2, iduser: '5', name: 'Not this user', amount: 1, price: 1000 },
    ]))
  })

  it('fetches the user by the :id route param and renders their profile', async () => {
    renderWithRouter(<User />, { route: '/admin/list-user/user/2', path: '/admin/list-user/user/:id' })
    await waitFor(() => expect(screen.getByText('Nguyễn Văn A')).toBeInTheDocument())
    expect(getUser).toHaveBeenCalledWith('2')
  })

  it('shows only that user\'s orders, not the whole catalog', async () => {
    renderWithRouter(<User />, { route: '/admin/list-user/user/2', path: '/admin/list-user/user/:id' })
    await waitFor(() => expect(screen.getByText('Giày sneaker unisex')).toBeInTheDocument())
    expect(screen.queryByText('Not this user')).not.toBeInTheDocument()
  })

  it('links Edit to the correct per-user edit route', async () => {
    renderWithRouter(<User />, { route: '/admin/list-user/user/2', path: '/admin/list-user/user/:id' })
    await waitFor(() => expect(screen.getByText('Nguyễn Văn A')).toBeInTheDocument())
    expect(screen.getByRole('link', { name: 'Edit' })).toHaveAttribute(
      'href',
      '/admin/list-user/user/2/edit'
    )
  })
})
