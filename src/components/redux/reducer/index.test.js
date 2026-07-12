import rootReducers from './index'

describe('rootReducers', () => {
  it('exposes handleCart as a slice with its initial empty-array state', () => {
    const state = rootReducers(undefined, { type: '@@INIT' })
    expect(state).toEqual({ handleCart: [] })
  })
})
