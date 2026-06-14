export interface ShopifyCollection {
  id: string;
  title: string;
  handle: string;
  description: string | null;
  image: {
    url: string;
    altText: string | null;
  } | null;
  products: {
    totalCount?: number;
    edges: Array<{
      node: {
        id: string;
        title: string;
        handle: string;
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
      };
    }>;
  };
}

export interface Collection {
  id: string;
  title: string;
  handle: string;
  description: string;
  image: string | null;
  productCount: number;
}