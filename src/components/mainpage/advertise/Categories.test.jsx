import React from 'react'
import { screen } from '@testing-library/react'
import { renderWithRouter } from '../../../test-utils/renderWithRouter'
import Categories from './Categories'

describe('Categories', () => {
  it('renders every category as a link to /products', () => {
    renderWithRouter(<Categories />)
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(15)
    links.forEach((link) => expect(link).toHaveAttribute('href', '/products'))
  })

  it('includes the expected category labels', () => {
    renderWithRouter(<Categories />)
    expect(screen.getByText('Thời trang nữ')).toBeInTheDocument()
    expect(screen.getByText('Nhà sách online')).toBeInTheDocument()
  })
})
