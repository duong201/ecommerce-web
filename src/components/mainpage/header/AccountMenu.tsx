import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  LogoutIcon,
  PersonOutlineIcon,
  ReceiptLongOutlinedIcon,
  ShoppingCartOutlinedIcon,
} from '../../../common/components/ui/icons'
import { Link, useHistory } from 'react-router-dom'
import { Avatar, Button } from '../../../common/components/ui'
import { useFetch } from '../../../common/hooks/useFetch'
import { authService, cartService } from '../../../services'
import { getCurrentUser } from '../../../common/utils/session'
import type { Cart } from '../../../interface'

const EMPTY_CART = {
  id: '',
  status: 'active',
  couponCode: null,
  items: [],
  subtotalAmount: 0,
  discountAmount: 0,
  couponMessage: null,
  itemCount: 0,
  hasIssues: false,
} as Cart

/**
 * Account dropdown plus the cart button. The menu opens on click (not hover, so
 * it works on touch), closes on Escape or an outside click, and returns focus
 * to its trigger.
 */
const AccountMenu = () => {
  const { t } = useTranslation()
  const history = useHistory()
  const user = getCurrentUser()
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const fetchCart = useCallback(() => cartService.get(), [])
  const { data: cart } = useFetch<Cart>(fetchCart, [], EMPTY_CART)

  useEffect(() => {
    if (!open) return undefined

    const onPointerDown = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const logout = async () => {
    await authService.logout()
    setOpen(false)
    history.push('/dang-nhap')
  }

  return (
    <div className="site-header__account">
      {user ? (
        <div className="account-menu" ref={wrapperRef}>
          <button
            type="button"
            className="account-menu__trigger"
            aria-expanded={open}
            aria-haspopup="menu"
            onClick={() => setOpen((value) => !value)}
          >
            <Avatar name={user.fullName} size="sm" />
            <span className="account-menu__name">{user.fullName}</span>
          </button>

          {open && (
            <div className="account-menu__panel" role="menu">
              <Link to="/tai-khoan" role="menuitem" onClick={() => setOpen(false)}>
                <PersonOutlineIcon />
                {t('header.myAccount')}
              </Link>
              <Link to="/don-hang" role="menuitem" onClick={() => setOpen(false)}>
                <ReceiptLongOutlinedIcon />
                {t('header.myOrders')}
              </Link>
              <button type="button" role="menuitem" onClick={logout}>
                <LogoutIcon />
                {t('header.signOut')}
              </button>
            </div>
          )}
        </div>
      ) : (
        <Button variant="secondary" size="sm" onClick={() => history.push('/dang-nhap')}>
          {t('header.signIn')}
        </Button>
      )}

      <Link to="/gio-hang" className="site-header__cart" aria-label={t('header.cart')}>
        <ShoppingCartOutlinedIcon />
        <span className="site-header__cart-count" data-testid="cart-count">
          {cart.itemCount}
        </span>
      </Link>
    </div>
  )
}

export default AccountMenu
