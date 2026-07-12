import './grid.css'
import './App.css'
import Header from './components/mainpage/header/Header'
import Footer from './components/mainpage/footer/Footer'
import Cart from './components/mainpage/cart/Cart'
import Pages from './pages/MainPages'
import AdminPage from './pages/AdminPage'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import ProductDetail from './components/mainpage/productDetail/ProductDetail'
import Products from './components/mainpage/products/Products'
import LoginUserForm from './components/mainpage/loginUser/LoginUserForm'
import RegisterUser from './components/mainpage/loginUser/RegisterUser'
import Wishlist from './components/mainpage/wishlist/Wishlist'
import Checkout from './components/mainpage/checkout/Checkout'
import OrderSuccess from './components/mainpage/checkout/OrderSuccess'
import ListUser from './components/adminpage/list-user/ListUser'
import User from './components/adminpage/list-user/User'
import EditingUser from './components/adminpage/list-user/EditingUser'
import ListProduct from './components/adminpage/list-product/ListProduct'
import ListOrder from './components/adminpage/list-order/ListOrder'
import UserInfo from './components/mainpage/header/UserInfo'

function App() {

  return (
    <Router>

      <Switch>
        <Route path="/" exact>
          <Header />
          <Pages />
          <Footer />
        </Route>

        <Route path="/cart" exact>
          <Header />
          <Cart />
          <Footer />
        </Route>

        <Route path="/wishlist" exact>
          <Header />
          <Wishlist />
          <Footer />
        </Route>

        <Route path="/checkout" exact>
          <Header />
          <Checkout />
          <Footer />
        </Route>

        <Route path="/order-success" exact>
          <Header />
          <OrderSuccess />
          <Footer />
        </Route>

        <Route path="/products" exact>
          <Header />
          <Products />
          <Footer />
        </Route>

        <Route path="/product-detail/:id" exact>
          <Header />
          <ProductDetail />
          <Footer />
        </Route>

        <Route path="/user/login" exact>
          <LoginUserForm />
        </Route>

        <Route path="/user/register" exact>
          <RegisterUser />
        </Route>

        <Route path={`/user/info/:id`} exact>
          <Header />
          <UserInfo />
          <Footer />
        </Route>

        <Route path="/admin" exact>
          <AdminPage />
        </Route>

        <Route path={`/admin/list-user`} exact>
          <ListUser />
        </Route>

        <Route path={`/admin/list-user/user/:id`} exact>
          <User />
        </Route>

        <Route path={`/admin/list-user/user/:id/edit`} exact>
          <EditingUser />
        </Route>

        <Route path={`/admin/list-product`} exact>
          <ListProduct />
        </Route>

        <Route path={`/admin/list-order`} exact>
          <ListOrder />
        </Route>

      </Switch>
    </Router>
  );
}

export default App;
