export interface Review {
  id: number
  idproduct: number
  iduser: string
  userName: string
  rating: number
  comment?: string
  createdAt: string
}

export type AddReviewPayload = Omit<Review, 'id' | 'createdAt'>

export interface AddReviewResponse {
  review: Review
}
