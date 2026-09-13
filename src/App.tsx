import React from 'react'
import { useTranslation } from 'react-i18next'
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'

import { DialogProvider, Toaster, EmptyState, LinkButton } from './common/components/ui'
import StorefrontLayout from './common/components/layout/StorefrontLayout'

import Pages from './pages/MainPages'
import Catalogue from './components/mainpage/catalogue/Catalogue'
import ProductDetail from './components/mainpage/productDetail/ProductDetail'
import Cart from './components/mainpage/cart/Cart'
import Checkout from './components/mainpage/checkout/Checkout'
import OrderSuccess from './components/mainpage/checkout/OrderSuccess'
import MyOrders from './components/mainpage/orders/MyOrders'
import UserInfo from './components/mainpage/header/UserInfo'
import LoginUserForm from './components/mainpage/loginUser/LoginUserForm'
import RegisterUser from './components/mainpage/loginUser/RegisterUser'

import AdminPage from './pages/AdminPage'
import RequireStaff from './pages/RequireStaff'
import ListUser from './components/adminpage/list-user/ListUser'
import ListProduct from './components/adminpage/list-product/ListProduct'
import ListOrder from './components/adminpage/list-order/ListOrder'
import InventoryPage from './components/adminpage/inventory/InventoryPage'
import SuppliersPage from './components/adminpage/suppliers/SuppliersPage'
import DeliverySlotsPage from './components/adminpage/delivery/DeliverySlotsPage'
import CouponsPage from './components/adminpage/coupons/CouponsPage'
import ReviewsPage from './components/adminpage/reviews/ReviewsPage'

/** Shopper-facing routes, each wrapped in the storefront chrome. */
const STOREFRONT_ROUTES = [
  { path: '/', component: Pages },
  { path: '/san-pham', component: Catalogue },
  { path: '/tim-kiem', component: Catalogue },
  { path: '/san-pham/:idOrSlug', component: ProductDetail },
  { path: '/gio-hang', component: Cart },
  { path: '/thanh-toan', component: Checkout },
  { path: '/dat-hang-thanh-cong/:id', component: OrderSuccess },
  { path: '/don-hang', component: MyOrders },
  { path: '/tai-khoan', component: UserInfo },
] as const

/** Staff routes. `adminOnly` narrows from manager-and-up to administrators. */
const ADMIN_ROUTES = [
  { path: '/admin/don-hang', component: ListOrder },
  { path: '/admin/san-pham', component: ListProduct },
  { path: '/admin/kho', component: InventoryPage },
  { path: '/admin/nha-cung-cap', component: SuppliersPage },
  { path: '/admin/khung-gio-giao', component: DeliverySlotsPage },
  { path: '/admin/ma-giam-gia', component: CouponsPage },
  { path: '/admin/danh-gia', component: ReviewsPage },
  { path: '/admin/nguoi-dung', component: ListUser, adminOnly: true },
] as const

const NotFound = () => {
  const { t } = useTranslation()

  return (
    <div className="grid wide">
      <EmptyState
        variant="page"
        title={t('notFound.title')}
        description={t('notFound.description')}
        action={
          <>
            <LinkButton to="/san-pham">{t('common.browseFruit')}</LinkButton>
            <LinkButton to="/" variant="secondary">
              {t('common.backToHome')}
            </LinkButton>
          </>
        }
      />
    </div>
  )
}

const App = () => (
  <DialogProvider>
    <Router>
      <Switch>
        {STOREFRONT_ROUTES.map(({ path, component: Component }) => (
          <Route key={path} path={path} exact>
            <StorefrontLayout>
              <Component />
            </StorefrontLayout>
          </Route>
        ))}

        <Route path="/dang-nhap" exact component={LoginUserForm} />
        <Route path="/dang-ky" exact component={RegisterUser} />

        <Route path="/admin" exact component={AdminPage} />
        {ADMIN_ROUTES.map((route) => (
          <Route key={route.path} path={route.path} exact>
            <RequireStaff adminOnly={'adminOnly' in route ? route.adminOnly : false}>
              <route.component />
            </RequireStaff>
          </Route>
        ))}

        {/* Legacy English URLs, kept so old bookmarks and emails keep working. */}
        <Redirect from="/products" to="/san-pham" exact />
        <Redirect from="/product-detail/:id" to="/san-pham/:id" exact />
        <Redirect from="/cart" to="/gio-hang" exact />
        <Redirect from="/checkout" to="/thanh-toan" exact />
        <Redirect from="/user/login" to="/dang-nhap" exact />
        <Redirect from="/user/register" to="/dang-ky" exact />
        <Redirect from="/admin/list-user" to="/admin/nguoi-dung" exact />
        <Redirect from="/admin/list-product" to="/admin/san-pham" exact />
        <Redirect from="/admin/list-order" to="/admin/don-hang" exact />

        <Route path="*">
          <StorefrontLayout>
            <NotFound />
          </StorefrontLayout>
        </Route>
      </Switch>
    </Router>

    <Toaster />
  </DialogProvider>
)

export default App
