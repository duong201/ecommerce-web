import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route } from 'react-router-dom'
import LoginUserForm from './LoginUserForm'
import { loginUser } from '../../../common/api'
import { mockApiResponse } from '../../../test-utils/mockApiResponse'
import { buildUser } from '../../../test-utils/fixtures'

jest.mock('../../../common/api')

const renderLoginForm = () =>
  render(
    <MemoryRouter initialEntries={['/user/login']}>
      <Route path="/user/login" exact>
        <LoginUserForm />
      </Route>
      <Route path="/admin" exact>
        <div>Admin Home</div>
      </Route>
      <Route path="/" exact>
        <div>Main Home</div>
      </Route>
    </MemoryRouter>,
  )

describe('LoginUserForm', () => {
  beforeEach(() => {
    sessionStorage.clear()
    jest.clearAllMocks()
  })

  it('logs a customer (level 1) in and redirects to the home page', async () => {
    jest.mocked(loginUser).mockReturnValue(
      mockApiResponse({
        status: 'success',
        message: 'Đăng nhập thành công',
        result: [buildUser({ id: 2, username: 'customer', level: 1 })],
      }),
    )

    renderLoginForm()
    await userEvent.type(screen.getByPlaceholderText('Tài khoản'), 'customer')
    await userEvent.type(screen.getByPlaceholderText('Mật khẩu'), 'customer123')
    await userEvent.click(screen.getByRole('button', { name: 'Đăng nhập' }))

    await screen.findByText('Main Home')
    expect(loginUser).toHaveBeenCalledWith(
      { username: 'customer', password: 'customer123' },
      { silentError: true },
    )
    expect(sessionStorage.getItem('id')).toBe('2')
    expect(sessionStorage.getItem('name')).toBe('customer')
  })

  it('logs an admin (level 0) in and redirects to /admin', async () => {
    jest.mocked(loginUser).mockReturnValue(
      mockApiResponse({
        status: 'success',
        message: 'Đăng nhập thành công',
        result: [buildUser({ id: 1, username: 'admin', level: 0 })],
      }),
    )

    renderLoginForm()
    await userEvent.type(screen.getByPlaceholderText('Tài khoản'), 'admin')
    await userEvent.type(screen.getByPlaceholderText('Mật khẩu'), 'admin123')
    await userEvent.click(screen.getByRole('button', { name: 'Đăng nhập' }))

    await screen.findByText('Admin Home')
    expect(sessionStorage.getItem('idAdmin')).toBe('1')
    expect(sessionStorage.getItem('adminName')).toBe('admin')
  })

  it('shows the error message and stays on the page for wrong credentials', async () => {
    jest.mocked(loginUser).mockReturnValue(
      mockApiResponse({
        status: 'error',
        message: 'Sai tài khoản hoặc mật khẩu',
        result: [],
      }),
    )

    renderLoginForm()
    await userEvent.type(screen.getByPlaceholderText('Tài khoản'), 'admin')
    await userEvent.type(screen.getByPlaceholderText('Mật khẩu'), 'wrong')
    await userEvent.click(screen.getByRole('button', { name: 'Đăng nhập' }))

    await screen.findByText('Sai tài khoản hoặc mật khẩu')
    expect(screen.getByText('Sai tài khoản hoặc mật khẩu')).toHaveClass('active')
    expect(sessionStorage.getItem('id')).toBeNull()
  })

  it('shows a generic error message when the request itself fails', async () => {
    jest.mocked(loginUser).mockReturnValue(Promise.reject(new Error('network down')))

    renderLoginForm()
    await userEvent.type(screen.getByPlaceholderText('Tài khoản'), 'admin')
    await userEvent.type(screen.getByPlaceholderText('Mật khẩu'), 'admin123')
    await userEvent.click(screen.getByRole('button', { name: 'Đăng nhập' }))

    await screen.findByText('Đã có lỗi xảy ra, vui lòng thử lại.')
  })

  it('has links to register and the home page', () => {
    renderLoginForm()
    expect(screen.getByRole('link', { name: 'tại đây.' })).toHaveAttribute('href', '/user/register')
    expect(screen.getByRole('link', { name: 'Quay về trang chủ' })).toHaveAttribute('href', '/')
  })
})
