import React from 'react'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithRouter } from '../../../test-utils/renderWithRouter'
import { mockApiResponse } from '../../../test-utils/mockApiResponse'
import { getUser, updateUser } from '../../../common/api'
import EditingUser from './EditingUser'

jest.mock('../../../common/api')

const renderPage = () =>
  renderWithRouter(<EditingUser />, {
    route: '/admin/list-user/user/2/edit',
    path: '/admin/list-user/user/:id/edit',
  })

describe('EditingUser', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    getUser.mockReturnValue(
      mockApiResponse({
        fullname: 'Nguyễn Văn A',
        phone: '912345678',
        address: 'Huế',
        username: 'customer',
        email: 'a@b.com',
        country: 'VIE',
      }),
    )
  })

  it('pre-fills the form fields from the fetched user (the original bug: fields were never bound)', async () => {
    renderPage()
    await waitFor(() =>
      expect(screen.getByPlaceholderText('Họ và tên')).toHaveValue('Nguyễn Văn A'),
    )
    expect(screen.getByPlaceholderText('Số điện thoại')).toHaveValue('912345678')
    expect(screen.getByPlaceholderText('duong2010')).toHaveValue('customer')
    expect(screen.getByPlaceholderText('duong@gmail.com')).toHaveValue('a@b.com')
  })

  it('typing updates the corresponding field', async () => {
    renderPage()
    await waitFor(() =>
      expect(screen.getByPlaceholderText('Họ và tên')).toHaveValue('Nguyễn Văn A'),
    )

    const fullnameInput = screen.getByPlaceholderText('Họ và tên')
    await userEvent.clear(fullnameInput)
    await userEvent.type(fullnameInput, 'Tên mới')

    expect(fullnameInput).toHaveValue('Tên mới')
  })

  it('submitting calls updateUser with the current form state and navigates back (the original bug: no submit handler existed)', async () => {
    updateUser.mockReturnValue(mockApiResponse({ status: 'success' }))
    renderPage()
    await waitFor(() =>
      expect(screen.getByPlaceholderText('Họ và tên')).toHaveValue('Nguyễn Văn A'),
    )

    await userEvent.click(screen.getByRole('button', { name: 'Send' }))

    await waitFor(() =>
      expect(updateUser).toHaveBeenCalledWith(
        '2',
        expect.objectContaining({ fullname: 'Nguyễn Văn A' }),
        { silentError: true },
      ),
    )
  })
})
