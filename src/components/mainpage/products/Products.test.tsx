import React from 'react'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithRouter } from '../../../test-utils/renderWithRouter'
import { mockApiResponse } from '../../../test-utils/mockApiResponse'
import { buildProduct, buildCategory } from '../../../test-utils/fixtures'
import { getProducts, getCategories } from '../../../common/api'
import Products from './Products'

jest.mock('../../../common/api')

const products = [
  buildProduct({
    id: 1,
    name: 'Áo thun nữ basic',
    idcategorize: 1,
    price: 150000,
    discount: 10,
    sold: 320,
    createdAt: '2024-01-05T00:00:00.000Z',
  }),
  buildProduct({
    id: 2,
    name: 'Áo sơ mi nam công sở',
    idcategorize: 2,
    price: 280000,
    discount: 5,
    sold: 180,
    createdAt: '2024-02-01T00:00:00.000Z',
  }),
]

const categories = [
  buildCategory({ id: 1, categorize: 'Thời trang nữ' }),
  buildCategory({ id: 2, categorize: 'Thời trang nam' }),
]

describe('Products (storefront listing)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.mocked(getProducts).mockReturnValue(mockApiResponse(products))
    jest.mocked(getCategories).mockReturnValue(mockApiResponse(categories))
  })

  it('renders every product by default', async () => {
    renderWithRouter(<Products />)
    await screen.findByText('Áo thun nữ basic')
    expect(screen.getByText('Áo sơ mi nam công sở')).toBeInTheDocument()
  })

  it('renders the category filter list', async () => {
    renderWithRouter(<Products />)
    await screen.findByText('Thời trang nữ')
    expect(screen.getByText('Thời trang nam')).toBeInTheDocument()
  })

  it('filters the product list to the selected category', async () => {
    renderWithRouter(<Products />)
    await screen.findByText('Áo thun nữ basic')

    await userEvent.click(screen.getByText('Thời trang nam'))

    expect(screen.queryByText('Áo thun nữ basic')).not.toBeInTheDocument()
    expect(screen.getByText('Áo sơ mi nam công sở')).toBeInTheDocument()
  })

  it('"Tất cả sản phẩm" resets the filter', async () => {
    renderWithRouter(<Products />)
    await screen.findByText('Áo thun nữ basic')

    await userEvent.click(screen.getByText('Thời trang nam'))
    expect(screen.queryByText('Áo thun nữ basic')).not.toBeInTheDocument()

    await userEvent.click(screen.getByText('Tất cả sản phẩm'))
    expect(screen.getByText('Áo thun nữ basic')).toBeInTheDocument()
    expect(screen.getByText('Áo sơ mi nam công sở')).toBeInTheDocument()
  })

  it('sorts by price low to high', async () => {
    renderWithRouter(<Products />)
    await screen.findByText('Áo thun nữ basic')

    await userEvent.click(screen.getByText('Thấp đến Cao'))

    const names = screen.getAllByText(/Áo/).map((el) => el.textContent)
    expect(names.indexOf('Áo thun nữ basic')).toBeLessThan(names.indexOf('Áo sơ mi nam công sở'))
  })

  it('sorts by newest first', async () => {
    renderWithRouter(<Products />)
    await screen.findByText('Áo thun nữ basic')

    await userEvent.click(screen.getByText('Mới nhất'))

    const names = screen.getAllByText(/Áo/).map((el) => el.textContent)
    expect(names.indexOf('Áo sơ mi nam công sở')).toBeLessThan(names.indexOf('Áo thun nữ basic'))
  })

  it('filters by the ?search= query param', async () => {
    renderWithRouter(<Products />, { route: '/products?search=thun', path: '/products' })
    await screen.findByText('Áo thun nữ basic')
    expect(screen.queryByText('Áo sơ mi nam công sở')).not.toBeInTheDocument()
    expect(screen.getByText(/Kết quả tìm kiếm cho/)).toBeInTheDocument()
  })

  it('shows an empty state when no product matches', async () => {
    renderWithRouter(<Products />, { route: '/products?search=zzz', path: '/products' })
    await screen.findByText('Không tìm thấy sản phẩm phù hợp.')
  })
})
