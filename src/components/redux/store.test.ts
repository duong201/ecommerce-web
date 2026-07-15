import store from './store'

describe('redux store', () => {
  it('initializes with the expected shape', () => {
    expect(store.getState()).toEqual({ handleCart: [] })
  })

  it('exposes the standard redux store methods', () => {
    expect(typeof store.dispatch).toBe('function')
    expect(typeof store.subscribe).toBe('function')
    expect(typeof store.getState).toBe('function')
  })
})
