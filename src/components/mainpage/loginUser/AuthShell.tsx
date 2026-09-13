import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

interface AuthShellProps {
  title: string
  subtitle?: string
  footer?: React.ReactNode
  children: React.ReactNode
}

/**
 * Two-panel frame shared by sign-in and registration: the form on the left, a
 * brand panel on the right that collapses away below the large breakpoint.
 * Sign-in and registration used to be two separately styled pages that drifted.
 */
const AuthShell = ({ title, subtitle, footer, children }: AuthShellProps) => {
  const { t } = useTranslation()

  return (
    <div className="auth-page">
      <div className="auth-page__form-side">
        <div className="auth-card">
          <Link to="/" className="auth-card__logo">
            <span aria-hidden="true">🍇</span> Trái <em>Ngon</em>
          </Link>

          <div className="auth-card__heading">
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>

          {children}

          {footer && <p className="auth-card__footer">{footer}</p>}
          <Link to="/" className="auth-card__back">
            {t('common.backToShop')}
          </Link>
        </div>
      </div>

      <aside className="auth-page__brand-side" aria-hidden="true">
        <blockquote>
          <p>{t('auth.quote')}</p>
          <cite>{t('auth.quoteCite')}</cite>
        </blockquote>
      </aside>
    </div>
  )
}

export default AuthShell
