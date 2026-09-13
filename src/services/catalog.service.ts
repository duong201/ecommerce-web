import type {
  Category,
  CategoryPayload,
  Paginated,
  Product,
  ProductImage,
  ProductImagePayload,
  ProductPayload,
  ProductQuery,
  ProductVariant,
  Supplier,
  SupplierPayload,
  UUID,
  VariantPayload,
} from '../interface'
import { mockStore } from './mock/store'
import { params } from './queryParams'
import http, { unwrapPage, withFallback } from './http'

export const productService = {
  list(query: ProductQuery = {}): Promise<Paginated<Product>> {
    return withFallback(
      () => http.get<Paginated<Product>>('/products', { params: params(query) }),
      () => mockStore.listProducts(query),
    )
  },

  listForAdmin(query: ProductQuery = {}): Promise<Paginated<Product>> {
    return withFallback(
      () => http.get<Paginated<Product>>('/products/admin', { params: params(query) }),
      () => mockStore.listProductsForAdmin(query),
    )
  },

  get(idOrSlug: string): Promise<Product> {
    return withFallback(
      () => http.get<Product>(`/products/${idOrSlug}`),
      () => mockStore.getProduct(idOrSlug),
    )
  },

  featured(limit = 8): Promise<Product[]> {
    return this.list({ isFeatured: true, limit, sort: 'rating' }).then((page) => page.data)
  },

  create(payload: ProductPayload): Promise<Product> {
    return http.post<Product>('/products', payload).then((res) => res.data)
  },

  update(id: UUID, payload: Partial<ProductPayload>): Promise<Product> {
    return http.patch<Product>(`/products/${id}`, payload).then((res) => res.data)
  },

  remove(id: UUID): Promise<void> {
    return http.delete(`/products/${id}`).then(() => undefined)
  },

  restore(id: UUID): Promise<Product> {
    return http.post<Product>(`/products/${id}/restore`).then((res) => res.data)
  },

  addImage(productId: UUID, payload: ProductImagePayload): Promise<ProductImage> {
    return http.post<ProductImage>(`/products/${productId}/images`, payload).then((res) => res.data)
  },

  removeImage(imageId: UUID): Promise<void> {
    return http.delete(`/products/images/${imageId}`).then(() => undefined)
  },

  reorderImages(productId: UUID, imageIds: UUID[]): Promise<ProductImage[]> {
    return http
      .patch<ProductImage[]>(`/products/${productId}/images/order`, { imageIds })
      .then((res) => res.data)
  },
}

export const variantService = {
  listByProduct(productId: UUID): Promise<ProductVariant[]> {
    return withFallback(
      () => http.get<ProductVariant[]>(`/products/${productId}/variants`),
      () => mockStore.getProduct(productId).variants ?? [],
    )
  },

  get(id: UUID): Promise<ProductVariant> {
    return withFallback(
      () => http.get<ProductVariant>(`/variants/${id}`),
      () => {
        const variant = mockStore.getVariant(id)
        if (!variant) throw new Error('Variant not found')
        return variant
      },
    )
  },

  create(productId: UUID, payload: VariantPayload): Promise<ProductVariant> {
    return http
      .post<ProductVariant>(`/products/${productId}/variants`, payload)
      .then((res) => res.data)
  },

  update(id: UUID, payload: Partial<VariantPayload>): Promise<ProductVariant> {
    return http.patch<ProductVariant>(`/variants/${id}`, payload).then((res) => res.data)
  },

  remove(id: UUID): Promise<void> {
    return http.delete(`/variants/${id}`).then(() => undefined)
  },
}

export const categoryService = {
  list(onlyActive = true): Promise<Category[]> {
    return withFallback(
      () =>
        unwrapPage<Category>(() => http.get('/categories', { params: { onlyActive, limit: 100 } })),
      () => mockStore.listCategories(),
    )
  },

  tree(onlyActive = true): Promise<Category[]> {
    return withFallback(
      () =>
        unwrapPage<Category>(() =>
          http.get('/categories/tree', { params: { onlyActive, limit: 100 } }),
        ),
      () => mockStore.listCategoryTree(),
    )
  },

  create(payload: CategoryPayload): Promise<Category> {
    return http.post<Category>('/categories', payload).then((res) => res.data)
  },

  update(id: UUID, payload: Partial<CategoryPayload>): Promise<Category> {
    return http.patch<Category>(`/categories/${id}`, payload).then((res) => res.data)
  },

  remove(id: UUID): Promise<void> {
    return http.delete(`/categories/${id}`).then(() => undefined)
  },
}

export const supplierService = {
  list(onlyActive = false): Promise<Supplier[]> {
    return withFallback(
      () =>
        unwrapPage<Supplier>(() => http.get('/suppliers', { params: { onlyActive, limit: 100 } })),
      () => mockStore.listSuppliers(),
    )
  },

  expiringCertificates(withinDays = 30): Promise<Supplier[]> {
    return withFallback(
      () =>
        unwrapPage<Supplier>(() =>
          http.get('/suppliers/expiring-certificates', { params: { withinDays, limit: 100 } }),
        ),
      () =>
        mockStore
          .listSuppliers()
          .filter(
            (supplier) =>
              supplier.certExpiry !== null &&
              new Date(supplier.certExpiry).getTime() <=
                Date.now() + withinDays * 24 * 60 * 60 * 1000,
          ),
    )
  },

  create(payload: SupplierPayload): Promise<Supplier> {
    return http.post<Supplier>('/suppliers', payload).then((res) => res.data)
  },

  update(id: UUID, payload: Partial<SupplierPayload>): Promise<Supplier> {
    return http.patch<Supplier>(`/suppliers/${id}`, payload).then((res) => res.data)
  },

  remove(id: UUID): Promise<void> {
    return http.delete(`/suppliers/${id}`).then(() => undefined)
  },
}
