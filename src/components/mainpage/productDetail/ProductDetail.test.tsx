import React from 'react'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithRouter } from '../../../test-utils/renderWithRouter'
import { mockApiResponse } from '../../../test-utils/mockApiResponse'
import {
  buildProduct,
  buildCartItem,
  buildWishlistItem,
  buildReview,
} from '../../../test-utils/fixtures'
import {
  getProduct,
  getProducts,
  getCarts,
  addToCart,
  updateCartAmount,
  getProductReviews,
  addReview,
  getUserWishlist,
  addToWishlist,
  removeFromWishlist,
} from '../../../common/api'
import ProductDetail from './ProductDetail'

jest.mock('../../../common/api')

const product = buildProduct({
  id: 2,
  name: 'Đầm suông nữ dạo phố',
  imgPrimary: 'img.jpg',
  productImage: 'img.jpg',
  price: 320000,
  discount: 15,
  sold: 210,
})

const renderPage = () =>
  renderWithRouter(<ProductDetail />, { route: '/product-detail/2', path: '/product-detail/:id' })

describe('ProductDetail', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    sessionStorage.clear()
    jest.mocked(getProduct).mockReturnValue(mockApiResponse(product))
    jest.mocked(getProducts).mockReturnValue(mockApiResponse([]))
    jest.mocked(getCarts).mockReturnValue(mockApiResponse([]))
    jest.mocked(getProductReviews).mockReturnValue(mockApiResponse([]))
    jest.mocked(getUserWishlist).mockReturnValue(mockApiResponse([]))
  })

  it('renders the product name, price and discount', async () => {
    renderPage()
    await screen.findByText('Đầm suông nữ dạo phố')
    expect(screen.getByText(Intl.NumberFormat().format(320000))).toBeInTheDocument()
    expect(screen.getByText('15% Giảm')).toBeInTheDocument()
  })

  it('fetches the product by the :id route param', async () => {
    renderPage()
    await waitFor(() => expect(getProduct).toHaveBeenCalledWith('2'))
  })

  it('shows the login prompt instead of adding to cart when logged out', async () => {
    renderPage()
    await screen.findByText('Đầm suông nữ dạo phố')

    await userEvent.click(screen.getByRole('button', { name: /Thêm vào giỏ hàng/ }))

    expect(screen.getByText('Bạn cần đăng nhập để thực hiện thao tác này.')).toHaveClass('active')
    expect(addToCart).not.toHaveBeenCalled()
  })

  it('adds a new cart row when the product is not already in the cart', async () => {
    sessionStorage.setItem('id', '2')
    jest
      .mocked(addToCart)
      .mockReturnValue(mockApiResponse({ status: 'success', cart: buildCartItem({ id: 9 }) }))

    renderPage()
    await screen.findByText('Đầm suông nữ dạo phố')

    await userEvent.click(screen.getByRole('button', { name: /Thêm vào giỏ hàng/ }))

    await waitFor(() =>
      expect(addToCart).toHaveBeenCalledWith(
        expect.objectContaining({ iduser: '2', idproduct: 2, amount: 1 }),
      ),
    )
  })

  it('increments the existing cart row instead of duplicating it', async () => {
    sessionStorage.setItem('id', '2')
    jest
      .mocked(getCarts)
      .mockReturnValue(
        mockApiResponse([
          buildCartItem({ id: 9, iduser: '2', idproduct: 2, amount: 1, color: 'Đen', size: '28' }),
        ]),
      )
    jest.mocked(updateCartAmount).mockReturnValue(mockApiResponse({ status: 'success' }))

    renderPage()
    await screen.findByText('Đầm suông nữ dạo phố')

    await userEvent.click(screen.getByRole('button', { name: /Thêm vào giỏ hàng/ }))

    await waitFor(() => expect(updateCartAmount).toHaveBeenCalledWith({ amount: 2, id: 9 }))
    expect(addToCart).not.toHaveBeenCalled()
  })

  it('only matches an existing cart row for the current user', async () => {
    sessionStorage.setItem('id', '2')
    jest
      .mocked(getCarts)
      .mockReturnValue(
        mockApiResponse([buildCartItem({ id: 9, iduser: '999', idproduct: 2, amount: 1 })]),
      )
    jest
      .mocked(addToCart)
      .mockReturnValue(mockApiResponse({ status: 'success', cart: buildCartItem() }))

    renderPage()
    await screen.findByText('Đầm suông nữ dạo phố')

    await userEvent.click(screen.getByRole('button', { name: /Thêm vào giỏ hàng/ }))

    await waitFor(() => expect(addToCart).toHaveBeenCalled())
    expect(updateCartAmount).not.toHaveBeenCalled()
  })

  it('includes the selected color and size when adding to the cart', async () => {
    sessionStorage.setItem('id', '2')
    jest
      .mocked(addToCart)
      .mockReturnValue(mockApiResponse({ status: 'success', cart: buildCartItem({ id: 9 }) }))

    renderPage()
    await screen.findByText('Đầm suông nữ dạo phố')

    await userEvent.click(screen.getByText('Trắng'))
    await userEvent.click(screen.getByText('29'))
    await userEvent.click(screen.getByRole('button', { name: /Thêm vào giỏ hàng/ }))

    await waitFor(() =>
      expect(addToCart).toHaveBeenCalledWith(
        expect.objectContaining({ color: 'Trắng', size: '29' }),
      ),
    )
  })

  it('toggles the product in and out of the wishlist', async () => {
    sessionStorage.setItem('id', '2')
    jest.mocked(addToWishlist).mockReturnValue(
      mockApiResponse({
        status: 'success',
        wishlistItem: buildWishlistItem({ id: 1, iduser: '2', idproduct: 2 }),
      }),
    )
    jest.mocked(removeFromWishlist).mockReturnValue(mockApiResponse({ status: 'success' }))

    renderPage()
    await screen.findByText('Đầm suông nữ dạo phố')

    const wishlistButton = screen.getByRole('button', { name: 'Yêu thích' })
    await userEvent.click(wishlistButton)
    await waitFor(() =>
      expect(addToWishlist).toHaveBeenCalledWith(
        expect.objectContaining({ iduser: '2', idproduct: 2 }),
      ),
    )
    await waitFor(() => expect(wishlistButton).toHaveClass('active'))

    await userEvent.click(wishlistButton)
    await waitFor(() => expect(removeFromWishlist).toHaveBeenCalledWith('2', 2))
  })

  it('shows the login prompt instead of toggling wishlist when logged out', async () => {
    renderPage()
    await screen.findByText('Đầm suông nữ dạo phố')

    await userEvent.click(screen.getByRole('button', { name: 'Yêu thích' }))

    expect(screen.getByText('Bạn cần đăng nhập để thực hiện thao tác này.')).toHaveClass('active')
    expect(addToWishlist).not.toHaveBeenCalled()
  })

  it('lists existing reviews and their average rating', async () => {
    jest.mocked(getProductReviews).mockReturnValue(
      mockApiResponse([
        buildReview({
          id: 1,
          idproduct: 2,
          iduser: '2',
          userName: 'Nguyễn Văn A',
          rating: 4,
          comment: 'Đẹp',
          createdAt: '2024-04-01T00:00:00.000Z',
        }),
        buildReview({
          id: 2,
          idproduct: 2,
          iduser: '3',
          userName: 'Trần Thị B',
          rating: 5,
          comment: 'Rất ưng',
          createdAt: '2024-04-02T00:00:00.000Z',
        }),
      ]),
    )

    renderPage()
    await screen.findByText('Đánh giá sản phẩm (2)')
    expect(screen.getByText('4.5')).toBeInTheDocument()
    expect(screen.getByText('Rất ưng')).toBeInTheDocument()
  })

  it('lets a logged-in user submit a review', async () => {
    sessionStorage.setItem('id', '2')
    sessionStorage.setItem('name', 'Nguyễn Văn A')
    jest.mocked(addReview).mockReturnValue(
      mockApiResponse({
        status: 'success',
        review: buildReview({
          id: 1,
          idproduct: 2,
          iduser: '2',
          userName: 'Nguyễn Văn A',
          rating: 5,
          comment: 'Tuyệt vời',
          createdAt: '2024-04-03T00:00:00.000Z',
        }),
      }),
    )

    renderPage()
    await screen.findByText('Đầm suông nữ dạo phố')

    await userEvent.type(screen.getByPlaceholderText(/Chia sẻ cảm nhận/), 'Tuyệt vời')
    await userEvent.click(screen.getByRole('button', { name: 'Gửi đánh giá' }))

    await waitFor(() =>
      expect(addReview).toHaveBeenCalledWith(
        expect.objectContaining({ idproduct: 2, iduser: '2', rating: 5, comment: 'Tuyệt vời' }),
        { silentError: true },
      ),
    )
    expect(await screen.findByText('Tuyệt vời')).toBeInTheDocument()
  })

  it('shows a login hint instead of the review form when logged out', async () => {
    renderPage()
    await screen.findByText('Đầm suông nữ dạo phố')
    expect(screen.getByText('Đăng nhập để đánh giá sản phẩm này.')).toBeInTheDocument()
  })
})
