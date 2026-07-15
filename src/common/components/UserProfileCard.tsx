import React from 'react'
import { Link } from 'react-router-dom'
import { DEFAULT_AVATAR_URL } from '../constants'
import type { User } from '../../interface'

interface UserProfileCardProps {
  user?: Partial<User>
  editHref?: string
}

const UserProfileCard = ({ user = {}, editHref }: UserProfileCardProps) => (
  <>
    {editHref && (
      <Link to={editHref} className="info-edit">
        Edit
      </Link>
    )}
    <div className="title">Thông tin cá nhân</div>
    <div className="item row" style={{ margin: 0 }}>
      <img src={DEFAULT_AVATAR_URL} className="l-4 itemImg" alt="" />
      <div className="information l-8">
        <div className="info-country">{user.country}</div>
        <div className="info-fullname">{user.fullname}</div>
        <div className="info-age">Tuổi: {user.age}</div>
        <div className="info-phone">Sđt: {user.phone ? `0${user.phone}` : ''}</div>
        <div className="info-email">Email: {user.email}</div>
        <div className="info-address">Địa chỉ: {user.address}</div>
      </div>
    </div>
  </>
)

export default UserProfileCard
