import React from 'react'
import { screen, waitFor } from '@testing-library/react'
import { renderWithRouter } from '../../../test-utils/renderWithRouter'
import { mockApiResponse } from '../../../test-utils/mockApiResponse'
import { getUser, getOrders } from '../../../common/api'
import UserInfo from './UserInfo'

jest.mock('../../../common/api')

describe('UserInfo', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    sessionStorage.clear()
    sessionStorage.setItem('id', '2')
    getUser.mockReturnValue(mockApiResponse({
      id: 2, country: 'VIE', fullname: 'Nguyễn Văn A', age: 22, phone: '912345678', email: 'a@b.com', address: 'Huế',
    }))
    getOrders.mockReturnValue(mockApiResponse([
      { id: 1, iduser: '2', name: 'Giày sneaker unisex', amount: 1, price: 572000 },
      { id: 2, iduser: '9', name: 'Not mine', amount: 1, price: 1000 },
    ]))
  })

  it('fetches the profile for the :id route param', async () => {
    renderWithRouter(<UserInfo />, { route: '/user/info/2', path: '/user/info/:id' })
    await waitFor(() => expect(screen.getByText('Nguyễn Văn A')).toBeInTheDocument())
    expect(getUser).toHaveBeenCalledWith('2')
  })

  it('shows only the logged-in user\'s orders, keyed off the session id (not the route id)', async () => {
    renderWithRouter(<UserInfo />, { route: '/user/info/2', path: '/user/info/:id' })
    await waitFor(() => expect(screen.getByText('Giày sneaker unisex')).toBeInTheDocument())
    expect(screen.queryByText('Not mine')).not.toBeInTheDocument()
  })
})
