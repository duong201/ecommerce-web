import React from 'react'
import { useTranslation } from 'react-i18next'
import Header from '../../../components/mainpage/header/Header'
import Footer from '../../../components/mainpage/footer/Footer'
import './StorefrontLayout.scss'

const StorefrontLayout = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation()

  return (
    <div className="storefront">
      <a className="skip-link" href="#main">
        {t('common.skipToContent')}
      </a>
      <Header />
      <main id="main" className="storefront__main" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default StorefrontLayout
