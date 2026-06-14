export interface ShopifyProduct {
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

export interface Product {
  id: string;
  title: string;
  slug: string;
  handle: string;
  description: string;
  price: string;
  compareAtPrice?: string;
  images: string[];
  hoverImage?: string;
  available: boolean;
  soldOut: boolean;
  variants: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  title: string;
  price: string;
  available: boolean;
}