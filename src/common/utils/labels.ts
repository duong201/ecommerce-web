import i18n from '../../i18n'

export const translateLabel = (group: string, value?: string | number | null): string => {
  if (value === null || value === undefined || value === '') return ''
  const key = `labels.${group}.${value}`
  const label = i18n.t(key)
  return label === key ? String(value) : label
}
