import {
  getCurrentUserId,
  getCurrentUserName,
  getCurrentAdminId,
  getCurrentAdminName,
  setUserSession,
  setAdminSession,
  clearUserSession,
  clearAdminSession,
} from './session'

describe('session utils', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('setUserSession stores id and name under the user keys', () => {
    setUserSession('7', 'duong')
    expect(sessionStorage.getItem('id')).toBe('7')
    expect(sessionStorage.getItem('name')).toBe('duong')
    expect(getCurrentUserId()).toBe('7')
    expect(getCurrentUserName()).toBe('duong')
  })

  it('setAdminSession stores id and name under the admin keys', () => {
    setAdminSession('1', 'admin')
    expect(sessionStorage.getItem('idAdmin')).toBe('1')
    expect(sessionStorage.getItem('adminName')).toBe('admin')
    expect(getCurrentAdminId()).toBe('1')
    expect(getCurrentAdminName()).toBe('admin')
  })

  it('clearUserSession only removes user keys', () => {
    setUserSession('7', 'duong')
    setAdminSession('1', 'admin')
    clearUserSession()
    expect(getCurrentUserId()).toBeNull()
    expect(getCurrentUserName()).toBeNull()
    expect(getCurrentAdminId()).toBe('1')
    expect(getCurrentAdminName()).toBe('admin')
  })

  it('clearAdminSession only removes admin keys', () => {
    setUserSession('7', 'duong')
    setAdminSession('1', 'admin')
    clearAdminSession()
    expect(getCurrentAdminId()).toBeNull()
    expect(getCurrentAdminName()).toBeNull()
    expect(getCurrentUserId()).toBe('7')
    expect(getCurrentUserName()).toBe('duong')
  })

  it('getters return null when nothing has been set', () => {
    expect(getCurrentUserId()).toBeNull()
    expect(getCurrentAdminId()).toBeNull()
  })
})
