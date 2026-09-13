import { useTranslation } from 'react-i18next'
import React, { useCallback, useState } from 'react'
import { AddIcon, PersonOutlineIcon } from '../../../common/components/ui/icons'
import './UserInfo.scss'
import { useFetch } from '../../../common/hooks/useFetch'
import { addressService, userService } from '../../../services'
import UserProfileCard from '../../../common/components/UserProfileCard'
import { isLoggedIn } from '../../../common/utils/session'
import { toast } from '../../../common/utils/toast'
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Input,
  LinkButton,
  LoadingState,
  useDialog,
} from '../../../common/components/ui'
import type { Address, User } from '../../../interface'

const BLANK_ADDRESS = {
  recipientName: '',
  phone: '',
  line1: '',
  ward: '',
  district: '',
  province: 'Ho Chi Minh City',
  deliveryNote: '',
}

/** Account page: profile summary plus the delivery address book. */
const UserInfo = () => {
  const { t } = useTranslation()
  const { confirm } = useDialog()

  const fetchMe = useCallback(() => userService.me(), [])
  const { data: user, loading } = useFetch<User | null>(fetchMe, [], null)

  const fetchAddresses = useCallback(() => addressService.list(), [])
  const { data: addresses, refetch: refetchAddresses } = useFetch<Address[]>(fetchAddresses, [], [])

  const [form, setForm] = useState(BLANK_ADDRESS)
  const [adding, setAdding] = useState(false)
  const [busy, setBusy] = useState(false)

  const setField =
    (field: keyof typeof BLANK_ADDRESS) => (event: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: event.target.value }))

  const submitAddress = async (event: React.FormEvent) => {
    event.preventDefault()
    setBusy(true)
    try {
      await addressService.create({
        ...form,
        ward: form.ward || null,
        deliveryNote: form.deliveryNote || null,
      })
      toast.success(t('account.added'))
      setForm(BLANK_ADDRESS)
      setAdding(false)
      refetchAddresses()
    } catch (error) {
      toast.error((error as Error).message || t('account.addFailed'))
    } finally {
      setBusy(false)
    }
  }

  const removeAddress = async (address: Address) => {
    const confirmed = await confirm({
      title: t('account.deleteTitle'),
      description: `${address.recipientName} · ${address.line1}`,
      confirmLabel: t('common.delete'),
      tone: 'danger',
    })
    if (!confirmed) return

    setBusy(true)
    try {
      await addressService.remove(address.id)
      toast.success(t('account.deleted'))
      refetchAddresses()
    } catch (error) {
      toast.error((error as Error).message || t('account.deleteFailed'))
    } finally {
      setBusy(false)
    }
  }

  const setDefault = async (id: string) => {
    setBusy(true)
    try {
      await addressService.setDefault(id)
      toast.success(t('account.defaultUpdated'))
      refetchAddresses()
    } catch (error) {
      toast.error((error as Error).message || t('account.defaultFailed'))
    } finally {
      setBusy(false)
    }
  }

  if (!isLoggedIn()) {
    return (
      <div className="grid wide">
        <EmptyState
          variant="page"
          icon={<PersonOutlineIcon />}
          title={t('account.signInTitle')}
          description={t('account.signInDescription')}
          action={<LinkButton to="/dang-nhap">{t('common.signIn')}</LinkButton>}
        />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="grid wide">
        <LoadingState variant="page" />
      </div>
    )
  }

  return (
    <div className="grid wide account-page">
      <header className="account-page__header">
        <h1>{t('account.title')}</h1>
        <p>{t('account.lede')}</p>
      </header>

      <div className="account-page__layout">
        <Card padding="lg" className="account-page__profile">
          <UserProfileCard user={user ?? {}} />
        </Card>

        <Card padding="lg" className="account-page__addresses">
          <div className="account-page__addresses-head">
            <h2>{t('account.addresses')}</h2>
            <Button
              variant={adding ? 'ghost' : 'secondary'}
              size="sm"
              iconLeft={adding ? undefined : <AddIcon />}
              onClick={() => setAdding(!adding)}
            >
              {adding ? t('common.cancel') : t('account.addAddress')}
            </Button>
          </div>

          {adding && (
            <form className="address-form" onSubmit={submitAddress}>
              <Input
                label={t('address.recipient')}
                required
                value={form.recipientName}
                onChange={setField('recipientName')}
              />
              <Input
                label={t('address.phone')}
                required
                type="tel"
                value={form.phone}
                onChange={setField('phone')}
              />
              <Input
                className="is-wide"
                label={t('address.line1')}
                placeholder={t('address.line1Placeholder')}
                required
                value={form.line1}
                onChange={setField('line1')}
              />
              <Input label={t('address.ward')} value={form.ward} onChange={setField('ward')} />
              <Input
                label={t('address.district')}
                required
                value={form.district}
                onChange={setField('district')}
              />
              <Input
                label={t('address.province')}
                required
                value={form.province}
                onChange={setField('province')}
              />
              <Input
                className="is-wide"
                label={t('address.note')}
                value={form.deliveryNote}
                onChange={setField('deliveryNote')}
              />

              <div className="address-form__actions is-wide">
                <Button type="submit" loading={busy}>
                  Save address
                </Button>
              </div>
            </form>
          )}

          {addresses.length === 0 && !adding && (
            <EmptyState
              title={t('account.noAddressesTitle')}
              description={t('account.noAddressesDescription')}
            />
          )}

          <ul className="address-list">
            {addresses.map((address) => (
              <li className="address-item" key={address.id}>
                <div className="address-item__body">
                  <p className="address-item__who">
                    <strong>{address.recipientName}</strong>
                    <span>{address.phone}</span>
                    {address.isDefault && (
                      <Badge tone="brand" size="sm">
                        Default
                      </Badge>
                    )}
                  </p>
                  <p className="address-item__line">
                    {address.line1}
                    {address.ward ? `, ${address.ward}` : ''}, {address.district},{' '}
                    {address.province}
                  </p>
                  {address.deliveryNote && (
                    <p className="address-item__note">{address.deliveryNote}</p>
                  )}
                </div>

                <div className="address-item__actions">
                  {!address.isDefault && (
                    <Button
                      variant="link"
                      size="sm"
                      disabled={busy}
                      onClick={() => setDefault(address.id)}
                    >
                      Make default
                    </Button>
                  )}
                  <Button
                    variant="link"
                    size="sm"
                    className="is-danger"
                    disabled={busy}
                    onClick={() => removeAddress(address)}
                  >
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}

export default UserInfo
