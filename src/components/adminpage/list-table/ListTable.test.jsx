import React from 'react'
import { render, screen } from '@testing-library/react'
import ListTable from './ListTable'

const products = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  sold: i,
  price: 1000,
  discount: 0,
  amount: 10,
}))

describe('ListTable', () => {
  it('shows at most the top 10 best-selling products', () => {
    render(<ListTable products={products} />)
    // highest `sold` values are 11..2 (10 products); the two lowest (id 1, id 2 -> sold 0,1) are excluded
    expect(screen.queryByText('Product 1')).not.toBeInTheDocument()
    expect(screen.getByText('Product 12')).toBeInTheDocument()
  })

  it('sorts by sold descending', () => {
    render(<ListTable products={products} />)
    const rows = screen.getAllByRole('row').slice(1)
    expect(rows[0]).toHaveTextContent('Product 12')
  })

  it('defaults to an empty table when no products prop is given', () => {
    render(<ListTable />)
    expect(screen.getByRole('table')).toBeInTheDocument()
    expect(screen.queryAllByRole('row')).toHaveLength(1) // header row only
  })
})
