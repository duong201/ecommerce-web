export const formatCurrency = (value?: number | string | null): string =>
  Intl.NumberFormat().format(Number(value) || 0)

export const getDiscountedPrice = (
  price?: number | string | null,
  discount?: number | string | null,
): number => ((Number(price) || 0) * (100 - (Number(discount) || 0))) / 100
