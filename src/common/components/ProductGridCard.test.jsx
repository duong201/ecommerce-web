import React from 'react'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithRouter } from '../../test-utils/renderWithRouter'
import ProductGridCard from './ProductGridCard'

const product = {
  id: 5,
  name: 'Giày sneaker unisex',
  imgPrimary: 'https://example.com/img.jpg',
  price: 650000,
  discount: 12,
  sold: 410,
}

describe('ProductGridCard', () => {
  it('renders the product name, discounted price, and sold count', () => {
    renderWithRouter(<ProductGridCard product={product} />)
    expect(screen.getByText('Giày sneaker unisex')).toBeInTheDocument()
    expect(screen.getByText(/Đã bán 410/)).toBeInTheDocument()
    expect(screen.getByText(Intl.NumberFormat().format(572000))).toBeInTheDocument()
  })

  it('links to the product detail page', () => {
    renderWithRouter(<ProductGridCard product={product} />)
    expect(screen.getByRole('link')).toHaveAttribute('href', '/product-detail/5')
  })

  it('applies the default grid class when none is supplied', () => {
    renderWithRouter(<ProductGridCard product={product} />)
    expect(screen.getByTestId('product-grid-card')).toHaveClass('c-6', 'm-4', 'l-2', 'card-product')
  })

  it('applies a custom cardClassName when supplied', () => {
    renderWithRouter(
      <ProductGridCard product={product} cardClassName="c-6 m-4 l-2-4 box-list-products" />,
    )
    expect(screen.getByTestId('product-grid-card')).toHaveClass('box-list-products')
  })

  it('fires onClick when the card is clicked', async () => {
    const onClick = jest.fn()
    renderWithRouter(<ProductGridCard product={product} onClick={onClick} />)
    await userEvent.click(screen.getByRole('link'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
