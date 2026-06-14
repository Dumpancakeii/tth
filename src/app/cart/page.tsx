export default function CartPage() {
  return (
    <section className="px-8 max-w-[1600px] mx-auto pt-[calc(72px+28px+60px)] pb-[120px]">
      <div className="mb-12">
        <div className="text-xs tracking-[0.12em] uppercase text-accent mb-3">
          — Basket
        </div>
        <h1 className="text-[clamp(36px,6vw,64px)] font-bold uppercase tracking-[-0.03em] leading-[0.92]">
          Your Cart
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-[48px] items-start">
        {/* Cart Items */}
        <div className="space-y-6">
          <p className="text-sm text-accent">Your cart is empty</p>
        </div>

        {/* Summary */}
        <div className="border border-border p-8 space-y-6">
          <h2 className="text-sm tracking-[0.12em] uppercase">Summary</h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-accent">Subtotal</span>
              <span>€0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-accent">Shipping</span>
              <span className="text-accent">Calculated at checkout</span>
            </div>
          </div>

          <div className="border-t border-border pt-4 flex justify-between font-bold">
            <span>Total</span>
            <span>€0</span>
          </div>

          <button
            type="button"
            disabled
            className="w-full bg-foreground text-background py-4 text-sm tracking-[0.12em] uppercase disabled:opacity-30"
          >
            Checkout
          </button>

          <p className="text-xs text-accent text-center">
            Free shipping worldwide
          </p>
        </div>
      </div>
    </section>
  );
}