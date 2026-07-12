export const formatCurrency = (value) => Intl.NumberFormat().format(Number(value) || 0)

export const getDiscountedPrice = (price, discount) =>
  ((Number(price) || 0) * (100 - (Number(discount) || 0))) / 100
