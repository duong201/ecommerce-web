import { AxiosRequestConfig } from 'axios'
import apiClient from './client'
import type {
  User,
  UserPayload,
  LoginPayload,
  LoginResponse,
  UserMutationResponse,
} from '../../interface'

export const getUsers = () => apiClient.get<User[]>('/user')
export const getUser = (id: number | string) => apiClient.get<User>(`/user/${id}`)
export const updateUser = (
  id: number | string,
  payload: UserPayload,
  config?: AxiosRequestConfig,
) => apiClient.put<UserMutationResponse>(`/user/${id}`, payload, config)
export const deleteUser = (id: number | string) => apiClient.delete(`/user/${id}`)
export const loginUser = (credentials: LoginPayload, config?: AxiosRequestConfig) =>
  apiClient.post<LoginResponse>('/user/login', credentials, config)
export const registerUser = (payload: UserPayload, config?: AxiosRequestConfig) =>
  apiClient.post<UserMutationResponse>('/user/register', payload, config)
