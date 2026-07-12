import React from 'react'
import { screen } from '@testing-library/react'
import { renderWithRouter } from '../../test-utils/renderWithRouter'
import UserProfileCard from './UserProfileCard'

const user = {
  country: 'VIE',
  fullname: 'Nguyễn Văn A',
  age: 22,
  phone: '912345678',
  email: 'customer@tipee.vn',
  address: '45 Trần Phú, Huế',
}

describe('UserProfileCard', () => {
  it('renders the user profile fields', () => {
    renderWithRouter(<UserProfileCard user={user} />)
    expect(screen.getByText('VIE')).toBeInTheDocument()
    expect(screen.getByText('Nguyễn Văn A')).toBeInTheDocument()
    expect(screen.getByText('Tuổi: 22')).toBeInTheDocument()
    expect(screen.getByText('Sđt: 0912345678')).toBeInTheDocument()
    expect(screen.getByText('Email: customer@tipee.vn')).toBeInTheDocument()
    expect(screen.getByText('Địa chỉ: 45 Trần Phú, Huế')).toBeInTheDocument()
  })

  it('renders an Edit link when editHref is provided', () => {
    renderWithRouter(<UserProfileCard user={user} editHref="/admin/list-user/user/2/edit" />)
    expect(screen.getByRole('link', { name: 'Edit' })).toHaveAttribute(
      'href',
      '/admin/list-user/user/2/edit'
    )
  })

  it('omits the Edit link when editHref is not provided', () => {
    renderWithRouter(<UserProfileCard user={user} />)
    expect(screen.queryByRole('link', { name: 'Edit' })).not.toBeInTheDocument()
  })

  it('does not blow up without a phone number', () => {
    renderWithRouter(<UserProfileCard user={{ ...user, phone: '' }} />)
    expect(screen.getByText('Sđt:')).toBeInTheDocument()
  })

  it('defaults to an empty user object', () => {
    renderWithRouter(<UserProfileCard />)
    expect(screen.getByText('Thông tin cá nhân')).toBeInTheDocument()
  })
})
