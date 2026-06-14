import ProductGrid from '@/components/products/ProductGrid';

export default function ShopPage() {
  return (
    <section className="px-8 max-w-[1600px] mx-auto pt-[calc(72px+28px+60px)] pb-[120px]">
      <div className="mb-12">
        <div className="text-xs tracking-[0.12em] uppercase text-accent mb-3">
          — Collection
        </div>
        <h1 className="text-[clamp(36px,6vw,64px)] font-bold uppercase tracking-[-0.03em] leading-[0.92]">
          All Products
        </h1>
      </div>
      <ProductGrid />
    </section>
  );
}