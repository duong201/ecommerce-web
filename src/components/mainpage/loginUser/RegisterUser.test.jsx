import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route } from 'react-router-dom'
import RegisterUser from './RegisterUser'
import { registerUser } from '../../../common/api'
import { mockApiResponse } from '../../../test-utils/mockApiResponse'
import { USER_LEVEL } from '../../../common/constants'

jest.mock('../../../common/api')

const renderRegisterForm = () =>
  render(
    <MemoryRouter initialEntries={['/user/register']}>
      <Route path="/user/register" exact><RegisterUser /></Route>
      <Route path="/user/login" exact><div>Login Page</div></Route>
    </MemoryRouter>
  )

const fillForm = async () => {
  await userEvent.type(screen.getByPlaceholderText('Họ và tên'), 'Nguyễn Văn A')
  await userEvent.type(screen.getByPlaceholderText('Số điện thoại'), '912345678')
  await userEvent.type(screen.getByPlaceholderText('Email'), 'a@b.com')
  await userEvent.type(screen.getByPlaceholderText('Tên tài khoản'), 'newuser')
  await userEvent.type(screen.getByPlaceholderText('Mật khẩu'), 'password123')
}

describe('RegisterUser', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('registers a new customer-level account and redirects to login', async () => {
    registerUser.mockReturnValue(mockApiResponse({ status: 'success', id: 3 }))

    renderRegisterForm()
    await fillForm()
    await userEvent.click(screen.getByRole('button', { name: 'Đăng ký' }))

    await waitFor(() => expect(screen.getByText('Login Page')).toBeInTheDocument())
    expect(registerUser).toHaveBeenCalledWith({
      fullname: 'Nguyễn Văn A',
      phone: '912345678',
      email: 'a@b.com',
      username: 'newuser',
      password: 'password123',
      level: USER_LEVEL.CUSTOMER,
    })
  })

  it('shows the server error message when registration fails (e.g. duplicate username)', async () => {
    registerUser.mockReturnValue(
      mockApiResponse({ status: 'error', message: 'Username đã tồn tại' })
    )

    renderRegisterForm()
    await fillForm()
    await userEvent.click(screen.getByRole('button', { name: 'Đăng ký' }))

    await waitFor(() => expect(screen.getByText('Username đã tồn tại')).toBeInTheDocument())
  })

  it('shows a generic error message when the request itself fails', async () => {
    registerUser.mockReturnValue(Promise.reject(new Error('network down')))

    renderRegisterForm()
    await fillForm()
    await userEvent.click(screen.getByRole('button', { name: 'Đăng ký' }))

    await waitFor(() =>
      expect(screen.getByText('Đăng ký thất bại, vui lòng thử lại.')).toBeInTheDocument()
    )
  })

  it('links back to the login page', () => {
    renderRegisterForm()
    expect(screen.getByRole('link', { name: 'tại đây.' })).toHaveAttribute('href', '/user/login')
  })
})
