import { formatCurrency, getDiscountedPrice } from './format'

describe('formatCurrency', () => {
  it('formats a number using locale grouping', () => {
    expect(formatCurrency(150000)).toBe(Intl.NumberFormat().format(150000))
  })

  it('falls back to 0 for undefined', () => {
    expect(formatCurrency(undefined)).toBe(Intl.NumberFormat().format(0))
  })

  it('falls back to 0 for null', () => {
    expect(formatCurrency(null)).toBe(Intl.NumberFormat().format(0))
  })

  it('falls back to 0 for non-numeric strings', () => {
    expect(formatCurrency('abc')).toBe(Intl.NumberFormat().format(0))
  })

  it('coerces numeric strings', () => {
    expect(formatCurrency('42000')).toBe(Intl.NumberFormat().format(42000))
  })
})

describe('getDiscountedPrice', () => {
  it('applies a percentage discount', () => {
    expect(getDiscountedPrice(100000, 10)).toBe(90000)
  })

  it('returns the full price when discount is 0', () => {
    expect(getDiscountedPrice(50000, 0)).toBe(50000)
  })

  it('treats missing discount as 0', () => {
    expect(getDiscountedPrice(50000, undefined)).toBe(50000)
  })

  it('treats missing price as 0', () => {
    expect(getDiscountedPrice(undefined, 10)).toBe(0)
  })

  it('handles a 100% discount', () => {
    expect(getDiscountedPrice(50000, 100)).toBe(0)
  })
})
