import type { PaginationQuery, ReviewStatus, UUID } from './common'
import type { Product } from './catalog'
import type { User } from './user'

export interface Review {
  id: UUID
  productId: UUID
  userId: UUID | null
  orderItemId: UUID | null
  rating: number
  freshnessRating: number | null
  content: string | null
  imageUrls: string[] | null
  status: ReviewStatus
  adminReply: string | null
  createdAt: string
  user?: Pick<User, 'id' | 'fullName'> | null
  product?: Pick<Product, 'id' | 'name' | 'slug'>
}

export interface ReviewPayload {
  productId: UUID
  orderItemId?: UUID
  rating: number
  freshnessRating?: number
  content?: string
  imageUrls?: string[]
}

export interface ModerateReviewPayload {
  status: Extract<ReviewStatus, 'approved' | 'rejected'>
  adminReply?: string
}

export interface ReviewQuery extends PaginationQuery {
  status?: ReviewStatus
}

export interface FreshnessReportRow {
  productId: UUID
  productName: string
  avgFreshness: number
  sampleSize: number
}
