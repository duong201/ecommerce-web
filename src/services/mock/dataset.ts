import type {
  Category,
  Coupon,
  DeliverySlot,
  InventoryBatch,
  Product,
  ProductImage,
  ProductVariant,
  Review,
  Supplier,
  User,
} from '../../interface'

const uid = (group: number, n: number): string =>
  `${String(group).padStart(8, '0')}-0000-4000-8000-${String(n).padStart(12, '0')}`

const GROUP = {
  USER: 1,
  CATEGORY: 2,
  SUPPLIER: 3,
  PRODUCT: 4,
  VARIANT: 5,
  IMAGE: 6,
  BATCH: 7,
  SLOT: 8,
  COUPON: 9,
  ORDER: 10,
  ORDER_ITEM: 11,
  REVIEW: 12,
}

export const day = (offset: number): string => {
  const date = new Date()
  date.setDate(date.getDate() + offset)
  return date.toISOString().slice(0, 10)
}

const iso = (dayOffset: number): string => {
  const date = new Date()
  date.setDate(date.getDate() + dayOffset)
  return date.toISOString()
}

const img = (photoId: string) => `https://images.unsplash.com/photo-${photoId}?w=800&q=80`

export const mockUsers: User[] = [
  {
    id: uid(GROUP.USER, 1),
    roleId: 3,
    email: 'admin@shop.vn',
    phone: '0900000001',
    fullName: 'Chủ shop',
    isActive: true,
    createdAt: iso(-120),
    role: { id: 3, code: 'admin', name: 'Quản trị viên' },
  },
  {
    id: uid(GROUP.USER, 2),
    roleId: 2,
    email: 'manager@shop.vn',
    phone: '0900000002',
    fullName: 'Quản lý cửa hàng',
    isActive: true,
    createdAt: iso(-90),
    role: { id: 2, code: 'manager', name: 'Quản lý cửa hàng' },
  },
  {
    id: uid(GROUP.USER, 3),
    roleId: 1,
    email: 'khach@shop.vn',
    phone: '0912345678',
    fullName: 'Nguyễn Văn A',
    isActive: true,
    createdAt: iso(-40),
    role: { id: 1, code: 'customer', name: 'Khách hàng' },
  },
  {
    id: uid(GROUP.USER, 4),
    roleId: 1,
    email: 'lan.tran@gmail.com',
    phone: '0987654321',
    fullName: 'Trần Thị Lan',
    isActive: true,
    createdAt: iso(-25),
    role: { id: 1, code: 'customer', name: 'Khách hàng' },
  },
  {
    id: uid(GROUP.USER, 5),
    roleId: 1,
    email: 'minh.pham@gmail.com',
    phone: '0938111222',
    fullName: 'Phạm Quang Minh',
    isActive: false,
    createdAt: iso(-15),
    role: { id: 1, code: 'customer', name: 'Khách hàng' },
  },
]

export const MOCK_PASSWORD = '123456'

export const mockCategories: Category[] = [
  {
    id: uid(GROUP.CATEGORY, 1),
    parentId: null,
    name: 'Trái cây trong nước',
    slug: 'trai-cay-trong-nuoc',
    imageUrl: img('1610832958506-aa56368176cf'),
    position: 1,
    isActive: true,
  },
  {
    id: uid(GROUP.CATEGORY, 2),
    parentId: null,
    name: 'Trái cây nhập khẩu',
    slug: 'trai-cay-nhap-khau',
    imageUrl: img('1568702846914-96b305d2aaeb'),
    position: 2,
    isActive: true,
  },
  {
    id: uid(GROUP.CATEGORY, 3),
    parentId: null,
    name: 'Combo & Giỏ quà',
    slug: 'combo-gio-qua',
    imageUrl: img('1610832958506-aa56368176cf'),
    position: 3,
    isActive: true,
  },
  {
    id: uid(GROUP.CATEGORY, 4),
    parentId: uid(GROUP.CATEGORY, 1),
    name: 'Cam quýt bưởi',
    slug: 'cam-quyt-buoi',
    imageUrl: null,
    position: 1,
    isActive: true,
  },
  {
    id: uid(GROUP.CATEGORY, 5),
    parentId: uid(GROUP.CATEGORY, 2),
    name: 'Berry nhập khẩu',
    slug: 'berry-nhap-khau',
    imageUrl: null,
    position: 1,
    isActive: true,
  },
]

export const mockSuppliers: Supplier[] = [
  {
    id: uid(GROUP.SUPPLIER, 1),
    code: 'NCC-001',
    name: 'HTX Xoài Cát Hòa Lộc',
    contactName: 'Trần Văn Bình',
    phone: '0273111222',
    province: 'Tiền Giang',
    certification: 'vietgap',
    certNumber: 'VG-2025-0142',
    certExpiry: day(300),
    note: null,
    isActive: true,
  },
  {
    id: uid(GROUP.SUPPLIER, 2),
    code: 'NCC-002',
    name: 'Nông trại Đà Lạt Farm',
    contactName: 'Lê Thị Cúc',
    phone: '0263333444',
    province: 'Lâm Đồng',
    certification: 'organic',
    certNumber: 'ORG-2025-0088',
    certExpiry: day(20),
    note: 'Chứng nhận hữu cơ sắp hết hạn, cần nhắc gia hạn.',
    isActive: true,
  },
  {
    id: uid(GROUP.SUPPLIER, 3),
    code: 'NCC-003',
    name: 'Công ty Nhập khẩu Hoa Quả Việt',
    contactName: 'Phạm Minh Đức',
    phone: '02838889999',
    province: 'TP Hồ Chí Minh',
    certification: 'globalgap',
    certNumber: 'GG-2025-1177',
    certExpiry: day(400),
    note: null,
    isActive: true,
  },
]

interface SeedVariant {
  sku: string
  name: string
  unitType: ProductVariant['unitType']
  packSize?: string
  isWeighted?: boolean
  stepQuantity?: string
  priceAmount: string
  compareAtAmount?: string
  onHand: number
}

interface SeedProduct {
  n: number
  categoryId: string
  supplierId: string
  name: string
  slug: string
  shortDescription: string
  description: string
  origin: string
  isOrganic?: boolean
  storageType?: Product['storageType']
  isFeatured?: boolean
  ratingAvg: string
  ratingCount: number
  photos: string[]
  variants: SeedVariant[]
}

const seedProducts: SeedProduct[] = [
  {
    n: 1,
    categoryId: uid(GROUP.CATEGORY, 1),
    supplierId: uid(GROUP.SUPPLIER, 1),
    name: 'Xoài cát Hòa Lộc',
    slug: 'xoai-cat-hoa-loc',
    shortDescription: 'Xoài cát Hòa Lộc chín cây, thịt vàng, ngọt đậm',
    description:
      'Xoài cát Hòa Lộc trồng theo tiêu chuẩn VietGAP tại Tiền Giang. Bảo quản nơi thoáng mát, dùng trong 4-5 ngày sau khi nhận. Chín tự nhiên, không dùng thuốc thúc chín.',
    origin: 'Tiền Giang',
    isFeatured: true,
    ratingAvg: '4.70',
    ratingCount: 23,
    photos: ['1553279768-865429fa0078', '1605027990121-cbae9e0642df'],
    variants: [
      {
        sku: 'XCH-1KG-L1',
        name: 'Hộp 1kg - Loại 1',
        unitType: 'box',
        packSize: '1.000',
        priceAmount: '185000',
        compareAtAmount: '220000',
        onHand: 42,
      },
      {
        sku: 'XCH-KG',
        name: 'Cân lẻ theo kg',
        unitType: 'kg',
        isWeighted: true,
        stepQuantity: '0.500',
        priceAmount: '165000',
        onHand: 30,
      },
    ],
  },
  {
    n: 2,
    categoryId: uid(GROUP.CATEGORY, 4),
    supplierId: uid(GROUP.SUPPLIER, 2),
    name: 'Cam sành Hà Giang',
    slug: 'cam-sanh-ha-giang',
    shortDescription: 'Cam sành mọng nước, vỏ xanh, vị chua ngọt cân bằng',
    description:
      'Cam sành thu hoạch đúng vụ, nhiều nước, thích hợp vắt nước ép. Bảo quản ngăn mát 7-10 ngày.',
    origin: 'Hà Giang',
    storageType: 'chilled',
    isFeatured: true,
    ratingAvg: '4.50',
    ratingCount: 41,
    photos: ['1611080626919-7cf5a9dbab5b', '1557800636-894a64c1696f'],
    variants: [
      {
        sku: 'CSH-KG',
        name: 'Cân lẻ theo kg',
        unitType: 'kg',
        isWeighted: true,
        stepQuantity: '0.500',
        priceAmount: '45000',
        onHand: 85,
      },
      {
        sku: 'CSH-3KG',
        name: 'Túi 3kg',
        unitType: 'box',
        packSize: '3.000',
        priceAmount: '125000',
        compareAtAmount: '135000',
        onHand: 24,
      },
    ],
  },
  {
    n: 3,
    categoryId: uid(GROUP.CATEGORY, 5),
    supplierId: uid(GROUP.SUPPLIER, 3),
    name: 'Việt quất Mỹ',
    slug: 'viet-quat-my',
    shortDescription: 'Blueberry nhập khẩu Mỹ, hộp 125g, giòn ngọt',
    description:
      'Việt quất tươi nhập khẩu đường hàng không, đạt chuẩn GlobalGAP. Giữ lạnh 2-4°C, dùng trong 5 ngày.',
    origin: 'Mỹ',
    storageType: 'chilled',
    isFeatured: true,
    ratingAvg: '4.80',
    ratingCount: 17,
    photos: ['1498557850523-fd3d118b962e', '1590005354167-6da97870c757'],
    variants: [
      {
        sku: 'VQM-125G',
        name: 'Hộp 125g',
        unitType: 'box',
        packSize: '0.125',
        priceAmount: '89000',
        compareAtAmount: '109000',
        onHand: 18,
      },
      {
        sku: 'VQM-500G',
        name: 'Khay 500g',
        unitType: 'tray',
        packSize: '0.500',
        priceAmount: '329000',
        onHand: 6,
      },
    ],
  },
  {
    n: 4,
    categoryId: uid(GROUP.CATEGORY, 1),
    supplierId: uid(GROUP.SUPPLIER, 2),
    name: 'Dâu tây Đà Lạt hữu cơ',
    slug: 'dau-tay-da-lat-huu-co',
    shortDescription: 'Dâu tây hữu cơ Đà Lạt, hái trong ngày',
    description:
      'Dâu tây canh tác hữu cơ tại Đà Lạt, không thuốc bảo vệ thực vật. Giữ lạnh, dùng trong 3 ngày để giữ độ tươi.',
    origin: 'Lâm Đồng',
    isOrganic: true,
    storageType: 'chilled',
    isFeatured: true,
    ratingAvg: '4.60',
    ratingCount: 33,
    photos: ['1464965911861-746a04b4bca6'],
    variants: [
      {
        sku: 'DTD-250G',
        name: 'Hộp 250g',
        unitType: 'box',
        packSize: '0.250',
        priceAmount: '135000',
        onHand: 22,
      },
      {
        sku: 'DTD-500G',
        name: 'Khay 500g',
        unitType: 'tray',
        packSize: '0.500',
        priceAmount: '249000',
        compareAtAmount: '270000',
        onHand: 9,
      },
    ],
  },
  {
    n: 5,
    categoryId: uid(GROUP.CATEGORY, 2),
    supplierId: uid(GROUP.SUPPLIER, 3),
    name: 'Táo Envy New Zealand',
    slug: 'tao-envy-new-zealand',
    shortDescription: 'Táo Envy size 80-90, giòn ngọt, để được lâu',
    description:
      'Táo Envy nhập khẩu New Zealand, thịt trắng chậm bị thâm khi cắt. Bảo quản ngăn mát tới 3 tuần.',
    origin: 'New Zealand',
    storageType: 'chilled',
    ratingAvg: '4.40',
    ratingCount: 12,
    photos: ['1568702846914-96b305d2aaeb'],
    variants: [
      {
        sku: 'TEN-KG',
        name: 'Cân lẻ theo kg',
        unitType: 'kg',
        isWeighted: true,
        stepQuantity: '0.500',
        priceAmount: '159000',
        onHand: 55,
      },
      {
        sku: 'TEN-6QUA',
        name: 'Vỉ 6 quả',
        unitType: 'piece',
        packSize: '6.000',
        priceAmount: '189000',
        onHand: 20,
      },
    ],
  },
  {
    n: 6,
    categoryId: uid(GROUP.CATEGORY, 1),
    supplierId: uid(GROUP.SUPPLIER, 1),
    name: 'Bưởi da xanh Bến Tre',
    slug: 'buoi-da-xanh-ben-tre',
    shortDescription: 'Bưởi da xanh ruột hồng, tép ráo, ngọt thanh',
    description:
      'Bưởi da xanh Bến Tre loại 1, trọng lượng 1.4-1.8kg/quả. Để nơi thoáng mát được 2 tuần.',
    origin: 'Bến Tre',
    ratingAvg: '4.30',
    ratingCount: 8,
    photos: ['1587049352846-4a222e784d38'],
    variants: [
      {
        sku: 'BDX-1QUA',
        name: '1 quả (1.4-1.8kg)',
        unitType: 'piece',
        packSize: '1.000',
        priceAmount: '95000',
        onHand: 0,
      },
    ],
  },
  {
    n: 7,
    categoryId: uid(GROUP.CATEGORY, 3),
    supplierId: uid(GROUP.SUPPLIER, 3),
    name: 'Giỏ quà trái cây cao cấp',
    slug: 'gio-qua-trai-cay-cao-cap',
    shortDescription: 'Giỏ quà 5 loại trái cây nhập khẩu, gói sẵn',
    description:
      'Giỏ quà gồm táo Envy, nho đen không hạt, lê Hàn, kiwi vàng và việt quất. Gói kèm thiệp, giao trong ngày.',
    origin: 'Nhiều nguồn',
    isFeatured: true,
    ratingAvg: '5.00',
    ratingCount: 5,
    photos: ['1610832958506-aa56368176cf'],
    variants: [
      {
        sku: 'GQ-CAOCAP',
        name: 'Giỏ tiêu chuẩn',
        unitType: 'combo',
        packSize: '1.000',
        priceAmount: '690000',
        compareAtAmount: '790000',
        onHand: 7,
      },
    ],
  },
  {
    n: 8,
    categoryId: uid(GROUP.CATEGORY, 4),
    supplierId: uid(GROUP.SUPPLIER, 2),
    name: 'Quýt đường Lai Vung',
    slug: 'quyt-duong-lai-vung',
    shortDescription: 'Quýt đường vỏ mỏng, ngọt đậm, dễ bóc',
    description: 'Quýt đường Lai Vung chính vụ, vỏ mỏng dễ bóc, ít hạt.',
    origin: 'Đồng Tháp',
    ratingAvg: '4.20',
    ratingCount: 19,
    photos: ['1611080626919-7cf5a9dbab5b'],
    variants: [
      {
        sku: 'QDL-KG',
        name: 'Cân lẻ theo kg',
        unitType: 'kg',
        isWeighted: true,
        stepQuantity: '0.500',
        priceAmount: '55000',
        onHand: 40,
      },
    ],
  },
]

export const mockImages: ProductImage[] = []
export const mockVariants: ProductVariant[] = []
export const mockBatches: InventoryBatch[] = []

let variantCounter = 0
let imageCounter = 0
let batchCounter = 0

export const mockProducts: Product[] = seedProducts.map((seed) => {
  const productId = uid(GROUP.PRODUCT, seed.n)

  const images = seed.photos.map((photo, position) => {
    imageCounter += 1
    const image: ProductImage = {
      id: uid(GROUP.IMAGE, imageCounter),
      productId,
      url: img(photo),
      altText: seed.name,
      position,
    }
    mockImages.push(image)
    return image
  })

  const variants = seed.variants.map((seedVariant, position) => {
    variantCounter += 1
    const variantId = uid(GROUP.VARIANT, variantCounter)

    const nearQuantity = Math.min(seedVariant.onHand, Math.round(seedVariant.onHand * 0.3))
    const farQuantity = seedVariant.onHand - nearQuantity
    const unitCost = Math.round(Number(seedVariant.priceAmount) * 0.63)

    if (seedVariant.onHand > 0) {
      batchCounter += 1
      mockBatches.push({
        id: uid(GROUP.BATCH, batchCounter),
        variantId,
        supplierId: seed.supplierId,
        batchCode: `LO-${seedVariant.sku}-A`,
        harvestDate: day(-3),
        receivedDate: day(-1),
        expiryDate: day(2),
        initialQuantity: String(nearQuantity),
        remainingQuantity: String(nearQuantity),
        unitCostAmount: String(unitCost),
        markdownPriceAmount: String(Math.round(Number(seedVariant.priceAmount) * 0.75)),
        status: 'active',
        note: 'Cận hạn, đang giảm giá',
      })

      batchCounter += 1
      mockBatches.push({
        id: uid(GROUP.BATCH, batchCounter),
        variantId,
        supplierId: seed.supplierId,
        batchCode: `LO-${seedVariant.sku}-B`,
        harvestDate: day(-1),
        receivedDate: day(0),
        expiryDate: day(seedVariant.isWeighted ? 5 : 9),
        initialQuantity: String(farQuantity),
        remainingQuantity: String(farQuantity),
        unitCostAmount: String(unitCost + 2000),
        markdownPriceAmount: null,
        status: 'active',
        note: null,
      })
    }

    const variant: ProductVariant = {
      id: variantId,
      productId,
      sku: seedVariant.sku,
      name: seedVariant.name,
      unitType: seedVariant.unitType,
      packSize: seedVariant.packSize ?? null,
      isWeighted: seedVariant.isWeighted ?? false,
      stepQuantity: seedVariant.stepQuantity ?? '1.000',
      priceAmount: seedVariant.priceAmount,
      compareAtAmount: seedVariant.compareAtAmount ?? null,
      position,
      isActive: true,
      inventoryLevel: {
        variantId,
        onHandQuantity: seedVariant.onHand,
        reservedQuantity: 0,
        availableQuantity: seedVariant.onHand,
      },
    }
    mockVariants.push(variant)
    return variant
  })

  const prices = variants.map((variant) => Number(variant.priceAmount))
  const compareAts = variants
    .map((variant) => Number(variant.compareAtAmount ?? 0))
    .filter((value) => value > 0)

  return {
    id: productId,
    categoryId: seed.categoryId,
    supplierId: seed.supplierId,
    name: seed.name,
    slug: seed.slug,
    shortDescription: seed.shortDescription,
    description: seed.description,
    origin: seed.origin,
    isOrganic: seed.isOrganic ?? false,
    storageType: seed.storageType ?? 'ambient',
    status: 'active',
    isFeatured: seed.isFeatured ?? false,
    ratingAvg: seed.ratingAvg,
    ratingCount: seed.ratingCount,
    createdAt: iso(-seed.n * 3),
    category: mockCategories.find((category) => category.id === seed.categoryId),
    supplier: mockSuppliers.find((supplier) => supplier.id === seed.supplierId),
    images,
    variants,
    priceFrom: prices.length ? Math.min(...prices) : null,
    compareAtFrom: compareAts.length ? Math.max(...compareAts) : null,
    availableQuantity: variants.reduce(
      (sum, variant) => sum + (variant.inventoryLevel?.availableQuantity ?? 0),
      0,
    ),
    coverImageUrl: images[0]?.url ?? null,
  }
})

const SLOT_WINDOWS: [string, string][] = [
  ['08:00:00', '11:00:00'],
  ['14:00:00', '17:00:00'],
  ['18:00:00', '20:00:00'],
]

const slotLabel = (start: string): string => {
  const hour = Number(start.slice(0, 2))
  return hour < 12 ? 'Sáng' : hour < 18 ? 'Chiều' : 'Tối'
}

export const mockDeliverySlots: DeliverySlot[] = Array.from({ length: 7 }).flatMap(
  (_unused, dayOffset) =>
    SLOT_WINDOWS.map(([startTime, endTime], windowIndex) => {
      const n = dayOffset * SLOT_WINDOWS.length + windowIndex + 1
      const bookedCount = dayOffset === 0 ? Math.min(windowIndex * 5, 14) : 0

      return {
        id: uid(GROUP.SLOT, n),
        slotDate: day(dayOffset),
        startTime,
        endTime,
        maxOrders: 15,
        bookedCount,
        isActive: true,
        label: `${slotLabel(startTime)} ${startTime.slice(0, 5)}–${endTime.slice(0, 5)}`,
        remaining: 15 - bookedCount,
      }
    }),
)

export const mockCoupons: Coupon[] = [
  {
    id: uid(GROUP.COUPON, 1),
    code: 'TRAICAY10',
    name: 'Giảm 10% cho đơn từ 200k',
    type: 'percentage',
    value: '10.00',
    maxDiscountAmount: '50000',
    minOrderAmount: '200000',
    usageLimit: 500,
    usageLimitPerUser: 3,
    usedCount: 128,
    startsAt: iso(-30),
    endsAt: iso(30),
    isActive: true,
  },
  {
    id: uid(GROUP.COUPON, 2),
    code: 'FREESHIP',
    name: 'Miễn phí giao hàng đơn từ 150k',
    type: 'free_delivery',
    value: '0.00',
    maxDiscountAmount: null,
    minOrderAmount: '150000',
    usageLimit: null,
    usageLimitPerUser: 5,
    usedCount: 342,
    startsAt: iso(-60),
    endsAt: null,
    isActive: true,
  },
  {
    id: uid(GROUP.COUPON, 3),
    code: 'CHAOBAN50K',
    name: 'Giảm 50.000đ cho khách mới',
    type: 'fixed_amount',
    value: '50000.00',
    maxDiscountAmount: null,
    minOrderAmount: '300000',
    usageLimit: 200,
    usageLimitPerUser: 1,
    usedCount: 61,
    startsAt: iso(-10),
    endsAt: iso(20),
    isActive: true,
  },
  {
    id: uid(GROUP.COUPON, 4),
    code: 'TET2026',
    name: 'Ưu đãi Tết đã kết thúc',
    type: 'percentage',
    value: '15.00',
    maxDiscountAmount: '100000',
    minOrderAmount: '500000',
    usageLimit: 300,
    usageLimitPerUser: 1,
    usedCount: 300,
    startsAt: iso(-120),
    endsAt: iso(-60),
    isActive: false,
  },
]

export const mockReviews: Review[] = [
  {
    id: uid(GROUP.REVIEW, 1),
    productId: mockProducts[0].id,
    userId: mockUsers[2].id,
    orderItemId: uid(GROUP.ORDER_ITEM, 1),
    rating: 5,
    freshnessRating: 5,
    content: 'Xoài chín tới, ngọt và thơm. Đóng gói cẩn thận, giao đúng khung giờ.',
    imageUrls: null,
    status: 'approved',
    adminReply: 'Cảm ơn anh đã ủng hộ cửa hàng ạ!',
    createdAt: iso(-6),
    user: { id: mockUsers[2].id, fullName: mockUsers[2].fullName },
    product: { id: mockProducts[0].id, name: mockProducts[0].name, slug: mockProducts[0].slug },
  },
  {
    id: uid(GROUP.REVIEW, 2),
    productId: mockProducts[0].id,
    userId: mockUsers[3].id,
    orderItemId: null,
    rating: 4,
    freshnessRating: 4,
    content: 'Ngon nhưng vài quả hơi mềm.',
    imageUrls: null,
    status: 'approved',
    adminReply: null,
    createdAt: iso(-3),
    user: { id: mockUsers[3].id, fullName: mockUsers[3].fullName },
    product: { id: mockProducts[0].id, name: mockProducts[0].name, slug: mockProducts[0].slug },
  },
  {
    id: uid(GROUP.REVIEW, 3),
    productId: mockProducts[1].id,
    userId: mockUsers[3].id,
    orderItemId: uid(GROUP.ORDER_ITEM, 2),
    rating: 3,
    freshnessRating: 2,
    content: 'Cam bị khô, không mọng nước như lần trước.',
    imageUrls: null,
    status: 'pending',
    adminReply: null,
    createdAt: iso(-1),
    user: { id: mockUsers[3].id, fullName: mockUsers[3].fullName },
    product: { id: mockProducts[1].id, name: mockProducts[1].name, slug: mockProducts[1].slug },
  },
  {
    id: uid(GROUP.REVIEW, 4),
    productId: mockProducts[3].id,
    userId: mockUsers[2].id,
    orderItemId: null,
    rating: 5,
    freshnessRating: 5,
    content: 'Dâu rất tươi, con mình rất thích.',
    imageUrls: null,
    status: 'pending',
    adminReply: null,
    createdAt: iso(0),
    user: { id: mockUsers[2].id, fullName: mockUsers[2].fullName },
    product: { id: mockProducts[3].id, name: mockProducts[3].name, slug: mockProducts[3].slug },
  },
]

export const ID_GROUPS = GROUP
export const nextId = uid
