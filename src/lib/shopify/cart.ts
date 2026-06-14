import { shopifyFetch } from './client';
import {
  CREATE_CART_MUTATION,
  ADD_TO_CART_MUTATION,
  REMOVE_FROM_CART_MUTATION,
  UPDATE_CART_MUTATION,
} from './mutations';
import { CART_QUERY } from './queries';

interface CartLineInput {
  merchandiseId: string;
  quantity: number;
}

interface CartResponse {
  cartCreate?: {
    cart: {
      id: string;
      checkoutUrl: string;
      totalQuantity: number;
    };
  };
  cartLinesAdd?: {
    cart: {
      id: string;
      totalQuantity: number;
    };
  };
  cartLinesRemove?: {
    cart: {
      id: string;
      totalQuantity: number;
    };
  };
  cartLinesUpdate?: {
    cart: {
      id: string;
      totalQuantity: number;
    };
  };
}

export async function createCart(
  lines?: CartLineInput[]
): Promise<{ id: string; checkoutUrl: string }> {
  const data = await shopifyFetch<CartResponse>({
    query: CREATE_CART_MUTATION,
    variables: {
      input: {
        lines: lines?.map((l) => ({
          merchandiseId: l.merchandiseId,
          quantity: l.quantity,
        })),
      },
    },
  });

  const cart = data.cartCreate?.cart;
  if (!cart) throw new Error('Failed to create cart');

  return { id: cart.id, checkoutUrl: cart.checkoutUrl };
}

export async function addToCart(cartId: string, lines: CartLineInput[]) {
  const data = await shopifyFetch<CartResponse>({
    query: ADD_TO_CART_MUTATION,
    variables: { cartId, lines },
  });

  return data.cartLinesAdd?.cart;
}

export async function removeFromCart(cartId: string, lineIds: string[]) {
  const data = await shopifyFetch<CartResponse>({
    query: REMOVE_FROM_CART_MUTATION,
    variables: { cartId, lineIds },
  });

  return data.cartLinesRemove?.cart;
}

export async function updateCart(cartId: string, lines: CartLineInput[]) {
  const data = await shopifyFetch<CartResponse>({
    query: UPDATE_CART_MUTATION,
    variables: { cartId, lines },
  });

  return data.cartLinesUpdate?.cart;
}

export async function getCart(cartId: string) {
  const data = await shopifyFetch<{ cart: unknown }>({
    query: CART_QUERY,
    variables: { cartId },
  });

  return data.cart;
}