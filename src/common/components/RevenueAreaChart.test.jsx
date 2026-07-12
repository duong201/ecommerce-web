import React from 'react'
import { render } from '@testing-library/react'
import RevenueAreaChart, { MOCK_REVENUE_DATA } from './RevenueAreaChart'

describe('RevenueAreaChart', () => {
  it('renders a responsive chart container without crashing', () => {
    const { container } = render(<RevenueAreaChart />)
    expect(container.querySelector('.recharts-responsive-container')).toBeInTheDocument()
  })

  it('accepts custom data without crashing', () => {
    const data = [{ name: 'A', total: 10 }, { name: 'B', total: 20 }]
    const { container } = render(<RevenueAreaChart data={data} />)
    expect(container.querySelector('.recharts-responsive-container')).toBeInTheDocument()
  })

  it('exports mock revenue data with 7 entries', () => {
    expect(MOCK_REVENUE_DATA).toHaveLength(7)
    expect(MOCK_REVENUE_DATA[0]).toEqual({ name: '0', total: 0 })
  })
})
