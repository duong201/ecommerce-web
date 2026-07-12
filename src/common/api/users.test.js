jest.mock('./client', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}))

import apiClient from './client'
import { getUsers, getUser, updateUser, deleteUser, loginUser, registerUser } from './users'

describe('users api', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('getUsers hits GET /user', () => {
    getUsers()
    expect(apiClient.get).toHaveBeenCalledWith('/user')
  })

  it('getUser hits GET /user/:id', () => {
    getUser(2)
    expect(apiClient.get).toHaveBeenCalledWith('/user/2')
  })

  it('updateUser hits PUT /user/:id with the payload', () => {
    const payload = { fullname: 'Nguyen Van A' }
    updateUser(2, payload)
    expect(apiClient.put).toHaveBeenCalledWith('/user/2', payload)
  })

  it('deleteUser hits DELETE /user/:id', () => {
    deleteUser(2)
    expect(apiClient.delete).toHaveBeenCalledWith('/user/2')
  })

  it('loginUser hits POST /user/login with credentials', () => {
    const credentials = { username: 'customer', password: 'customer123' }
    loginUser(credentials)
    expect(apiClient.post).toHaveBeenCalledWith('/user/login', credentials)
  })

  it('registerUser hits POST /user/register with the payload', () => {
    const payload = { username: 'new', password: 'pw', level: 1 }
    registerUser(payload)
    expect(apiClient.post).toHaveBeenCalledWith('/user/register', payload)
  })
})
