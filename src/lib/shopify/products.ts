import { shopifyFetch } from './client';
import { PRODUCTS_QUERY, PRODUCT_BY_HANDLE_QUERY } from './queries';
import type { Product, ShopifyProduct } from '@/types/product';

function normalizeProduct(node: ShopifyProduct): Product {
  const images = node.images.edges.map((e) => e.node.url);
  const hoverImage = images.length > 1 ? images[1] : images[0];

  return {
    id: node.id,
    title: node.title,
    slug: node.handle,
    handle: node.handle,
    description: node.description,
    price: node.priceRange.minVariantPrice.amount,
    images,
    hoverImage,
    available: node.availableForSale,
    soldOut: !node.availableForSale,
    variants: node.variants.edges.map((e) => ({
      id: e.node.id,
      title: e.node.title,
      price: e.node.price.amount,
      available: e.node.availableForSale,
    })),
    compareAtPrice: undefined,
  };
}

interface ProductsResponse {
  products: {
    edges: Array<{ node: ShopifyProduct }>;
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
  };
}

export async function getProducts(first = 12): Promise<Product[]> {
  const data = await shopifyFetch<ProductsResponse>({
    query: PRODUCTS_QUERY,
    variables: { first },
  });

  return data.products.edges.map((edge) => normalizeProduct(edge.node));
}

interface ProductByHandleResponse {
  productByHandle: ShopifyProduct | null;
}

export async function getProductByHandle(
  handle: string
): Promise<Product | null> {
  const data = await shopifyFetch<ProductByHandleResponse>({
    query: PRODUCT_BY_HANDLE_QUERY,
    variables: { handle },
  });

  if (!data.productByHandle) return null;

  return normalizeProduct(data.productByHandle);
}