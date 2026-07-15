export interface User {
  id: number
  fullname: string
  age?: number
  phone: string
  email: string
  address: string
  username: string
  password: string
  country: string
  level: number
}

export type UserPayload = Partial<Omit<User, 'id'>>

export interface LoginPayload {
  username: string
  password: string
}

export interface LoginResponse {
  status: string
  message?: string
  code?: string
  result: User[]
}

// `status` is `'success'` or `'error'`; `code`/`message` are only present on the error path.
export interface UserMutationResponse {
  status: string
  code?: string
  message?: string
}
