import React from 'react'
import { render, screen } from '@testing-library/react'
import Featured from './Featured'

describe('Featured', () => {
  it('renders the revenue summary', () => {
    render(<Featured />)
    expect(screen.getByText('Total Revenue')).toBeInTheDocument()
    expect(screen.getByText('70%')).toBeInTheDocument()
    expect(screen.getByText('$420')).toBeInTheDocument()
  })
})
