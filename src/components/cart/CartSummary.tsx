'use client';

import { useCart } from '@/lib/hooks/useCart';

export default function CartSummary() {
  const { totalPrice, totalItems, items } = useCart();

  return (
    <div className="border-t border-border px-8 py-6 space-y-4">
      <div className="flex justify-between text-sm">
        <span className="text-accent">Subtotal</span>
        <span>{totalPrice}</span>
      </div>

      <div className="flex justify-between text-sm">
        <span className="text-accent">Shipping</span>
        <span className="text-accent">Calculated at checkout</span>
      </div>

      <div className="border-t border-border pt-4 flex justify-between font-bold">
        <span>Total</span>
        <span>{totalPrice}</span>
      </div>

      <button
        type="button"
        disabled={items.length === 0}
        className="w-full bg-foreground text-background py-4 text-sm tracking-[0.12em] uppercase disabled:opacity-30 hover:opacity-90 transition-opacity"
      >
        Checkout — {totalPrice}
      </button>

      {totalItems > 0 && (
        <p className="text-xs text-accent text-center">
          {totalItems} item{totalItems !== 1 ? 's' : ''} · Free shipping worldwide
        </p>
      )}
    </div>
  );
}
