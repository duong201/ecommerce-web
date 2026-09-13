import type { AuthSession, LoginPayload, RegisterPayload, User } from '../interface'
import { clearSession, getRefreshToken, saveSession } from '../common/utils/session'
import { MOCK_PASSWORD } from './mock/dataset'
import { mockStore } from './mock/store'
import http, { withFallback } from './http'

const mockLogin = (payload: LoginPayload): AuthSession => {
  const user = mockStore.findUserByIdentifier(payload.identifier)
  if (!user || payload.password !== MOCK_PASSWORD) {
    throw new Error(`Invalid credentials (offline mode uses password ${MOCK_PASSWORD})`)
  }

  return {
    accessToken: `mock-access-${user.id}`,
    refreshToken: `mock-refresh-${user.id}`,
    expiresIn: 86_400,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      roleId: user.roleId,
    },
  }
}

export const authService = {
  async login(payload: LoginPayload): Promise<AuthSession> {
    const session = await withFallback(
      () => http.post<AuthSession>('/auth/login', payload, { silentError: true }),
      () => mockLogin(payload),
    )
    saveSession(session)
    return session
  },

  async register(payload: RegisterPayload): Promise<AuthSession> {
    const session = await withFallback(
      () => http.post<AuthSession>('/auth/register', payload, { silentError: true }),
      () => {
        throw new Error('Cannot register while the server is unreachable.')
      },
    )
    saveSession(session)
    return session
  },

  async logout(): Promise<void> {
    const refreshToken = getRefreshToken()
    try {
      if (refreshToken) {
        await http.post('/auth/logout', { refreshToken }, { silentError: true })
      }
    } catch {
    } finally {
      clearSession()
    }
  },

  me(): Promise<User> {
    return withFallback(
      () => http.get<User>('/auth/me'),
      () => mockStore.listUsers().data[0],
    )
  },
}

export default authService
