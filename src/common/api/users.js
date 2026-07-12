import apiClient from './client'

export const getUsers = () => apiClient.get('/user')
export const getUser = (id) => apiClient.get(`/user/${id}`)
export const updateUser = (id, payload) => apiClient.put(`/user/${id}`, payload)
export const deleteUser = (id) => apiClient.delete(`/user/${id}`)
export const loginUser = (credentials) => apiClient.post('/user/login', credentials)
export const registerUser = (payload) => apiClient.post('/user/register', payload)
