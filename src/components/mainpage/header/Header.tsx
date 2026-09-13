import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CloseIcon, MenuIcon, SearchIcon } from '../../../common/components/ui/icons'
import { Link, NavLink } from 'react-router-dom'
import './Header.scss'
import TopBar from './Navbar'
import AccountMenu from './AccountMenu'
import { IconButton } from '../../../common/components/ui'

const NAV_LINKS = [
  { to: '/san-pham', key: 'allFruit' },
  { to: '/tim-kiem', key: 'search' },
  { to: '/san-pham?sort=rating', key: 'topRated' },
  { to: '/san-pham?inStock=true', key: 'inStock' },
  { to: '/don-hang', key: 'myOrders' },
]

const Wordmark = () => (
  <>
    Trái <em>Ngon</em>
  </>
)

const Header = () => {
  const { t } = useTranslation()
  const [scrolled, setScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    let frame = 0

    const read = () => {
      frame = 0
      setScrolled(window.scrollY > 8)
    }
    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(read)
    }

    read()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [drawerOpen])

  return (
    <>
      <TopBar />

      <header className={['site-header', scrolled ? 'is-scrolled' : ''].filter(Boolean).join(' ')}>
        <div className="site-header__main">
          <div className="grid wide site-header__inner">
            <IconButton
              className="site-header__burger"
              label={t('common.openMenu')}
              icon={<MenuIcon />}
              onClick={() => setDrawerOpen(true)}
            />

            <Link to="/" className="site-header__logo" aria-label={t('header.homeAria')}>
              <span className="site-header__logo-mark" aria-hidden="true">
                🍇
              </span>
              <span className="site-header__logo-text">
                <Wordmark />
              </span>
            </Link>

            <Link to="/tim-kiem" className="site-header__search-link">
              <SearchIcon />
              <span>{t('header.searchFruit')}</span>
            </Link>

            <AccountMenu />
          </div>
        </div>

        <nav className="site-header__nav" aria-label={t('header.navAria')}>
          <div className="grid wide site-header__nav-inner">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} className="site-header__nav-link">
                {t(`header.nav.${link.key}`)}
              </NavLink>
            ))}
          </div>
        </nav>
      </header>

      {drawerOpen && (
        <div className="site-drawer">
          <button
            type="button"
            className="site-drawer__backdrop"
            aria-label={t('common.closeMenu')}
            onClick={() => setDrawerOpen(false)}
          />
          <div
            className="site-drawer__panel"
            role="dialog"
            aria-modal="true"
            aria-label={t('common.menu')}
          >
            <div className="site-drawer__head">
              <span className="site-header__logo-text">
                <Wordmark />
              </span>
              <IconButton
                label={t('common.closeMenu')}
                icon={<CloseIcon />}
                onClick={() => setDrawerOpen(false)}
              />
            </div>

            <nav className="site-drawer__links">
              {NAV_LINKS.map((link) => (
                <NavLink key={link.to} to={link.to} onClick={() => setDrawerOpen(false)}>
                  {t(`header.nav.${link.key}`)}
                </NavLink>
              ))}
              <NavLink to="/tai-khoan" onClick={() => setDrawerOpen(false)}>
                {t('header.myAccount')}
              </NavLink>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}

export default Header
