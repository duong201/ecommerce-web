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
})
