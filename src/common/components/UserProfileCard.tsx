import React from 'react'
import { useTranslation } from 'react-i18next'
import { translateLabel } from '../utils/labels'
import { Link } from 'react-router-dom'
import { Avatar, Badge } from './ui'
import type { User } from '../../interface'

interface UserProfileCardProps {
  user?: Partial<User>
  editHref?: string
}

const UserProfileCard = ({ user = {}, editHref }: UserProfileCardProps) => {
  const { t } = useTranslation()

  return (
    <div className="profile-card">
      <Avatar name={user.fullName} size="xl" />

      <div>
        <p className="profile-card__name">{user.fullName ?? '—'}</p>
        {user.roleId && <Badge tone="brand">{translateLabel('role', user.roleId)}</Badge>}
      </div>

      <dl className="profile-card__rows">
        <div>
          <dt>{t('account.phone')}</dt>
          <dd>{user.phone ?? '—'}</dd>
        </div>
        <div>
          <dt>{t('account.email')}</dt>
          <dd>{user.email ?? '—'}</dd>
        </div>
        <div>
          <dt>{t('account.status')}</dt>
          <dd>
            <Badge tone={user.isActive === false ? 'danger' : 'success'} size="sm" dot>
              {user.isActive === false ? t('admin.badge.disabled') : t('admin.badge.active')}
            </Badge>
          </dd>
        </div>
      </dl>

      {editHref && (
        <Link to={editHref} className="ui-btn ui-btn--secondary ui-btn--sm profile-card__edit">
          Edit profile
        </Link>
      )}
    </div>
  )
}

export default UserProfileCard
