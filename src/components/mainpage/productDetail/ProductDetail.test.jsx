import React from 'react'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithRouter } from '../../../test-utils/renderWithRouter'
import { mockApiResponse } from '../../../test-utils/mockApiResponse'
import {
  getProduct, getProducts, getCarts, addToCart, updateCartAmount,
  getProductReviews, addReview, getUserWishlist, addToWishlist, removeFromWishlist,
} from '../../../common/api'
import ProductDetail from './ProductDetail'

jest.mock('../../../common/api')

const product = {
  id: 2,
  name: 'Đầm suông nữ dạo phố',
  imgPrimary: 'img.jpg',
  productImage: 'img.jpg',
  price: 320000,
  discount: 15,
  sold: 210,
}

const renderPage = () =>
  renderWithRouter(<ProductDetail />, { route: '/product-detail/2', path: '/product-detail/:id' })

describe('ProductDetail', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    sessionStorage.clear()
    getProduct.mockReturnValue(mockApiResponse(product))
    getProducts.mockReturnValue(mockApiResponse([]))
    getCarts.mockReturnValue(mockApiResponse([]))
    getProductReviews.mockReturnValue(mockApiResponse([]))
    getUserWishlist.mockReturnValue(mockApiResponse([]))
  })

  it('renders the product name, price and discount', async () => {
    renderPage()
    await waitFor(() => expect(screen.getByText('Đầm suông nữ dạo phố')).toBeInTheDocument())
    expect(screen.getByText(Intl.NumberFormat().format(320000))).toBeInTheDocument()
    expect(screen.getByText('15% Giảm')).toBeInTheDocument()
  })

  it('fetches the product by the :id route param', async () => {
    renderPage()
    await waitFor(() => expect(getProduct).toHaveBeenCalledWith('2'))
  })

  it('shows the login prompt instead of adding to cart when logged out', async () => {
    renderPage()
    await waitFor(() => expect(screen.getByText('Đầm suông nữ dạo phố')).toBeInTheDocument())

    await userEvent.click(screen.getByRole('button', { name: /Thêm vào giỏ hàng/ }))

    expect(document.getElementById('notiCart')).toHaveClass('active')
    expect(addToCart).not.toHaveBeenCalled()
  })

  it('adds a new cart row when the product is not already in the cart', async () => {
    sessionStorage.setItem('id', '2')
    addToCart.mockReturnValue(mockApiResponse({ status: 'success', cart: { id: 9 } }))

    renderPage()
    await waitFor(() => expect(screen.getByText('Đầm suông nữ dạo phố')).toBeInTheDocument())

    await userEvent.click(screen.getByRole('button', { name: /Thêm vào giỏ hàng/ }))

    await waitFor(() =>
      expect(addToCart).toHaveBeenCalledWith(
        expect.objectContaining({ iduser: '2', idproduct: 2, amount: 1 })
      )
    )
  })

  it('increments the existing cart row instead of duplicating it', async () => {
    sessionStorage.setItem('id', '2')
    getCarts.mockReturnValue(
      mockApiResponse([{ id: 9, iduser: '2', idproduct: 2, amount: 1, color: 'Đen', size: '28' }])
    )
    updateCartAmount.mockReturnValue(mockApiResponse({}))

    renderPage()
    await waitFor(() => expect(screen.getByText('Đầm suông nữ dạo phố')).toBeInTheDocument())

    await userEvent.click(screen.getByRole('button', { name: /Thêm vào giỏ hàng/ }))

    await waitFor(() =>
      expect(updateCartAmount).toHaveBeenCalledWith({ amount: 2, id: 9 })
    )
    expect(addToCart).not.toHaveBeenCalled()
  })

  it('only matches an existing cart row for the current user', async () => {
    sessionStorage.setItem('id', '2')
    getCarts.mockReturnValue(
      mockApiResponse([{ id: 9, iduser: '999', idproduct: 2, amount: 1 }])
    )
    addToCart.mockReturnValue(mockApiResponse({ status: 'success', cart: {} }))

    renderPage()
    await waitFor(() => expect(screen.getByText('Đầm suông nữ dạo phố')).toBeInTheDocument())

    await userEvent.click(screen.getByRole('button', { name: /Thêm vào giỏ hàng/ }))

    await waitFor(() => expect(addToCart).toHaveBeenCalled())
    expect(updateCartAmount).not.toHaveBeenCalled()
  })

  it('includes the selected color and size when adding to the cart', async () => {
    sessionStorage.setItem('id', '2')
    addToCart.mockReturnValue(mockApiResponse({ status: 'success', cart: { id: 9 } }))

    renderPage()
    await waitFor(() => expect(screen.getByText('Đầm suông nữ dạo phố')).toBeInTheDocument())

    await userEvent.click(screen.getByText('Trắng'))
    await userEvent.click(screen.getByText('29'))
    await userEvent.click(screen.getByRole('button', { name: /Thêm vào giỏ hàng/ }))

    await waitFor(() =>
      expect(addToCart).toHaveBeenCalledWith(
        expect.objectContaining({ color: 'Trắng', size: '29' })
      )
    )
  })

  it('toggles the product in and out of the wishlist', async () => {
    sessionStorage.setItem('id', '2')
    addToWishlist.mockReturnValue(mockApiResponse({ status: 'success', wishlistItem: { id: 1, iduser: '2', idproduct: 2 } }))
    removeFromWishlist.mockReturnValue(mockApiResponse({ status: 'success' }))

    renderPage()
    await waitFor(() => expect(screen.getByText('Đầm suông nữ dạo phố')).toBeInTheDocument())

    const wishlistButton = document.querySelector('.wishlist-toggle')
    await userEvent.click(wishlistButton)
    await waitFor(() => expect(addToWishlist).toHaveBeenCalledWith(expect.objectContaining({ iduser: '2', idproduct: 2 })))
    await waitFor(() => expect(wishlistButton).toHaveClass('active'))

    await userEvent.click(wishlistButton)
    await waitFor(() => expect(removeFromWishlist).toHaveBeenCalledWith('2', 2))
  })

  it('shows the login prompt instead of toggling wishlist when logged out', async () => {
    renderPage()
    await waitFor(() => expect(screen.getByText('Đầm suông nữ dạo phố')).toBeInTheDocument())

    await userEvent.click(document.querySelector('.wishlist-toggle'))

    expect(document.getElementById('notiCart')).toHaveClass('active')
    expect(addToWishlist).not.toHaveBeenCalled()
  })

  it('lists existing reviews and their average rating', async () => {
    getProductReviews.mockReturnValue(mockApiResponse([
      { id: 1, idproduct: 2, iduser: '2', userName: 'Nguyễn Văn A', rating: 4, comment: 'Đẹp', createdAt: '2024-04-01T00:00:00.000Z' },
      { id: 2, idproduct: 2, iduser: '3', userName: 'Trần Thị B', rating: 5, comment: 'Rất ưng', createdAt: '2024-04-02T00:00:00.000Z' },
    ]))

    renderPage()
    await waitFor(() => expect(screen.getByText('Đánh giá sản phẩm (2)')).toBeInTheDocument())
    expect(screen.getByText('4.5')).toBeInTheDocument()
    expect(screen.getByText('Rất ưng')).toBeInTheDocument()
  })

  it('lets a logged-in user submit a review', async () => {
    sessionStorage.setItem('id', '2')
    sessionStorage.setItem('name', 'Nguyễn Văn A')
    addReview.mockReturnValue(mockApiResponse({
      status: 'success',
      review: { id: 1, idproduct: 2, iduser: '2', userName: 'Nguyễn Văn A', rating: 5, comment: 'Tuyệt vời', createdAt: '2024-04-03T00:00:00.000Z' },
    }))

    renderPage()
    await waitFor(() => expect(screen.getByText('Đầm suông nữ dạo phố')).toBeInTheDocument())

    await userEvent.type(screen.getByPlaceholderText(/Chia sẻ cảm nhận/), 'Tuyệt vời')
    await userEvent.click(screen.getByRole('button', { name: 'Gửi đánh giá' }))

    await waitFor(() =>
      expect(addReview).toHaveBeenCalledWith(
        expect.objectContaining({ idproduct: 2, iduser: '2', rating: 5, comment: 'Tuyệt vời' }),
        { silentError: true }
      )
    )
    expect(await screen.findByText('Tuyệt vời')).toBeInTheDocument()
  })

  it('shows a login hint instead of the review form when logged out', async () => {
    renderPage()
    await waitFor(() => expect(screen.getByText('Đầm suông nữ dạo phố')).toBeInTheDocument())
    expect(screen.getByText('Đăng nhập để đánh giá sản phẩm này.')).toBeInTheDocument()
  })
})
