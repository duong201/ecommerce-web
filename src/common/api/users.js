import apiClient from './client'

export const getUsers = () => apiClient.get('/user')
export const getUser = (id) => apiClient.get(`/user/${id}`)
export const updateUser = (id, payload, config) => apiClient.put(`/user/${id}`, payload, config)
export const deleteUser = (id) => apiClient.delete(`/user/${id}`)
export const loginUser = (credentials, config) => apiClient.post('/user/login', credentials, config)
export const registerUser = (payload, config) => apiClient.post('/user/register', payload, config)
