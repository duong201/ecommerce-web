import i18n from '../../i18n'

export const formatCurrency = (value?: number | string | null): string =>
  new Intl.NumberFormat('en-US').format(Math.round(Number(value) || 0))

export const formatPrice = (value?: number | string | null): string =>
  `${formatCurrency(value)} VND`

export const formatQuantity = (value?: number | string | null): string => {
  const quantity = Number(value) || 0
  return Number.isInteger(quantity) ? String(quantity) : String(Number(quantity.toFixed(3)))
}

export const formatUnit = (unitType?: string | null): string => {
  if (!unitType) return ''
  const key = `labels.unitType.${unitType}`
  const label = i18n.t(key)
  return label === key ? unitType : label
}

export const formatQuantityWithUnit = (
  value?: number | string | null,
  unitType?: string | null,
): string => `${formatQuantity(value)} ${formatUnit(unitType)}`.trim()

export const discountPercent = (
  priceAmount?: number | string | null,
  compareAtAmount?: number | string | null,
): number => {
  const price = Number(priceAmount) || 0
  const compareAt = Number(compareAtAmount) || 0
  if (compareAt <= price || compareAt === 0) return 0
  return Math.round(((compareAt - price) / compareAt) * 100)
}

export const formatDate = (value?: string | Date | null): string => {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString('en-GB')
}

export const formatDateTime = (value?: string | Date | null): string => {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? '—'
    : `${date.toLocaleDateString('en-GB')} ${date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
      })}`
}

export const daysUntil = (dateString?: string | null): number | null => {
  if (!dateString) return null
  const target = new Date(dateString)
  if (Number.isNaN(target.getTime())) return null

  const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const diffMs = startOfDay(target).getTime() - startOfDay(new Date()).getTime()
  return Math.round(diffMs / 86_400_000)
}

export const formatExpiry = (dateString?: string | null): string => {
  const days = daysUntil(dateString)
  if (days === null) return '—'
  if (days < 0) return i18n.t('format.expiredDaysAgo', { count: Math.abs(days) })
  if (days === 0) return i18n.t('format.expiresToday')
  return i18n.t('format.daysLeft', { count: days })
}

export const expiryTone = (dateString?: string | null): 'danger' | 'warning' | 'ok' => {
  const days = daysUntil(dateString)
  if (days === null) return 'ok'
  if (days <= 0) return 'danger'
  if (days <= 2) return 'warning'
  return 'ok'
}

export const formatTime = (value?: string | null): string => (value ? value.slice(0, 5) : '')
