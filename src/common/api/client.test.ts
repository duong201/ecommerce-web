describe('apiClient', () => {
  const originalEnv = process.env.REACT_APP_API_URL

  afterEach(() => {
    process.env.REACT_APP_API_URL = originalEnv
    jest.resetModules()
  })

  it('defaults to localhost:8801 when no env override is set', () => {
    delete process.env.REACT_APP_API_URL
    jest.resetModules()
    const apiClient = require('./client').default
    expect(apiClient.defaults.baseURL).toBe('http://localhost:8801')
  })

  it('honors REACT_APP_API_URL when set', () => {
    process.env.REACT_APP_API_URL = 'https://api.example.com'
    jest.resetModules()
    const apiClient = require('./client').default
    expect(apiClient.defaults.baseURL).toBe('https://api.example.com')
  })

  describe('response interceptor', () => {
    it('attaches a friendly message and shows a toast by default on error', async () => {
      jest.resetModules()
      jest.doMock('../utils/toast', () => ({ toast: { error: jest.fn() } }))
      const { toast } = require('../utils/toast')
      const apiClient = require('./client').default
      const rejectedHandler = apiClient.interceptors.response.handlers[0].rejected

      const error: {
        response: { status: number; data: object }
        config: object
        friendlyMessage?: string
      } = {
        response: { status: 404, data: {} },
        config: {},
      }
      await expect(rejectedHandler(error)).rejects.toBe(error)
      expect(error.friendlyMessage).toBe('Không tìm thấy dữ liệu yêu cầu.')
      expect(toast.error).toHaveBeenCalledWith('Không tìm thấy dữ liệu yêu cầu.')

      jest.dontMock('../utils/toast')
    })

    it('suppresses the toast when the request config sets silentError', async () => {
      jest.resetModules()
      jest.doMock('../utils/toast', () => ({ toast: { error: jest.fn() } }))
      const { toast } = require('../utils/toast')
      const apiClient = require('./client').default
      const rejectedHandler = apiClient.interceptors.response.handlers[0].rejected

      const error = { response: { status: 404, data: {} }, config: { silentError: true } }
      await expect(rejectedHandler(error)).rejects.toBe(error)
      expect(toast.error).not.toHaveBeenCalled()

      jest.dontMock('../utils/toast')
    })
  })
})
