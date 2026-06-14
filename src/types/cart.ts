export interface CartItem {
  id: string;
  variantId: string;
  title: string;
  variantTitle: string;
  quantity: number;
  price: string;
  image: string;
  handle: string;
}

export interface Cart {
  id: string;
  items: CartItem[];
  totalQuantity: number;
  totalPrice: string;
  checkoutUrl: string;
}