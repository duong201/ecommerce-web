import React from 'react'
import './Widget.scss'
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import { Link } from 'react-router-dom';
import { useFetch } from '../../../common/hooks/useFetch';
import { getUsers, getProducts, getOrders } from '../../../common/api';
import { formatCurrency } from '../../../common/utils/format';

const WIDGET_CONFIG = {
  user: {
    title: 'users',
    isMoney: false,
    link: '/admin/list-user',
    link_title: 'See all users',
    icon: <PermIdentityIcon className="widget-icon" />,
  },
  product: {
    title: 'products',
    isMoney: false,
    link: '/admin/list-product',
    link_title: 'See all products',
    icon: <ShoppingCartOutlinedIcon className="widget-icon" />,
  },
  order: {
    title: 'orders',
    isMoney: false,
    link: '/admin/list-order',
    link_title: 'See all orders',
    icon: <MonetizationOnOutlinedIcon className="widget-icon" />,
  },
  balance: {
    title: 'My balance',
    isMoney: true,
    link: false,
    link_title: false,
    icon: <AccountBalanceWalletOutlinedIcon className="widget-icon" />,
  },
}

const Widget = ({ type }) => {
  const { data: user } = useFetch(getUsers, [])
  const { data: products } = useFetch(getProducts, [])
  const { data: order } = useFetch(getOrders, [])

  const totalPrice = order.reduce((price, item) => price + item.price, 0)

  const config = WIDGET_CONFIG[type]
  if (!config) return null

  const amount = {
    user: user.length,
    product: products.length,
    order: order.length,
    balance: formatCurrency(totalPrice),
  }[type]

  return (
    <>
      <div className="content">
        <div className="row widget-header" style={{ margin: '0' }}>
          <span>{config.title}</span>
        </div>
        <div className="row widget-count" style={{ margin: '0' }}>
          <span>{config.isMoney && '$'} {amount}</span>
        </div>
        <div className="row widget-footer" style={{ margin: '0' }}>
          {config.link ? <Link to={config.link}>{config.link_title}</Link> : <span />}
          <span>
            {config.icon}
          </span>
        </div>
      </div>
    </>
  )
}

export default Widget
