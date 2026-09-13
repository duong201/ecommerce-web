import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  AcUnitOutlinedIcon,
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  LocalShippingOutlinedIcon,
  ReplayOutlinedIcon,
  VerifiedOutlinedIcon,
} from '../../../common/components/ui/icons'
import { Link } from 'react-router-dom'
import { useDialog } from '../../../common/components/ui'
import './Footer.scss'
import qrCodeImg from './images/qr-code.png'
import appStoreImg from './images/app-store.png'
import googlePlayImg from './images/google-play.png'

const PROMISES = [
  { key: 'delivery', icon: <LocalShippingOutlinedIcon /> },
  { key: 'coldChain', icon: <AcUnitOutlinedIcon /> },
  { key: 'certified', icon: <VerifiedOutlinedIcon /> },
  { key: 'freshness', icon: <ReplayOutlinedIcon /> },
]

const LINK_COLUMNS = [
  {
    heading: 'footer.customerCare',
    links: ['helpCentre', 'howToOrder', 'deliveryInfo', 'returns', 'freshnessGuarantee'],
  },
  {
    heading: 'footer.aboutUs',
    links: ['about', 'terms', 'privacy', 'growers', 'press'],
  },
]

const SOCIALS = [
  { icon: <FacebookIcon />, label: 'Facebook' },
  { icon: <InstagramIcon />, label: 'Instagram' },
  { icon: <LinkedInIcon />, label: 'LinkedIn' },
]

const Footer = () => {
  const { t } = useTranslation()
  const { info } = useDialog()

  const announceApp = () =>
    info({
      title: t('footer.appDialogTitle'),
      description: t('footer.appDialogBody'),
      confirmLabel: t('common.gotIt'),
    })

  return (
    <footer className="site-footer">
      <div className="grid wide">
        <ul className="site-footer__promises">
          {PROMISES.map((promise) => (
            <li key={promise.key}>
              <span className="site-footer__promise-icon">{promise.icon}</span>
              <span>
                <strong>{t(`footer.promises.${promise.key}.title`)}</strong>
                <em>{t(`footer.promises.${promise.key}.text`)}</em>
              </span>
            </li>
          ))}
        </ul>

        <div className="site-footer__columns">
          <div className="site-footer__brand">
            <Link to="/" className="site-footer__logo">
              <span aria-hidden="true">🍇</span> Trái <em>Ngon</em>
            </Link>
            <p>{t('footer.blurb')}</p>
            <ul className="site-footer__socials">
              {SOCIALS.map((social) => (
                <li key={social.label}>
                  <button type="button" aria-label={social.label} title={social.label}>
                    {social.icon}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {LINK_COLUMNS.map((column) => (
            <nav key={column.heading} className="site-footer__column">
              <h3>{t(column.heading)}</h3>
              <ul>
                {column.links.map((link) => (
                  <li key={link}>
                    <button type="button">{t(`footer.links.${link}`)}</button>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="site-footer__column">
            <h3>{t('footer.getTheApp')}</h3>
            <div className="site-footer__app">
              <button
                type="button"
                className="site-footer__app-qr"
                aria-label={t('footer.appQrSoon')}
                onClick={announceApp}
              >
                <img src={qrCodeImg} alt="" />
              </button>
              <div className="site-footer__app-stores">
                <button type="button" aria-label={t('footer.appStoreSoon')} onClick={announceApp}>
                  <img src={appStoreImg} alt="" />
                </button>
                <button type="button" aria-label={t('footer.googlePlaySoon')} onClick={announceApp}>
                  <img src={googlePlayImg} alt="" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="site-footer__legal">
          <p>{t('footer.rights')}</p>
          <p>{t('footer.contact')}</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
