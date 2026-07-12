import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from './Home'

describe('Home', () => {
  it('renders the categories list and the promo slider without crashing', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )
    expect(screen.getByText('Thời trang nữ')).toBeInTheDocument()
    expect(screen.getAllByText('50% Off For Your First Shopping').length).toBeGreaterThan(0)
  })
})
