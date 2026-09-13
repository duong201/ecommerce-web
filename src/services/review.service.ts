import type {
  FreshnessReportRow,
  ModerateReviewPayload,
  Paginated,
  Review,
  ReviewPayload,
  ReviewQuery,
  UUID,
} from '../interface'
import { mockStore } from './mock/store'
import http, { apiOnly, unwrapPage, withFallback } from './http'

export const reviewService = {
  listForProduct(productId: UUID, query: ReviewQuery = {}): Promise<Paginated<Review>> {
    return withFallback(
      () => http.get<Paginated<Review>>(`/reviews/product/${productId}`, { params: query }),
      () => mockStore.listProductReviews(productId, query.page, query.limit),
    )
  },

  listMine(): Promise<Review[]> {
    return withFallback(
      () => unwrapPage<Review>(() => http.get('/reviews/mine', { params: { limit: 100 } })),
      () => [],
    )
  },

  listForModeration(query: ReviewQuery = {}): Promise<Paginated<Review>> {
    return withFallback(
      () => http.get<Paginated<Review>>('/reviews/moderation', { params: query }),
      () => mockStore.listReviewsForModeration(query.status ?? 'pending'),
    )
  },

  freshnessReport(): Promise<FreshnessReportRow[]> {
    return withFallback(
      () => http.get<FreshnessReportRow[]>('/reviews/freshness-report'),
      () => [
        { productId: '', productName: 'Ha Giang orange', avgFreshness: 2.8, sampleSize: 14 },
        { productId: '', productName: 'Dâu tây Đà Lạt hữu cơ', avgFreshness: 4.1, sampleSize: 22 },
        { productId: '', productName: 'Hoa Loc mango', avgFreshness: 4.7, sampleSize: 31 },
      ],
    )
  },

  create(payload: ReviewPayload): Promise<Review> {
    return withFallback(
      () => http.post<Review>('/reviews', payload, { silentError: true }),
      () => mockStore.addReview(payload),
    )
  },

  update(id: UUID, payload: Partial<ReviewPayload>): Promise<Review> {
    return apiOnly(() => http.patch<Review>(`/reviews/${id}`, payload))
  },

  moderate(id: UUID, payload: ModerateReviewPayload): Promise<Review> {
    return withFallback(
      () => http.patch<Review>(`/reviews/${id}/moderate`, payload, { silentError: true }),
      () => mockStore.moderateReview(id, payload.status, payload.adminReply),
    )
  },

  remove(id: UUID): Promise<void> {
    return apiOnly(() => http.delete<void>(`/reviews/${id}`))
  },
}

export default reviewService
