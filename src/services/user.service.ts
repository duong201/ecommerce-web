import type {
  Address,
  AddressPayload,
  CreateStaffPayload,
  Paginated,
  Role,
  UUID,
  User,
  UserPayload,
  UserQuery,
} from '../interface'
import { updateStoredUser } from '../common/utils/session'
import { mockStore } from './mock/store'
import { params } from './queryParams'
import http, { apiOnly, unwrapPage, withFallback } from './http'

export const userService = {
  list(query: UserQuery = {}): Promise<Paginated<User>> {
    return withFallback(
      () => http.get<Paginated<User>>('/users', { params: params(query) }),
      () => mockStore.listUsers(query.page, query.limit),
    )
  },

  get(id: UUID): Promise<User> {
    return withFallback(
      () => http.get<User>(`/users/${id}`),
      () => mockStore.getUser(id),
    )
  },

  me(): Promise<User> {
    return withFallback(
      () => http.get<User>('/users/me'),
      () => mockStore.listUsers().data[2],
    )
  },

  listRoles(): Promise<Role[]> {
    return withFallback(
      () => http.get<Role[]>('/users/roles'),
      () => [
        { id: 1, code: 'customer', name: 'Customer' },
        { id: 2, code: 'manager', name: 'Store manager' },
        { id: 3, code: 'admin', name: 'Administrator' },
      ],
    )
  },

  async updateMe(payload: UserPayload): Promise<User> {
    const user = await apiOnly(() => http.patch<User>('/users/me', payload))
    updateStoredUser(user)
    return user
  },

  update(id: UUID, payload: UserPayload): Promise<User> {
    return apiOnly(() => http.patch<User>(`/users/${id}`, payload))
  },

  createStaff(payload: CreateStaffPayload): Promise<User> {
    return apiOnly(() => http.post<User>('/users', payload))
  },

  remove(id: UUID): Promise<void> {
    return apiOnly(() => http.delete<void>(`/users/${id}`))
  },
}

export const addressService = {
  list(): Promise<Address[]> {
    return withFallback(
      () => unwrapPage<Address>(() => http.get('/addresses', { params: { limit: 100 } })),
      () => [],
    )
  },

  create(payload: AddressPayload): Promise<Address> {
    return apiOnly(() => http.post<Address>('/addresses', payload))
  },

  update(id: UUID, payload: Partial<AddressPayload>): Promise<Address> {
    return apiOnly(() => http.patch<Address>(`/addresses/${id}`, payload))
  },

  setDefault(id: UUID): Promise<Address> {
    return apiOnly(() => http.patch<Address>(`/addresses/${id}/default`))
  },

  remove(id: UUID): Promise<void> {
    return apiOnly(() => http.delete<void>(`/addresses/${id}`))
  },
}
