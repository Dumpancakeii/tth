import { shopifyFetch } from './client';
import { COLLECTIONS_QUERY, COLLECTION_BY_HANDLE_QUERY } from './queries';
import type { Collection, ShopifyCollection } from '@/types/collection';

function normalizeCollection(node: ShopifyCollection): Collection {
  return {
    id: node.id,
    title: node.title,
    handle: node.handle,
    description: node.description || '',
    image: node.image?.url || null,
    productCount: node.products?.totalCount ?? node.products?.edges?.length ?? 0,
  };
}

interface CollectionsResponse {
  collections: {
    edges: Array<{ node: ShopifyCollection }>;
  };
}

export async function getCollections(first = 20): Promise<Collection[]> {
  const data = await shopifyFetch<CollectionsResponse>({
    query: COLLECTIONS_QUERY,
    variables: { first },
  });

  return data.collections.edges.map((edge) => normalizeCollection(edge.node));
}

interface CollectionByHandleResponse {
  collectionByHandle: ShopifyCollection | null;
}

export async function getCollectionByHandle(
  handle: string
): Promise<Collection | null> {
  const data = await shopifyFetch<CollectionByHandleResponse>({
    query: COLLECTION_BY_HANDLE_QUERY,
    variables: { handle, first: 50 },
  });

  if (!data.collectionByHandle) return null;

  return normalizeCollection(data.collectionByHandle);
}