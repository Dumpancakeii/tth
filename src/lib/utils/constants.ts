export const SHIPPING_THRESHOLD = 200;
export const SHIPPING_COST = 10;
export const FREE_SHIPPING_THRESHOLD = 100;

export const PRODUCTS_PER_PAGE = 12;
export const PRODUCTS_PER_ROW = 4;

export const SORT_OPTIONS = [
  { label: 'Latest', value: 'latest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Name: A-Z', value: 'name-asc' },
  { label: 'Name: Z-A', value: 'name-desc' },
] as const;