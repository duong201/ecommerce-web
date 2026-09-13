import React from 'react'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import { renderPage, signIn, signOut } from '../testUtils'

import AdminDashboard from '../components/adminpage/homepage/HomePage'
import AdminLayout from '../common/components/layout/AdminLayout'
import ListUser from '../components/adminpage/list-user/ListUser'
import ListProduct from '../components/adminpage/list-product/ListProduct'
import ListOrder from '../components/adminpage/list-order/ListOrder'
import InventoryPage from '../components/adminpage/inventory/InventoryPage'
import SuppliersPage from '../components/adminpage/suppliers/SuppliersPage'
import DeliverySlotsPage from '../components/adminpage/delivery/DeliverySlotsPage'
import CouponsPage from '../components/adminpage/coupons/CouponsPage'
import ReviewsPage from '../components/adminpage/reviews/ReviewsPage'

jest.setTimeout(20_000)

beforeEach(() => signIn(3))
afterEach(() => signOut())

describe('admin pages render', () => {
  it('renders the dashboard with its KPI row and both panels', async () => {
    renderPage(
      <AdminLayout>
        <AdminDashboard />
      </AdminLayout>,
      '/admin',
    )

    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument()
    await waitFor(() => expect(screen.getAllByTestId('widget')).toHaveLength(6))
    expect(screen.getByText(/batches to deal with today/i)).toBeInTheDocument()
    expect(screen.getByText(/top sellers this month/i)).toBeInTheDocument()
  })

  it.each([
    ['users', ListUser, /^users$/i],
    ['products', ListProduct, /^products$/i],
    ['orders', ListOrder, /^orders$/i],
    ['stock', InventoryPage, /stock & batches/i],
    ['suppliers', SuppliersPage, /^suppliers$/i],
    ['delivery slots', DeliverySlotsPage, /^delivery slots$/i],
    ['coupons', CouponsPage, /^coupons$/i],
    ['reviews', ReviewsPage, /^reviews$/i],
  ])('renders the %s page', async (_name, Page, heading) => {
    renderPage(<Page />, '/admin')
    expect(await screen.findByRole('heading', { name: heading, level: 1 })).toBeInTheDocument()
  })

  it('keeps the Users link out of the sidebar for a manager', async () => {
    signIn(2)
    renderPage(
      <AdminLayout>
        <div />
      </AdminLayout>,
      '/admin',
    )

    const sidebar = screen.getByTestId('sidebar-admin')
    expect(sidebar).toHaveTextContent(/orders/i)
    expect(sidebar).not.toHaveTextContent(/users/i)
  })

  it('opens and closes the mobile sidebar', () => {
    renderPage(
      <AdminLayout>
        <div />
      </AdminLayout>,
      '/admin',
    )

    expect(screen.queryByTestId('sidebar-backdrop')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /toggle the menu/i }))
    expect(screen.getByTestId('sidebar-backdrop')).toBeInTheDocument()

    fireEvent.click(screen.getByTestId('sidebar-backdrop'))
    expect(screen.queryByTestId('sidebar-backdrop')).not.toBeInTheDocument()
  })
})
