import Hero from '@/components/hero/Hero';
import ProductGrid from '@/components/products/ProductGrid';
import EditorialBanner from '@/components/editorial/EditorialBanner';
import MarqueeText from '@/components/editorial/MarqueeText';

export default function HomePage() {
  return (
    <>
      <Hero />

      <MarqueeText />

      {/* Collection Grid: Latest Drop */}
      <section className="px-8 max-w-[1600px] mx-auto py-[120px]">
        <div className="mb-12">
          <div className="text-xs tracking-[0.12em] uppercase text-accent mb-3">
            — Latest Drop
          </div>
          <h2 className="text-[clamp(36px,6vw,64px)] font-bold uppercase tracking-[-0.03em] leading-[0.92]">
            SS25 Capsule
          </h2>
        </div>
        <ProductGrid limit={4} />
      </section>

      {/* Editorial Banner */}
      <EditorialBanner />

      {/* Manifesto */}
      <section className="px-8 max-w-[1600px] mx-auto py-[120px]">
        <div className="max-w-[640px]">
          <p className="text-[clamp(28px,5vw,64px)] font-bold uppercase tracking-[-0.03em] leading-[0.95] mb-8">
            No trends.<br />
            No seasons.<br />
            Just clothes.
          </p>
          <p className="text-sm leading-relaxed text-accent max-w-[40ch]">
            TrustTheHood is an independent streetwear label based somewhere
            between the pavement and the void. Every piece is cut raw,
            sewn in limited runs, and shipped in recycled bags.
          </p>
        </div>
      </section>
    </>
  );
}