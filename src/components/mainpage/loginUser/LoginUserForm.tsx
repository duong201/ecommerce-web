import { useTranslation } from 'react-i18next'
import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import './LoginUserForm.scss'
import { authService, cartService } from '../../../services'
import { ROLE_ID } from '../../../common/constants'
import { toast } from '../../../common/utils/toast'
import { Alert, Button, Input } from '../../../common/components/ui'
import AuthShell from './AuthShell'

/** Sign-in screen. Merges the guest cart into the account on success. */
const LoginUserForm = () => {
  const { t } = useTranslation()
  const history = useHistory()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const session = await authService.login({ identifier, password })

      // A failed merge must not block the sign-in itself.
      try {
        await cartService.merge()
      } catch {
        /* the guest cart stays where it is */
      }

      toast.success(t('auth.welcomeBack', { name: session.user.fullName }))
      history.push(session.user.roleId >= ROLE_ID.MANAGER ? '/admin' : '/')
    } catch (err) {
      setError(
        (err as { friendlyMessage?: string }).friendlyMessage ??
          (err as Error).message ??
          t('auth.signInFailed'),
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell
      title={t('auth.signInTitle')}
      subtitle={t('auth.signInSubtitle')}
      footer={
        <>
          {t('auth.noAccount')} <Link to="/dang-ky">{t('auth.createOne')}</Link>
        </>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <Input
          label={t('auth.identifier')}
          placeholder="you@example.com"
          autoComplete="username"
          required
          value={identifier}
          onChange={(event) => setIdentifier(event.target.value)}
        />

        <Input
          label={t('auth.password')}
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        {error && <Alert tone="danger">{error}</Alert>}

        <Button type="submit" block size="lg" loading={submitting}>
          {t('common.signIn')}
        </Button>
      </form>
    </AuthShell>
  )
}

export default LoginUserForm
