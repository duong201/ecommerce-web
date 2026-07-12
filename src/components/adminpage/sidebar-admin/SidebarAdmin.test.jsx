import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route } from 'react-router-dom'
import SidebarAdmin from './SidebarAdmin'

const renderSidebar = (props) =>
  render(
    <MemoryRouter initialEntries={['/admin']}>
      <Route path="/admin" exact><SidebarAdmin {...props} /></Route>
      <Route path="/user/login" exact><div>Login Page</div></Route>
    </MemoryRouter>
  )

describe('SidebarAdmin', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('renders links to every admin section', () => {
    renderSidebar()
    expect(screen.getByRole('link', { name: /Trang chủ/ })).toHaveAttribute('href', '/admin')
    expect(screen.getByRole('link', { name: /Người dùng/ })).toHaveAttribute('href', '/admin/list-user')
    expect(screen.getByRole('link', { name: /Sản phẩm/ })).toHaveAttribute('href', '/admin/list-product')
    expect(screen.getByRole('link', { name: /Đặt hàng/ })).toHaveAttribute('href', '/admin/list-order')
  })

  it('is closed by default', () => {
    const { container } = renderSidebar()
    expect(container.querySelector('.sidebar-admin')).not.toHaveClass('open')
  })

  it('applies the open class when isOpen is true', () => {
    const { container } = renderSidebar({ isOpen: true })
    expect(container.querySelector('.sidebar-admin')).toHaveClass('open')
  })

  it('logout clears the admin session and redirects to login', async () => {
    sessionStorage.setItem('idAdmin', '1')
    sessionStorage.setItem('adminName', 'admin')
    renderSidebar()

    await userEvent.click(screen.getByText('Đăng xuất'))

    expect(sessionStorage.getItem('idAdmin')).toBeNull()
    expect(sessionStorage.getItem('adminName')).toBeNull()
    expect(screen.getByText('Login Page')).toBeInTheDocument()
  })

  it('calls onNavigate when any nav item is clicked (used to auto-close on mobile)', async () => {
    const onNavigate = jest.fn()
    renderSidebar({ onNavigate })

    await userEvent.click(screen.getByRole('link', { name: /Người dùng/ }))

    expect(onNavigate).toHaveBeenCalledTimes(1)
  })
})
