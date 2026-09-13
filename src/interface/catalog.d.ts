import type {
  Amount,
  Certification,
  PaginationQuery,
  ProductStatus,
  Quantity,
  StorageType,
  UUID,
  UnitType,
} from './common'

export interface Category {
  id: UUID
  parentId: UUID | null
  name: string
  slug: string
  imageUrl: string | null
  position: number
  isActive: boolean
  children?: Category[]
}

export interface Supplier {
  id: UUID
  code: string
  name: string
  contactName: string | null
  phone: string | null
  province: string | null
  certification: Certification | null
  certNumber: string | null
  certExpiry: string | null
  note: string | null
  isActive: boolean
}

export interface ProductImage {
  id: UUID
  productId: UUID
  url: string
  altText: string | null
  position: number
}

export interface InventoryLevel {
  variantId: UUID
  onHandQuantity: Quantity
  reservedQuantity: Quantity
  availableQuantity: Quantity
}

export interface ProductVariant {
  id: UUID
  productId: UUID
  sku: string
  name: string
  unitType: UnitType
  packSize: string | null
  isWeighted: boolean
  stepQuantity: string
  priceAmount: string
  compareAtAmount: string | null
  position: number
  isActive: boolean
  inventoryLevel?: InventoryLevel
}

export interface Product {
  id: UUID
  categoryId: UUID
  supplierId: UUID | null
  name: string
  slug: string
  shortDescription: string | null
  description: string | null
  origin: string | null
  isOrganic: boolean
  storageType: StorageType
  status: ProductStatus
  isFeatured: boolean
  ratingAvg: string
  ratingCount: number
  createdAt?: string
  category?: Category
  supplier?: Supplier
  images?: ProductImage[]
  variants?: ProductVariant[]
  priceFrom: Amount | null
  compareAtFrom: Amount | null
  availableQuantity: Quantity
  coverImageUrl: string | null
}

export type ProductSort = 'newest' | 'price_asc' | 'price_desc' | 'rating' | 'name'

export interface ProductQuery extends PaginationQuery {
  q?: string
  categoryId?: UUID
  supplierId?: UUID
  status?: ProductStatus
  storageType?: StorageType
  isFeatured?: boolean
  isOrganic?: boolean
  inStock?: boolean
  minPrice?: number
  maxPrice?: number
  sort?: ProductSort
}

export interface VariantPayload {
  sku: string
  name: string
  unitType: UnitType
  packSize?: number
  isWeighted?: boolean
  stepQuantity?: number
  priceAmount: number
  compareAtAmount?: number | null
  position?: number
  isActive?: boolean
}

export interface ProductImagePayload {
  url: string
  altText?: string
  position?: number
}

export interface ProductPayload {
  categoryId: UUID
  supplierId?: UUID | null
  name: string
  slug?: string
  shortDescription?: string
  description?: string
  origin?: string
  isOrganic?: boolean
  storageType?: StorageType
  status?: ProductStatus
  isFeatured?: boolean
  images?: ProductImagePayload[]
  variants?: VariantPayload[]
}

export interface CategoryPayload {
  parentId?: UUID | null
  name: string
  slug?: string
  imageUrl?: string
  position?: number
  isActive?: boolean
}

export interface SupplierPayload {
  code: string
  name: string
  contactName?: string
  phone?: string
  province?: string
  certification?: Certification
  certNumber?: string
  certExpiry?: string
  note?: string
  isActive?: boolean
}
