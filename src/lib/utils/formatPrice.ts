export function formatPrice(amount: string, currencyCode: string = 'EUR'): string {
  const price = parseFloat(amount);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatPriceSimple(amount: string, currencyCode: string = 'EUR'): string {
  const price = parseFloat(amount);
  const symbol = currencyCode === 'EUR' ? '€' : '$';
  return `${symbol}${price}`;
}
