import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { mockApiResponse } from '../test-utils/mockApiResponse'
import { getProducts } from '../common/api'
import Pages from './MainPages'

jest.mock('../common/api')

describe('MainPages', () => {
  it('renders the homepage sections: hero, flash deals, and suggestions', async () => {
    getProducts.mockReturnValue(mockApiResponse([]))
    render(
      <MemoryRouter>
        <Pages />
      </MemoryRouter>,
    )

    expect(screen.getAllByText('50% Off For Your First Shopping').length).toBeGreaterThan(0)
    expect(screen.getByText('Flash Deals')).toBeInTheDocument()
    await screen.findByText('Gợi ý hôm nay')
  })
})
