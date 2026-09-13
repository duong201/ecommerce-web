import React, { ReactNode, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { isAdmin, isLoggedIn, isStaff } from '../common/utils/session'
import { toast } from '../common/utils/toast'

interface RequireStaffProps {
  children: ReactNode
  adminOnly?: boolean
}

const RequireStaff = ({ children, adminOnly = false }: RequireStaffProps) => {
  const { t } = useTranslation()
  const history = useHistory()
  const allowed = adminOnly ? isAdmin() : isStaff()

  useEffect(() => {
    if (allowed) return

    if (!isLoggedIn()) {
      history.replace('/dang-nhap')
      return
    }
    toast.error(t('ui.noAccess'))
    history.replace('/')
  }, [allowed, history, t])

  return allowed ? <>{children}</> : null
}

export default RequireStaff
