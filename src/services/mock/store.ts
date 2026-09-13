import type {
  Cart,
  CartLine,
  Category,
  Coupon,
  CouponEvaluation,
  DashboardSummary,
  DeliverySlot,
  InventoryBatch,
  LossRow,
  Order,
  OrderItem,
  OrderStatusHistoryEntry,
  Paginated,
  Product,
  ProductQuery,
  ProductVariant,
  RevenuePoint,
  Review,
  StockMovement,
  Supplier,
  TopProductRow,
  User,
} from '../../interface'
import { DELIVERY_FEE_AMOUNT, FREE_DELIVERY_THRESHOLD } from '../../common/constants'
import {
  day,
  mockBatches,
  mockCategories,
  mockCoupons,
  mockDeliverySlots,
  mockImages,
  mockProducts,
  mockReviews,
  mockSuppliers,
  mockUsers,
  mockVariants,
} from './dataset'

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T

interface MockState {
  users: User[]
  categories: Category[]
  suppliers: Supplier[]
  products: Product[]
  variants: ProductVariant[]
  batches: InventoryBatch[]
  movements: StockMovement[]
  slots: DeliverySlot[]
  coupons: Coupon[]
  reviews: Review[]
  orders: Order[]
  history: OrderStatusHistoryEntry[]
  cart: Cart
  orderCounter: number
  idCounter: number
}

const emptyCart = (): Cart => ({
  id: 'mock-cart',
  status: 'active',
  couponCode: null,
  items: [],
  subtotalAmount: 0,
  discountAmount: 0,
  couponMessage: null,
  itemCount: 0,
  hasIssues: false,
})

const buildState = (): MockState => ({
  users: clone(mockUsers),
  categories: clone(mockCategories),
  suppliers: clone(mockSuppliers),
  products: clone(mockProducts),
  variants: clone(mockVariants),
  batches: clone(mockBatches),
  movements: [],
  slots: clone(mockDeliverySlots),
  coupons: clone(mockCoupons),
  reviews: clone(mockReviews),
  orders: [],
  history: [],
  cart: emptyCart(),
  orderCounter: 0,
  idCounter: 1000,
})

let state: MockState = buildState()

export const resetMockStore = (): void => {
  state = buildState()
}

const newId = (): string => {
  state.idCounter += 1
  return `99999999-0000-4000-8000-${String(state.idCounter).padStart(12, '0')}`
}

const nowIso = () => new Date().toISOString()

const paginate = <T>(rows: T[], page = 1, limit = 20): Paginated<T> => ({
  data: rows.slice((page - 1) * limit, page * limit),
  meta: {
    total: rows.length,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(rows.length / limit)),
  },
})

const normalise = (value: string): string =>
  value.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').toLowerCase()

const availableOf = (variantId: string): number =>
  state.variants.find((variant) => variant.id === variantId)?.inventoryLevel?.availableQuantity ?? 0

const imagesOf = (productId: string) =>
  mockImages
    .filter((image) => image.productId === productId)
    .sort((a, b) => a.position - b.position)

const decorate = (product: Product): Product => {
  const variants = state.variants.filter(
    (variant) => variant.productId === product.id && variant.isActive,
  )
  const prices = variants.map((variant) => Number(variant.priceAmount))
  const compareAts = variants.map((variant) => Number(variant.compareAtAmount ?? 0)).filter(Boolean)
  const images = imagesOf(product.id)

  return {
    ...product,
    variants,
    images,
    priceFrom: prices.length ? Math.min(...prices) : null,
    compareAtFrom: compareAts.length ? Math.max(...compareAts) : null,
    availableQuantity: variants.reduce((sum, variant) => sum + availableOf(variant.id), 0),
    coverImageUrl: images[0]?.url ?? null,
  }
}

export const mockStore = {
  reset: resetMockStore,

  listProducts(query: ProductQuery = {}): Paginated<Product> {
    let rows = state.products.filter((product) =>
      query.status ? product.status === query.status : product.status === 'active',
    )

    if (query.categoryId) {
      const childIds = state.categories
        .filter((category) => category.parentId === query.categoryId)
        .map((category) => category.id)
      rows = rows.filter(
        (product) =>
          product.categoryId === query.categoryId || childIds.includes(product.categoryId),
      )
    }
    if (query.supplierId) rows = rows.filter((p) => p.supplierId === query.supplierId)
    if (query.storageType) rows = rows.filter((p) => p.storageType === query.storageType)
    if (query.isFeatured !== undefined) rows = rows.filter((p) => p.isFeatured === query.isFeatured)
    if (query.isOrganic !== undefined) rows = rows.filter((p) => p.isOrganic === query.isOrganic)
    if (query.q) {
      const term = normalise(query.q)
      rows = rows.filter(
        (p) => normalise(p.name).includes(term) || normalise(p.origin ?? '').includes(term),
      )
    }

    let decorated = rows.map(decorate)

    if (query.inStock) decorated = decorated.filter((p) => p.availableQuantity > 0)
    if (query.minPrice !== undefined) {
      decorated = decorated.filter((p) => (p.priceFrom ?? 0) >= query.minPrice!)
    }
    if (query.maxPrice !== undefined) {
      decorated = decorated.filter((p) => (p.priceFrom ?? 0) <= query.maxPrice!)
    }

    switch (query.sort) {
      case 'price_asc':
        decorated.sort((a, b) => (a.priceFrom ?? 0) - (b.priceFrom ?? 0))
        break
      case 'price_desc':
        decorated.sort((a, b) => (b.priceFrom ?? 0) - (a.priceFrom ?? 0))
        break
      case 'rating':
        decorated.sort((a, b) => Number(b.ratingAvg) - Number(a.ratingAvg))
        break
      case 'name':
        decorated.sort((a, b) => a.name.localeCompare(b.name, 'vi'))
        break
      default:
        decorated.sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''))
    }

    return paginate(decorated, query.page, query.limit)
  },

  listProductsForAdmin(query: ProductQuery = {}): Paginated<Product> {
    const rows = state.products.map(decorate)
    return paginate(rows, query.page, query.limit ?? 50)
  },

  getProduct(idOrSlug: string): Product {
    const product = state.products.find((p) => p.id === idOrSlug || p.slug === idOrSlug)
    if (!product) throw new Error('Product not found')
    return decorate(product)
  },

  getVariant(variantId: string): ProductVariant | undefined {
    return state.variants.find((variant) => variant.id === variantId)
  },

  listCategories(): Category[] {
    return clone(state.categories)
  },

  listCategoryTree(): Category[] {
    const roots = state.categories.filter((category) => category.parentId === null)
    return roots.map((root) => ({
      ...root,
      children: state.categories.filter((category) => category.parentId === root.id),
    }))
  },

  listSuppliers(): Supplier[] {
    return clone(state.suppliers)
  },

  getCart(): Cart {
    return this.recalculateCart()
  },

  addCartItem(variantId: string, quantity: number): Cart {
    const variant = state.variants.find((v) => v.id === variantId)
    if (!variant) throw new Error('Variant does not exist')

    const step = Number(variant.stepQuantity)
    if (quantity < step) throw new Error(`The minimum quantity is ${step}`)
    if (Math.round(quantity * 1000) % Math.round(step * 1000) !== 0) {
      throw new Error(`The quantity must be a multiple of ${step}`)
    }

    const existing = state.cart.items.find((line) => line.variantId === variantId)
    const nextQuantity = Number(((existing?.quantity ?? 0) + quantity).toFixed(3))

    if (availableOf(variantId) < nextQuantity) {
      const available = availableOf(variantId)
      throw new Error(available > 0 ? `Only ${available}` : 'Out of stock')
    }

    if (existing) {
      existing.quantity = nextQuantity
    } else {
      state.cart.items.push(this.buildLine(variant, nextQuantity))
    }
    return this.recalculateCart()
  },

  setCartQuantity(variantId: string, quantity: number): Cart {
    if (quantity <= 0) return this.removeCartItem(variantId)

    const variant = state.variants.find((v) => v.id === variantId)
    if (!variant) throw new Error('Variant does not exist')
    if (availableOf(variantId) < quantity) throw new Error(`Only ${availableOf(variantId)}`)

    const line = state.cart.items.find((item) => item.variantId === variantId)
    if (!line) throw new Error('That item is not in the cart')
    line.quantity = quantity
    return this.recalculateCart()
  },

  removeCartItem(variantId: string): Cart {
    state.cart.items = state.cart.items.filter((line) => line.variantId !== variantId)
    return this.recalculateCart()
  },

  clearCart(): Cart {
    state.cart = emptyCart()
    return state.cart
  },

  applyCartCoupon(code: string): Cart {
    const current = this.recalculateCart()
    const evaluation = this.evaluateCoupon(code, current.subtotalAmount, 0)
    if (!evaluation.valid) throw new Error(evaluation.reason)

    state.cart.couponCode = evaluation.coupon!.code
    return this.recalculateCart()
  },

  removeCartCoupon(): Cart {
    state.cart.couponCode = null
    return this.recalculateCart()
  },

  buildLine(variant: ProductVariant, quantity: number): CartLine {
    const product = state.products.find((p) => p.id === variant.productId)!
    const image = imagesOf(product.id)[0]

    return {
      variantId: variant.id,
      sku: variant.sku,
      variantName: variant.name,
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      imageUrl: image?.url ?? null,
      unitType: variant.unitType,
      isWeighted: variant.isWeighted,
      stepQuantity: Number(variant.stepQuantity),
      quantity,
      unitPriceAmount: Number(variant.priceAmount),
      currentPriceAmount: Number(variant.priceAmount),
      priceChanged: false,
      lineTotal: Math.round(Number(variant.priceAmount) * quantity),
      availableQuantity: availableOf(variant.id),
      stockIssue: null,
    }
  },

  recalculateCart(): Cart {
    state.cart.items = state.cart.items.map((line) => {
      const variant = state.variants.find((v) => v.id === line.variantId)
      const currentPrice = Number(variant?.priceAmount ?? line.currentPriceAmount)
      const available = availableOf(line.variantId)

      let stockIssue: string | null = null
      if (!variant || !variant.isActive) stockIssue = 'This product is no longer sold'
      else if (available <= 0) stockIssue = 'Out of stock'
      else if (available < line.quantity) stockIssue = `Only ${available}`

      return {
        ...line,
        currentPriceAmount: currentPrice,
        priceChanged: line.unitPriceAmount !== currentPrice,
        lineTotal: Math.round(currentPrice * line.quantity),
        availableQuantity: available,
        stockIssue,
      }
    })

    const subtotalAmount = state.cart.items.reduce((sum, line) => sum + line.lineTotal, 0)
    let discountAmount = 0
    let couponMessage: string | null = null

    if (state.cart.couponCode) {
      const evaluation = this.evaluateCoupon(state.cart.couponCode, subtotalAmount, 0)
      discountAmount = evaluation.discountAmount
      couponMessage = evaluation.valid ? null : (evaluation.reason ?? null)
    }

    state.cart.subtotalAmount = subtotalAmount
    state.cart.discountAmount = discountAmount
    state.cart.couponMessage = couponMessage
    state.cart.itemCount = state.cart.items.length
    state.cart.hasIssues = state.cart.items.some((line) => line.stockIssue !== null)

    return clone(state.cart)
  },

  listCoupons(): Coupon[] {
    return clone(state.coupons)
  },

  listActiveCoupons(): Coupon[] {
    const now = Date.now()
    return clone(
      state.coupons.filter(
        (coupon) =>
          coupon.isActive &&
          new Date(coupon.startsAt).getTime() <= now &&
          (!coupon.endsAt || new Date(coupon.endsAt).getTime() > now) &&
          (coupon.usageLimit === null || coupon.usedCount < coupon.usageLimit),
      ),
    )
  },

  evaluateCoupon(
    code: string,
    subtotalAmount: number,
    deliveryFeeAmount: number,
  ): CouponEvaluation {
    const nothing = { discountAmount: 0, deliveryDiscount: 0 }
    const coupon = state.coupons.find((c) => c.code === code.trim().toUpperCase())

    if (!coupon) return { valid: false, reason: 'This coupon code does not exist', ...nothing }
    if (!coupon.isActive)
      return { valid: false, reason: 'This coupon is no longer active', ...nothing }

    const now = Date.now()
    if (new Date(coupon.startsAt).getTime() > now) {
      return { valid: false, reason: 'This coupon has not started yet', ...nothing }
    }
    if (coupon.endsAt && new Date(coupon.endsAt).getTime() <= now) {
      return { valid: false, reason: 'This coupon has expired', ...nothing }
    }
    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
      return { valid: false, reason: 'This coupon has run out of uses', ...nothing }
    }
    if (subtotalAmount < Number(coupon.minOrderAmount)) {
      return {
        valid: false,
        reason: `This coupon needs a minimum order of ${Number(
          coupon.minOrderAmount,
        ).toLocaleString('en-US')} VND`,
        ...nothing,
      }
    }

    if (coupon.type === 'free_delivery') {
      return { valid: true, coupon, discountAmount: 0, deliveryDiscount: deliveryFeeAmount }
    }
    if (coupon.type === 'fixed_amount') {
      return {
        valid: true,
        coupon,
        discountAmount: Math.min(Math.round(Number(coupon.value)), subtotalAmount),
        deliveryDiscount: 0,
      }
    }

    const raw = Math.round((subtotalAmount * Number(coupon.value)) / 100)
    const capped = coupon.maxDiscountAmount ? Math.min(raw, Number(coupon.maxDiscountAmount)) : raw
    return {
      valid: true,
      coupon,
      discountAmount: Math.min(capped, subtotalAmount),
      deliveryDiscount: 0,
    }
  },

  listAvailableSlots(): DeliverySlot[] {
    return clone(state.slots.filter((slot) => slot.isActive && slot.remaining > 0))
  },

  listAllSlots(): DeliverySlot[] {
    return clone(state.slots)
  },

  listOrders(page = 1, limit = 20): Paginated<Order> {
    return paginate(clone(state.orders), page, limit)
  },

  getOrder(id: string): Order {
    const order = state.orders.find((o) => o.id === id)
    if (!order) throw new Error('Order not found')
    return clone(order)
  },

  getOrderHistory(orderId: string): OrderStatusHistoryEntry[] {
    return clone(state.history.filter((entry) => entry.orderId === orderId))
  },

  checkout(payload: {
    customerName: string
    customerPhone: string
    address: Order['address']
    deliveryDate: string
    deliverySlotId?: string
    paymentProvider: Order['items'] extends never ? never : string
    couponCode?: string
    customerNote?: string
  }): Order {
    const cart = this.recalculateCart()
    if (cart.items.length === 0) throw new Error('The cart is empty')
    if (cart.hasIssues) {
      const issue = cart.items.find((line) => line.stockIssue)!
      throw new Error(`${issue.productName}: ${issue.stockIssue}`)
    }

    const subtotalAmount = cart.subtotalAmount
    let deliveryFeeAmount = subtotalAmount >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE_AMOUNT
    let discountAmount = 0

    const code = payload.couponCode ?? cart.couponCode
    if (code) {
      const evaluation = this.evaluateCoupon(code, subtotalAmount, deliveryFeeAmount)
      if (!evaluation.valid) throw new Error(evaluation.reason)
      discountAmount = evaluation.discountAmount
      deliveryFeeAmount -= evaluation.deliveryDiscount

      const coupon = state.coupons.find((c) => c.id === evaluation.coupon!.id)!
      coupon.usedCount += 1
    }

    const orderId = newId()
    state.orderCounter += 1
    const orderNumber = `DH${day(0).replace(/-/g, '')}-${String(state.orderCounter).padStart(4, '0')}`

    const items: OrderItem[] = []

    for (const line of cart.items) {
      let outstanding = line.quantity

      const batches = state.batches
        .filter(
          (batch) =>
            batch.variantId === line.variantId &&
            batch.status === 'active' &&
            Number(batch.remainingQuantity) > 0,
        )
        .sort((a, b) => a.expiryDate.localeCompare(b.expiryDate))

      for (const batch of batches) {
        if (outstanding <= 0) break
        const take = Math.min(outstanding, Number(batch.remainingQuantity))
        if (take <= 0) continue

        batch.remainingQuantity = String(
          Number((Number(batch.remainingQuantity) - take).toFixed(3)),
        )

        items.push({
          id: newId(),
          orderId,
          variantId: line.variantId,
          batchId: batch.id,
          productName: line.productName,
          variantName: line.variantName,
          sku: line.sku,
          unitType: line.unitType,
          imageUrl: line.imageUrl,
          expiryDate: batch.expiryDate,
          orderedQuantity: String(take),
          actualQuantity: null,
          unitPriceAmount: String(line.currentPriceAmount),
          totalAmount: String(Math.round(line.currentPriceAmount * take)),
        })

        state.movements.unshift({
          id: newId(),
          variantId: line.variantId,
          batchId: batch.id,
          type: 'sale',
          quantityDelta: String(-take),
          quantityAfter: String(availableOf(line.variantId) - take),
          unitCostAmount: batch.unitCostAmount,
          orderId,
          reason: null,
          createdBy: null,
          createdAt: nowIso(),
        })

        outstanding = Number((outstanding - take).toFixed(3))
      }

      const variant = state.variants.find((v) => v.id === line.variantId)
      if (variant?.inventoryLevel) {
        variant.inventoryLevel.onHandQuantity = Number(
          (variant.inventoryLevel.onHandQuantity - line.quantity).toFixed(3),
        )
        variant.inventoryLevel.availableQuantity = Number(
          (variant.inventoryLevel.availableQuantity - line.quantity).toFixed(3),
        )
      }
    }

    if (payload.deliverySlotId) {
      const slot = state.slots.find((s) => s.id === payload.deliverySlotId)
      if (slot) {
        if (slot.remaining <= 0) throw new Error('This delivery slot is full')
        slot.bookedCount += 1
        slot.remaining = slot.maxOrders - slot.bookedCount
      }
    }

    const order: Order = {
      id: orderId,
      orderNumber,
      userId: null,
      customerName: payload.customerName,
      customerPhone: payload.customerPhone,
      status: 'pending',
      paymentStatus: 'unpaid',
      deliverySlotId: payload.deliverySlotId ?? null,
      deliveryDate: payload.deliveryDate,
      subtotalAmount: String(subtotalAmount),
      discountAmount: String(discountAmount),
      deliveryFeeAmount: String(deliveryFeeAmount),
      weightAdjustAmount: '0',
      grandTotalAmount: String(subtotalAmount - discountAmount + deliveryFeeAmount),
      couponCode: code ?? null,
      customerNote: payload.customerNote ?? null,
      internalNote: null,
      cancelReason: null,
      completedAt: null,
      createdAt: nowIso(),
      items,
      address: payload.address,
      deliverySlot: state.slots.find((s) => s.id === payload.deliverySlotId),
    }

    state.orders.unshift(order)
    state.history.push({
      id: newId(),
      orderId,
      field: 'status',
      fromValue: null,
      toValue: 'pending',
      note: 'Order placed by customer',
      changedBy: null,
      createdAt: nowIso(),
    })

    state.cart = emptyCart()
    return clone(order)
  },

  updateOrderStatus(id: string, status: Order['status'], note?: string): Order {
    const order = state.orders.find((o) => o.id === id)
    if (!order) throw new Error('Order not found')

    state.history.push({
      id: newId(),
      orderId: id,
      field: 'status',
      fromValue: order.status,
      toValue: status,
      note: note ?? null,
      changedBy: null,
      createdAt: nowIso(),
    })

    order.status = status
    if (status === 'completed') order.completedAt = nowIso()
    if (status === 'cancelled') order.cancelReason = note ?? 'Cancelled'
    return clone(order)
  },

  listBatches(query: { page?: number; limit?: number; expiringWithinDays?: number } = {}) {
    let rows = state.batches
    if (query.expiringWithinDays !== undefined) {
      const limitDate = day(query.expiringWithinDays)
      rows = rows.filter(
        (batch) =>
          batch.status === 'active' &&
          Number(batch.remainingQuantity) > 0 &&
          batch.expiryDate <= limitDate,
      )
    }

    const withRelations = rows.map((batch) => ({
      ...batch,
      variant: state.variants.find((variant) => variant.id === batch.variantId),
      supplier: state.suppliers.find((supplier) => supplier.id === batch.supplierId),
    }))
    return paginate(clone(withRelations), query.page, query.limit ?? 50)
  },

  listExpiringBatches(withinDays = 2): InventoryBatch[] {
    return this.listBatches({ expiringWithinDays: withinDays, limit: 100 }).data
  },

  listLevels() {
    return clone(
      state.variants.map((variant) => ({
        variantId: variant.id,
        onHandQuantity: variant.inventoryLevel?.onHandQuantity ?? 0,
        reservedQuantity: 0,
        availableQuantity: variant.inventoryLevel?.availableQuantity ?? 0,
        variant: {
          ...variant,
          product: state.products.find((product) => product.id === variant.productId),
        },
      })),
    )
  },

  listMovements(query: { page?: number; limit?: number } = {}) {
    const withRelations = state.movements.map((movement) => ({
      ...movement,
      variant: state.variants.find((variant) => variant.id === movement.variantId),
      batch: state.batches.find((batch) => batch.id === movement.batchId),
    }))
    return paginate(clone(withRelations), query.page, query.limit ?? 50)
  },

  listProductReviews(productId: string, page = 1, limit = 20): Paginated<Review> {
    const rows = state.reviews.filter(
      (review) => review.productId === productId && review.status === 'approved',
    )
    return paginate(clone(rows), page, limit)
  },

  listReviewsForModeration(status: Review['status'] = 'pending'): Paginated<Review> {
    return paginate(clone(state.reviews.filter((review) => review.status === status)), 1, 50)
  },

  moderateReview(id: string, status: Review['status'], adminReply?: string): Review {
    const review = state.reviews.find((r) => r.id === id)
    if (!review) throw new Error('Review not found')
    review.status = status
    if (adminReply !== undefined) review.adminReply = adminReply
    return clone(review)
  },

  addReview(payload: {
    productId: string
    rating: number
    freshnessRating?: number
    content?: string
  }): Review {
    const product = state.products.find((p) => p.id === payload.productId)
    const review: Review = {
      id: newId(),
      productId: payload.productId,
      userId: null,
      orderItemId: null,
      rating: payload.rating,
      freshnessRating: payload.freshnessRating ?? null,
      content: payload.content ?? null,
      imageUrls: null,
      status: 'pending',
      adminReply: null,
      createdAt: nowIso(),
      user: null,
      product: product && { id: product.id, name: product.name, slug: product.slug },
    }
    state.reviews.unshift(review)
    return clone(review)
  },

  listUsers(page = 1, limit = 20): Paginated<User> {
    return paginate(clone(state.users), page, limit)
  },

  getUser(id: string): User {
    const user = state.users.find((u) => u.id === id)
    if (!user) throw new Error('User not found')
    return clone(user)
  },

  findUserByIdentifier(identifier: string): User | undefined {
    return state.users.find((user) => user.email === identifier || user.phone === identifier)
  },

  dashboard(): DashboardSummary {
    const completed = state.orders.filter((order) => order.status === 'completed')
    const revenue = completed.reduce((sum, order) => sum + Number(order.grandTotalAmount), 0)

    return {
      revenueToday: revenue,
      revenueThisMonth: revenue + 48_500_000,
      ordersToday: state.orders.length,
      ordersPending: state.orders.filter((order) => order.status === 'pending').length,
      ordersUnpaid: state.orders.filter((order) => order.paymentStatus === 'unpaid').length,
      customersTotal: state.users.filter((user) => user.roleId === 1).length,
      productsActive: state.products.filter((product) => product.status === 'active').length,
      variantsOutOfStock: state.variants.filter((variant) => availableOf(variant.id) <= 0).length,
      batchesExpiringSoon: this.listExpiringBatches(2).length,
      lossValueThisMonth: 2_450_000,
      reviewsPending: state.reviews.filter((review) => review.status === 'pending').length,
    }
  },

  revenueSeries(days = 30): RevenuePoint[] {
    return Array.from({ length: days }).map((_unused, index) => {
      const offset = index - (days - 1)
      const date = day(offset)
      const weekday = new Date(date).getDay()
      const weekendLift = weekday === 0 || weekday === 6 ? 1.45 : 1
      const wobble = 0.75 + ((index * 37) % 50) / 100

      return {
        date,
        revenue: Math.round(3_200_000 * weekendLift * wobble),
        orders: Math.round(14 * weekendLift * wobble),
      }
    })
  },

  lossReport(): LossRow[] {
    return [
      { productName: 'Dâu tây Đà Lạt hữu cơ', quantityLost: 4.5, valueLost: 382_500 },
      { productName: 'Việt quất Mỹ', quantityLost: 2, valueLost: 112_000 },
      { productName: 'Ha Giang orange', quantityLost: 12, valueLost: 340_000 },
      { productName: 'Hoa Loc mango', quantityLost: 6, valueLost: 699_000 },
    ]
  },

  topProducts(limit = 10): TopProductRow[] {
    return state.products.slice(0, limit).map((product, index) => ({
      productName: product.name,
      sku: state.variants.find((variant) => variant.productId === product.id)?.sku ?? '—',
      quantitySold: 120 - index * 11,
      revenue: (product.priceFrom ?? 100_000) * (120 - index * 11),
    }))
  },
}
