export interface Product {
  id: number
  name: string
  imgPrimary: string
  productImage?: string
  price: number
  discount: number
  sold: number
  amount: number
  idcategorize: number
  createdAt?: string
}

export interface Category {
  id: number
  categorize: string
}

export type ProductPayload = Partial<Product>
