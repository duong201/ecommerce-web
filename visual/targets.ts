/** The pages, viewports and themes the visual run covers. */

export interface Breakpoint {
  name: string
  width: number
  height: number
}

/**
 * One viewport per band of `src/styles/_breakpoints.scss`: below `xs` (480),
 * between `md` (768) and `lg` (1024), and at `xxl` (1440).
 */
export const BREAKPOINTS: Breakpoint[] = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 834, height: 1112 },
  { name: 'desktop', width: 1440, height: 900 },
]

export type Theme = 'light' | 'dark'

const parseThemes = (raw: string | undefined, fallback: Theme[]): Theme[] => {
  if (!raw) return fallback
  const wanted = raw.split(',').map((value) => value.trim())
  const themes = wanted.filter((value): value is Theme => value === 'light' || value === 'dark')
  if (themes.length === 0) throw new Error(`THEMES must be light, dark, or both — got "${raw}"`)
  return themes
}

/** Screenshots default to light only; contrast is checked in both themes. */
export const SHOT_THEMES = parseThemes(process.env.THEMES, ['light'])
export const CONTRAST_THEMES = parseThemes(process.env.THEMES, ['light', 'dark'])

/** Which signed-in state a page needs before it will render. */
export type Audience = 'guest' | 'customer' | 'admin'

export interface RouteTarget {
  /** File-name-safe id; becomes the screenshot basename. */
  id: string
  title: string
  path: string
  as: Audience
}

/** A slug from the offline dataset (`src/services/mock/dataset.ts`). */
const SAMPLE_PRODUCT_SLUG = 'xoai-cat-hoa-loc'

/**
 * Pages a plain `goto` can reach. Cart, checkout and the order confirmation are
 * missing on purpose: the offline store keeps the cart in memory, so those
 * pages only hold content when they are walked to in one session — see
 * `flow.spec.ts`.
 */
export const ROUTES: RouteTarget[] = [
  { id: 'home', title: 'Home', path: '/', as: 'guest' },
  { id: 'products', title: 'Product list', path: '/san-pham', as: 'guest' },
  {
    id: 'product-detail',
    title: 'Product detail',
    path: `/san-pham/${SAMPLE_PRODUCT_SLUG}`,
    as: 'guest',
  },
  { id: 'search', title: 'Search page', path: '/tim-kiem', as: 'guest' },
  {
    id: 'search-filtered',
    title: 'Search with filters',
    path: '/tim-kiem?q=x&minPrice=100000&maxPrice=300000&inStock=true',
    as: 'guest',
  },
  { id: 'login', title: 'Sign in', path: '/dang-nhap', as: 'guest' },
  { id: 'register', title: 'Register', path: '/dang-ky', as: 'guest' },
  { id: 'not-found', title: 'Not found', path: '/khong-co-trang-nay', as: 'guest' },

  { id: 'cart-empty', title: 'Cart (empty)', path: '/gio-hang', as: 'customer' },
  { id: 'checkout-empty', title: 'Checkout (empty cart)', path: '/thanh-toan', as: 'customer' },
  { id: 'account', title: 'My account', path: '/tai-khoan', as: 'customer' },
  { id: 'my-orders', title: 'My orders', path: '/don-hang', as: 'customer' },

  { id: 'admin-dashboard', title: 'Admin dashboard', path: '/admin', as: 'admin' },
  { id: 'admin-orders', title: 'Admin orders', path: '/admin/don-hang', as: 'admin' },
  { id: 'admin-products', title: 'Admin products', path: '/admin/san-pham', as: 'admin' },
  { id: 'admin-inventory', title: 'Admin inventory', path: '/admin/kho', as: 'admin' },
  { id: 'admin-suppliers', title: 'Admin suppliers', path: '/admin/nha-cung-cap', as: 'admin' },
  {
    id: 'admin-delivery-slots',
    title: 'Admin delivery slots',
    path: '/admin/khung-gio-giao',
    as: 'admin',
  },
  { id: 'admin-coupons', title: 'Admin coupons', path: '/admin/ma-giam-gia', as: 'admin' },
  { id: 'admin-reviews', title: 'Admin reviews', path: '/admin/danh-gia', as: 'admin' },
  { id: 'admin-users', title: 'Admin users', path: '/admin/nguoi-dung', as: 'admin' },
]

export { SAMPLE_PRODUCT_SLUG }
