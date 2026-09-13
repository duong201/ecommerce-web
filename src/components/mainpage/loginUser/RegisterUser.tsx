import { useTranslation } from 'react-i18next'
import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import './LoginUserForm.scss'
import { authService, cartService } from '../../../services'
import { toast } from '../../../common/utils/toast'
import { Alert, Button, Input } from '../../../common/components/ui'
import AuthShell from './AuthShell'

/** Registration screen. Either an email or a phone number is enough. */
const RegisterUser = () => {
  const { t } = useTranslation()
  const history = useHistory()
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirm: '',
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const setField = (field: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: event.target.value }))

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')

    if (!form.email && !form.phone) {
      setError(t('auth.needContact'))
      return
    }
    if (form.password !== form.confirm) {
      setError(t('auth.passwordMismatch'))
      return
    }

    setSubmitting(true)
    try {
      await authService.register({
        fullName: form.fullName,
        email: form.email || undefined,
        phone: form.phone || undefined,
        password: form.password,
      })

      try {
        await cartService.merge()
      } catch {
        /* the guest cart stays where it is */
      }

      toast.success(t('auth.accountCreated'))
      history.push('/')
    } catch (err) {
      setError(
        (err as { friendlyMessage?: string }).friendlyMessage ??
          (err as Error).message ??
          t('auth.registerFailed'),
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell
      title={t('auth.registerTitle')}
      subtitle={t('auth.registerSubtitle')}
      footer={
        <>
          {t('auth.alreadyRegistered')} <Link to="/dang-nhap">{t('common.signIn')}</Link>
        </>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <Input
          label={t('address.fullName')}
          autoComplete="name"
          required
          value={form.fullName}
          onChange={setField('fullName')}
        />

        <div className="auth-form__row">
          <Input
            label={t('auth.email')}
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={setField('email')}
          />
          <Input
            label={t('address.phone')}
            type="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={setField('phone')}
          />
        </div>
        <p className="auth-form__hint">{t('auth.contactHint')}</p>

        <div className="auth-form__row">
          <Input
            label={t('auth.password')}
            type="password"
            autoComplete="new-password"
            minLength={6}
            hint={t('auth.passwordHint')}
            required
            value={form.password}
            onChange={setField('password')}
          />
          <Input
            label={t('auth.confirmPassword')}
            type="password"
            autoComplete="new-password"
            required
            value={form.confirm}
            onChange={setField('confirm')}
          />
        </div>

        {error && <Alert tone="danger">{error}</Alert>}

        <Button type="submit" block size="lg" loading={submitting}>
          Create account
        </Button>
      </form>
    </AuthShell>
  )
}

export default RegisterUser
