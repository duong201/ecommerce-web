import React from 'react'
import { render, screen } from '@testing-library/react'
import App from './App'
import * as mockedApi from './common/api'

jest.mock('./common/api', () => ({
  getProducts: jest.fn(),
  getCategories: jest.fn(),
  getCarts: jest.fn(),
  getOrders: jest.fn(),
  getUsers: jest.fn(),
  getUser: jest.fn(),
  getProduct: jest.fn(),
  loginUser: jest.fn(),
  registerUser: jest.fn(),
  addToCart: jest.fn(),
  updateCartAmount: jest.fn(),
  changeCartAmount: jest.fn(),
  deleteCartItem: jest.fn(),
  clearUserCart: jest.fn(),
  addOrder: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
  createProduct: jest.fn(),
  updateProduct: jest.fn(),
  deleteProduct: jest.fn(),
  getProductReviews: jest.fn(),
  addReview: jest.fn(),
  deleteReview: jest.fn(),
  getUserWishlist: jest.fn(),
  addToWishlist: jest.fn(),
  removeFromWishlist: jest.fn(),
  getCoupons: jest.fn(),
  applyCoupon: jest.fn(),
}))

const navigateTo = (path) => {
  window.history.pushState({}, '', path)
}

describe('App routing', () => {
  beforeEach(() => {
    sessionStorage.clear()
    // CRA's default jest config sets resetMocks:true, which strips any
    // implementation before every test — so the resolved values must be
    // (re)established here rather than once in the jest.mock factory above.
    mockedApi.getProducts.mockReturnValue(Promise.resolve({ data: [] }))
    mockedApi.getCategories.mockReturnValue(Promise.resolve({ data: [] }))
    mockedApi.getCarts.mockReturnValue(Promise.resolve({ data: [] }))
    mockedApi.getOrders.mockReturnValue(Promise.resolve({ data: [] }))
    mockedApi.getUsers.mockReturnValue(Promise.resolve({ data: [] }))
    mockedApi.getUser.mockReturnValue(Promise.resolve({ data: {} }))
    mockedApi.getProduct.mockReturnValue(Promise.resolve({ data: {} }))
    mockedApi.getProductReviews.mockReturnValue(Promise.resolve({ data: [] }))
    mockedApi.getUserWishlist.mockReturnValue(Promise.resolve({ data: [] }))
  })

  it('renders the home page at /', async () => {
    navigateTo('/')
    render(<App />)
    await screen.findByText('Flash Deals')
  })

  it('renders the cart page at /cart', async () => {
    navigateTo('/cart')
    render(<App />)
    await screen.findByText('Giỏ hàng trống')
  })

  it('renders the products page at /products', async () => {
    navigateTo('/products')
    render(<App />)
    await screen.findByText('Tất cả danh mục')
  })

  it('renders the product detail page at /product-detail/:id', async () => {
    navigateTo('/product-detail/1')
    render(<App />)
    await screen.findByText('Thêm vào giỏ hàng')
  })

  it('renders the login page at /user/login', () => {
    navigateTo('/user/login')
    render(<App />)
    expect(screen.getByRole('button', { name: 'Đăng nhập' })).toBeInTheDocument()
  })

  it('renders the register page at /user/register', () => {
    navigateTo('/user/register')
    render(<App />)
    expect(screen.getByRole('button', { name: 'Đăng ký' })).toBeInTheDocument()
  })

  it('redirects /admin to login when no admin session exists', async () => {
    navigateTo('/admin')
    render(<App />)
    await screen.findByRole('button', { name: 'Đăng nhập' })
  })

  it('renders the admin dashboard at /admin when logged in as admin', async () => {
    sessionStorage.setItem('idAdmin', '1')
    navigateTo('/admin')
    render(<App />)
    await screen.findByText('Top 10 bán chạy')
  })

  it('renders the admin user list at /admin/list-user', async () => {
    navigateTo('/admin/list-user')
    render(<App />)
    await screen.findByText('Danh sách User')
  })

  it('renders the admin product list at /admin/list-product', async () => {
    navigateTo('/admin/list-product')
    render(<App />)
    await screen.findByText('Danh sách Product')
  })

  it('renders the admin order list at /admin/list-order', async () => {
    navigateTo('/admin/list-order')
    render(<App />)
    await screen.findByText('Danh sách Order')
  })
})
