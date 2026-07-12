import React from 'react'
import { screen } from '@testing-library/react'
import { renderWithRouter } from '../../../test-utils/renderWithRouter'
import Footer from './Footer'

describe('Footer', () => {
  it('renders the customer-care and about-us link lists as buttons (not dead anchors)', () => {
    renderWithRouter(<Footer />)
    expect(screen.getByRole('button', { name: 'Trung tâm trợ giúp' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Giới thiệu về Tipee' })).toBeInTheDocument()
  })

  it('renders the social links and copyright text', () => {
    renderWithRouter(<Footer />)
    expect(screen.getByRole('button', { name: /Facebook/ })).toBeInTheDocument()
    expect(screen.getByText('@2022 - Bản quyền thuộc về Công ty Tipee')).toBeInTheDocument()
  })
})
