import React from 'react'
import { screen, waitFor } from '@testing-library/react'
import { renderPage, signOut } from '../testUtils'

import HomePage from '../pages/MainPages'
import Catalogue from '../components/mainpage/catalogue/Catalogue'
import Cart from '../components/mainpage/cart/Cart'
import Checkout from '../components/mainpage/checkout/Checkout'
import MyOrders from '../components/mainpage/orders/MyOrders'
import UserInfo from '../components/mainpage/header/UserInfo'
import LoginUserForm from '../components/mainpage/loginUser/LoginUserForm'
import RegisterUser from '../components/mainpage/loginUser/RegisterUser'
import Header from '../components/mainpage/header/Header'
import Footer from '../components/mainpage/footer/Footer'

// Every service falls back to the bundled mock dataset when the API is not
// reachable, which is what makes these render against real data shapes.
jest.setTimeout(20_000)

beforeEach(() => signOut())

describe('storefront pages render', () => {
  it('renders the landing page with its three bands', async () => {
    renderPage(<HomePage />)

    expect(await screen.findByRole('navigation', { name: /fruit categories/i })).toBeInTheDocument()
    expect(screen.getByText(/marked down before it goes/i)).toBeInTheDocument()
    expect(screen.getByText(/picked for you/i)).toBeInTheDocument()
  })

  it('renders the catalogue with search, filters and a sort control', async () => {
    renderPage(<Catalogue />, '/san-pham')

    expect(await screen.findByRole('searchbox', { name: /search fruit/i })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: /sort results/i })).toBeInTheDocument()
    expect(screen.getByRole('complementary', { name: /search filters/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/in stock today/i)).toBeInTheDocument()
  })

  it('renders the cart', async () => {
    renderPage(<Cart />, '/gio-hang')
    // Either populated lines or the empty state is a successful render; both
    // land on a heading that starts with 'Your cart'.
    expect(await screen.findByText(/your cart/i)).toBeInTheDocument()
  })

  it('renders checkout', async () => {
    renderPage(<Checkout />, '/thanh-toan')
    await waitFor(() =>
      expect(
        screen.queryByText(/checkout/i) ?? screen.queryByText(/nothing to check out/i),
      ).toBeInTheDocument(),
    )
  })

  it('asks anonymous visitors to sign in before showing orders', async () => {
    renderPage(<MyOrders />, '/don-hang')
    expect(await screen.findByText(/sign in to see your orders/i)).toBeInTheDocument()
  })

  it('asks anonymous visitors to sign in before showing the account', async () => {
    renderPage(<UserInfo />, '/tai-khoan')
    expect(await screen.findByText(/sign in to see your account/i)).toBeInTheDocument()
  })

  it('renders the sign-in form', () => {
    renderPage(<LoginUserForm />, '/dang-nhap')
    expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/email or phone number/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument()
  })

  it('renders the registration form', () => {
    renderPage(<RegisterUser />, '/dang-ky')
    expect(screen.getByRole('heading', { name: /create your account/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
  })

  it('renders the header with a link to search and the cart count', async () => {
    renderPage(<Header />)
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /search fruit/i })).toHaveAttribute('href', '/tim-kiem')
    expect(await screen.findByTestId('cart-count')).toBeInTheDocument()
  })

  it('renders the footer promises', () => {
    renderPage(<Footer />)
    // 'Freshness guarantee' appears twice - as a promise and as a help link.
    expect(screen.getAllByText(/same-day delivery/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/freshness guarantee/i).length).toBeGreaterThan(0)
  })
})
