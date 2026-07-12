import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import HeaderAdmin from './HeaderAdmin'

describe('HeaderAdmin', () => {
  it('renders the logo linking to /admin and the search box', () => {
    render(
      <MemoryRouter>
        <HeaderAdmin />
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: 'Tipee' })).toHaveAttribute('href', '/admin')
    expect(screen.getByPlaceholderText('Tìm kiếm...')).toBeInTheDocument()
  })

  it('calls onToggleSidebar when the hamburger button is clicked', async () => {
    const onToggleSidebar = jest.fn()
    render(
      <MemoryRouter>
        <HeaderAdmin onToggleSidebar={onToggleSidebar} />
      </MemoryRouter>,
    )

    await userEvent.click(screen.getByLabelText('Toggle menu'))

    expect(onToggleSidebar).toHaveBeenCalledTimes(1)
  })
})
