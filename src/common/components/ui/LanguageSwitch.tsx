import React from 'react'
import { useTranslation } from 'react-i18next'
import { LANGUAGES } from '../../../i18n'
import './LanguageSwitch.scss'

const LanguageSwitch = () => {
  const { i18n, t } = useTranslation()
  const active = i18n.resolvedLanguage ?? LANGUAGES[0].code

  return (
    <div className="ui-lang" role="group" aria-label={t('common.language')}>
      {LANGUAGES.map((language) => (
        <button
          key={language.code}
          type="button"
          className={language.code === active ? 'is-active' : ''}
          aria-pressed={language.code === active}
          title={language.label}
          onClick={() => i18n.changeLanguage(language.code)}
        >
          {language.short}
        </button>
      ))}
    </div>
  )
}

export default LanguageSwitch
