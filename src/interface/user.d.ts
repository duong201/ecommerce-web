import type { PaginationQuery, RoleId, UUID } from './common'

export interface Role {
  id: RoleId
  code: string
  name: string
}

export interface User {
  id: UUID
  roleId: RoleId
  email: string | null
  phone: string | null
  fullName: string
  isActive: boolean
  createdAt?: string
  role?: Role
}

export interface Address {
  id: UUID
  userId: UUID
  recipientName: string
  phone: string
  line1: string
  ward: string | null
  district: string
  province: string
  deliveryNote: string | null
  isDefault: boolean
}

export type AddressPayload = Omit<Address, 'id' | 'userId' | 'isDefault'> & {
  isDefault?: boolean
}

export interface LoginPayload {
  identifier: string
  password: string
}

export interface RegisterPayload {
  email?: string
  phone?: string
  fullName: string
  password: string
}

export interface AuthSession {
  accessToken: string
  refreshToken: string
  expiresIn: number
  user: Pick<User, 'id' | 'fullName' | 'email' | 'phone' | 'roleId'>
}

export interface UserPayload {
  email?: string | null
  phone?: string | null
  fullName?: string
  password?: string
  roleId?: RoleId
  isActive?: boolean
}

export interface CreateStaffPayload {
  email?: string
  phone?: string
  fullName: string
  password: string
  roleId: RoleId
}

export interface UserQuery extends PaginationQuery {
  q?: string
  roleId?: RoleId
  isActive?: boolean
}
