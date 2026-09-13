import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  AdminPanelSettingsOutlinedIcon,
  LocalShippingOutlinedIcon,
  SupportAgentOutlinedIcon,
} from '../../../common/components/ui/icons'
import { Link } from 'react-router-dom'
import { LanguageSwitch, ThemeToggle } from '../../../common/components/ui'
import { isStaff } from '../../../common/utils/session'

const TopBar = () => {
  const { t } = useTranslation()

  return (
    <div className="site-topbar">
      <div className="grid wide site-topbar__inner">
        <p className="site-topbar__promise">
          <LocalShippingOutlinedIcon />
          {t('header.promise')}
        </p>

        <div className="site-topbar__links">
          <a href="tel:19001234" className="site-topbar__link">
            <SupportAgentOutlinedIcon />
            {t('header.hotline')}
          </a>

          {isStaff() && (
            <Link to="/admin" className="site-topbar__link">
              <AdminPanelSettingsOutlinedIcon />
              {t('header.adminArea')}
            </Link>
          )}

          <LanguageSwitch />
          <ThemeToggle size="sm" />
        </div>
      </div>
    </div>
  )
}

export default TopBar
