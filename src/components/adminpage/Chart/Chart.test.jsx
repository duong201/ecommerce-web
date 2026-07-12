import React from 'react'
import { render, screen } from '@testing-library/react'
import Chart from './Chart'

describe('Chart', () => {
  it('renders the section header and chart container without crashing', () => {
    render(<Chart />)
    expect(screen.getByText('Last 6 months (income)')).toBeInTheDocument()
    expect(screen.getByTestId('chart-body')).toBeInTheDocument()
  })
})
