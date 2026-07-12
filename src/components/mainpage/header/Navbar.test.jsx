import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route } from 'react-router-dom'
import Navbar from './Navbar'

const renderNavbar = (route = '/') =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <Route path="/" exact><Navbar /></Route>
      <Route path="/user/login" exact><div>Login Page</div></Route>
    </MemoryRouter>
  )

describe('Navbar', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('shows a login link when no user is logged in', () => {
    renderNavbar()
    expect(screen.getByRole('link', { name: 'Đăng nhập' })).toHaveAttribute('href', '/user/login')
  })

  it('shows the username and account menu when logged in', () => {
    sessionStorage.setItem('id', '2')
    sessionStorage.setItem('name', 'customer')
    renderNavbar()
    expect(screen.getByText('customer')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Xem thông tin' })).toHaveAttribute('href', '/user/info/2')
  })

  it('logout clears the user session and redirects to login', async () => {
    sessionStorage.setItem('id', '2')
    sessionStorage.setItem('name', 'customer')
    renderNavbar()

    await userEvent.click(screen.getByText('Đăng xuất'))

    expect(sessionStorage.getItem('id')).toBeNull()
    expect(sessionStorage.getItem('name')).toBeNull()
    expect(screen.getByText('Login Page')).toBeInTheDocument()
  })
})
