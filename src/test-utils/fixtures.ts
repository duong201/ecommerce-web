import type { Product, Order, User, CartItem, WishlistItem, Review, Category } from '../interface'

export const buildProduct = (overrides: Partial<Product> = {}): Product => ({
  id: 1,
  name: 'Product',
  imgPrimary: '',
  price: 0,
  discount: 0,
  sold: 0,
  amount: 0,
  idcategorize: 1,
  ...overrides,
})

export const buildOrder = (overrides: Partial<Order> = {}): Order => ({
  id: 1,
  idorder: 1,
  iduser: '1',
  name: 'Order item',
  imgPrimary: '',
  price: 0,
  description: '',
  status: '',
  address: '',
  payment: '',
  amount: 1,
  discountAmount: 0,
  ...overrides,
})

export const buildUser = (overrides: Partial<User> = {}): User => ({
  id: 1,
  fullname: 'User',
  phone: '',
  email: '',
  address: '',
  username: '',
  password: '',
  country: '',
  level: 1,
  ...overrides,
})

export const buildCartItem = (overrides: Partial<CartItem> = {}): CartItem => ({
  id: 1,
  iduser: '1',
  idproduct: 1,
  name: 'Cart item',
  imgPrimary: '',
  price: 0,
  discount: 0,
  amount: 1,
  ...overrides,
})

export const buildWishlistItem = (overrides: Partial<WishlistItem> = {}): WishlistItem => ({
  id: 1,
  iduser: '1',
  idproduct: 1,
  name: 'Wishlist item',
  imgPrimary: '',
  price: 0,
  discount: 0,
  ...overrides,
})

export const buildReview = (overrides: Partial<Review> = {}): Review => ({
  id: 1,
  idproduct: 1,
  iduser: '1',
  userName: 'Khách hàng',
  rating: 5,
  createdAt: new Date().toISOString(),
  ...overrides,
})

export const buildCategory = (overrides: Partial<Category> = {}): Category => ({
  id: 1,
  categorize: 'Category',
  ...overrides,
})
