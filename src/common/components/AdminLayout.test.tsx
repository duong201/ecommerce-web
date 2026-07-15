import React from 'react'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithRouter } from '../../test-utils/renderWithRouter'
import AdminLayout from './AdminLayout'

describe('AdminLayout', () => {
  it('renders its children alongside the admin header and sidebar', () => {
    renderWithRouter(
      <AdminLayout>
        <div>Page content</div>
      </AdminLayout>,
    )
    expect(screen.getByText('Page content')).toBeInTheDocument()
    expect(screen.getByText('Tipee')).toBeInTheDocument()
    expect(screen.getByText('Trang chủ')).toBeInTheDocument()
  })

  it('does not show the mobile sidebar backdrop initially', () => {
    renderWithRouter(
      <AdminLayout>
        <div>Page content</div>
      </AdminLayout>,
    )
    expect(screen.queryByTestId('sidebar-backdrop')).not.toBeInTheDocument()
  })

  it('toggling the hamburger button opens the sidebar and shows a backdrop', async () => {
    renderWithRouter(
      <AdminLayout>
        <div>Page content</div>
      </AdminLayout>,
    )

    await userEvent.click(screen.getByLabelText('Toggle menu'))

    expect(screen.getByTestId('sidebar-admin')).toHaveClass('open')
    expect(screen.getByTestId('sidebar-backdrop')).toBeInTheDocument()
  })

  it('clicking the backdrop closes the sidebar again', async () => {
    renderWithRouter(
      <AdminLayout>
        <div>Page content</div>
      </AdminLayout>,
    )

    await userEvent.click(screen.getByLabelText('Toggle menu'))
    await userEvent.click(screen.getByTestId('sidebar-backdrop'))

    expect(screen.getByTestId('sidebar-admin')).not.toHaveClass('open')
    expect(screen.queryByTestId('sidebar-backdrop')).not.toBeInTheDocument()
  })
})
