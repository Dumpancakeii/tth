/**
 * Shopify Storefront API client
 * 
 * Setup:
 * 1. Create a Shopify store
 * 2. Go to Admin → Store → Sales channels → Custom storefront
 * 3. Create a storefront API key
 * 4. Add to .env.local:
 *    SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
 *    SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-token
 */

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || '';
const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '';

const STOREFRONT_API_URL = `https://${domain}/api/2024-01/graphql.json`;

interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  availableForSale: boolean;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string | null;
      };
    }>;
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        availableForSale: boolean;
        price: {
          amount: string;
          currencyCode: string;
        };
      };
    }>;
  };
}

const PRODUCTS_QUERY = `
  query Products {
    products(first: 100) {
      edges {
        node {
          id
          title
          handle
          description
          availableForSale
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 10) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                availableForSale
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
`;

const SINGLE_PRODUCT_QUERY = `
  query Product($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      handle
      description
      availableForSale
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 10) {
        edges {
          node {
            id
            title
            availableForSale
            price {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

const CART_CREATE_QUERY = `
  mutation CartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        totalQuantity
      }
    }
  }
`;

async function shopifyFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  if (!domain || !token) {
    // Return mock data for development when no Shopify credentials
    return null as T;
  }

  const response = await fetch(STOREFRONT_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
  });

  const { data } = await response.json();
  return data;
}

export async function getProducts(): Promise<ShopifyProduct[]> {
  if (!domain || !token) return [];

  const data = await shopifyFetch<{ products: { edges: Array<{ node: ShopifyProduct }> } }>(
    PRODUCTS_QUERY
  );

  if (!data) return [];
  return data.products.edges.map((edge) => edge.node);
}

export async function getProduct(handle: string): Promise<ShopifyProduct | null> {
  if (!domain || !token) return null;

  const data = await shopifyFetch<{ productByHandle: ShopifyProduct | null }>(
    SINGLE_PRODUCT_QUERY,
    { handle }
  );

  if (!data) return null;
  return data.productByHandle;
}

export async function createCart(variantId: string, quantity: number = 1) {
  if (!domain || !token) return null;

  const data = await shopifyFetch<{ cartCreate: { cart: { id: string; checkoutUrl: string; totalQuantity: number } } }>(
    CART_CREATE_QUERY,
    {
      input: {
        lines: [
          {
            merchandiseId: variantId,
            quantity,
          },
        ],
      },
    }
  );

  if (!data) return null;
  return data.cartCreate.cart;
}

// Fallback product data for when Shopify is not connected
export const FALLBACK_PRODUCTS = [
  {
    slug: 'raw-hoodie',
    title: 'Raw Hoodie',
    price: '$88',
    soldOut: true,
  },
  {
    slug: 'boxy-tee',
    title: 'Boxy Tee',
    price: '$48',
    soldOut: false,
  },
  {
    slug: 'cropped-denim',
    title: 'Cropped Denim',
    price: '$120',
    soldOut: false,
  },
  {
    slug: '5-panel-cap',
    title: '5-Panel Cap',
    price: '$42',
    soldOut: false,
  },
  {
    slug: 'heavy-sweater',
    title: 'Heavy Sweater',
    price: '$96',
    soldOut: false,
  },
  {
    slug: 'tote-bag',
    title: 'Tote Bag',
    price: '$24',
    soldOut: false,
  },
  {
    slug: 'crewneck',
    title: 'Crewneck',
    price: '$76',
    soldOut: false,
  },
  {
    slug: 'cargo-pant',
    title: 'Cargo Pant',
    price: '$110',
    soldOut: false,
  },
];