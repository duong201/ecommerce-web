import React from 'react'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithRouter } from '../../../test-utils/renderWithRouter'
import { mockApiResponse } from '../../../test-utils/mockApiResponse'
import { getUserWishlist, removeFromWishlist, addToCart } from '../../../common/api'
import Wishlist from './Wishlist'

jest.mock('../../../common/api')

const wishlist = [
  { id: 1, iduser: '2', idproduct: 1, name: 'Áo thun nữ basic', imgPrimary: 'img1.jpg', price: 150000, discount: 10 },
]

describe('Wishlist', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    sessionStorage.clear()
    getUserWishlist.mockReturnValue(mockApiResponse(wishlist))
  })

  it('prompts to log in when logged out', async () => {
    renderWithRouter(<Wishlist />)
    await waitFor(() => expect(screen.getByText('Đăng nhập để xem danh sách yêu thích')).toBeInTheDocument())
  })

  it('lists the current user\'s saved products', async () => {
    sessionStorage.setItem('id', '2')
    renderWithRouter(<Wishlist />)
    await waitFor(() => expect(screen.getByText('Áo thun nữ basic')).toBeInTheDocument())
  })

  it('shows an empty state when the wishlist has no items', async () => {
    sessionStorage.setItem('id', '2')
    getUserWishlist.mockReturnValue(mockApiResponse([]))
    renderWithRouter(<Wishlist />)
    await waitFor(() => expect(screen.getByText('Danh sách yêu thích trống')).toBeInTheDocument())
  })

  it('removes an item from the wishlist', async () => {
    sessionStorage.setItem('id', '2')
    removeFromWishlist.mockReturnValue(mockApiResponse({ status: 'success' }))
    renderWithRouter(<Wishlist />)
    await waitFor(() => expect(screen.getByText('Áo thun nữ basic')).toBeInTheDocument())

    await userEvent.click(screen.getByRole('button', { name: 'Xóa' }))

    await waitFor(() => expect(removeFromWishlist).toHaveBeenCalledWith('2', 1))
  })

  it('moves an item to the cart and removes it from the wishlist', async () => {
    sessionStorage.setItem('id', '2')
    addToCart.mockReturnValue(mockApiResponse({ status: 'success', cart: { id: 9 } }))
    removeFromWishlist.mockReturnValue(mockApiResponse({ status: 'success' }))
    renderWithRouter(<Wishlist />)
    await waitFor(() => expect(screen.getByText('Áo thun nữ basic')).toBeInTheDocument())

    await userEvent.click(screen.getByRole('button', { name: /Thêm vào giỏ/ }))

    await waitFor(() => expect(addToCart).toHaveBeenCalledWith(expect.objectContaining({ iduser: '2', idproduct: 1 })))
    await waitFor(() => expect(removeFromWishlist).toHaveBeenCalledWith('2', 1))
  })
})
