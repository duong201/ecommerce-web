import React from 'react'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithRouter } from '../../../test-utils/renderWithRouter'
import { mockApiResponse } from '../../../test-utils/mockApiResponse'
import { buildUser } from '../../../test-utils/fixtures'
import { getUsers, deleteUser } from '../../../common/api'
import ListUser from './ListUser'

jest.mock('../../../common/api')

const users = [
  buildUser({
    id: 1,
    fullname: 'Trương Thế Dương',
    username: 'admin',
    phone: '385572171',
    email: 'admin@tipee.vn',
  }),
  buildUser({
    id: 2,
    fullname: 'Nguyễn Văn A',
    username: 'customer',
    phone: '912345678',
    email: 'customer@tipee.vn',
  }),
]

describe('ListUser', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.mocked(getUsers).mockReturnValue(mockApiResponse(users))
  })

  it('renders a row per user', async () => {
    renderWithRouter(<ListUser />)
    await screen.findByText('Trương Thế Dương')
    expect(screen.getByText('Nguyễn Văn A')).toBeInTheDocument()
  })

  it('never renders a password column', async () => {
    renderWithRouter(<ListUser />)
    await screen.findByText('Trương Thế Dương')
    expect(screen.queryByText('Password')).not.toBeInTheDocument()
  })

  it('deleting a user calls the API and removes the row optimistically', async () => {
    jest.mocked(deleteUser).mockReturnValue(mockApiResponse({ status: 'success' }))
    renderWithRouter(<ListUser />)
    await screen.findByText('Nguyễn Văn A')

    await userEvent.click(screen.getAllByText('Xóa')[1])

    await waitFor(() => expect(deleteUser).toHaveBeenCalledWith(2))
    await waitFor(() => expect(screen.queryByText('Nguyễn Văn A')).not.toBeInTheDocument())
    expect(screen.getByText('Trương Thế Dương')).toBeInTheDocument()
  })

  it('keeps the row when the delete request fails', async () => {
    jest.mocked(deleteUser).mockReturnValue(mockApiResponse({ status: 'error' }))
    renderWithRouter(<ListUser />)
    await screen.findByText('Nguyễn Văn A')

    await userEvent.click(screen.getAllByText('Xóa')[1])

    await waitFor(() => expect(deleteUser).toHaveBeenCalled())
    expect(screen.getByText('Nguyễn Văn A')).toBeInTheDocument()
  })
})
