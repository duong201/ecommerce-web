import React from 'react'
import { useTranslation } from 'react-i18next'
import { DarkModeOutlinedIcon, LightModeOutlinedIcon } from './icons'
import IconButton from './IconButton'
import { useTheme } from '../../hooks/useTheme'

/** Switches the app between the light and dark token sets. */
const ThemeToggle = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const { t } = useTranslation()
  const { resolved, toggle } = useTheme()

  return (
    <IconButton
      size={size}
      label={resolved === 'dark' ? t('common.themeLight') : t('common.themeDark')}
      icon={resolved === 'dark' ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
      onClick={toggle}
    />
  )
}

export default ThemeToggle
