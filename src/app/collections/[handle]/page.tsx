import Link from 'next/link';
import ProductGrid from '@/components/products/ProductGrid';

interface CollectionDetailPageProps {
  params: Promise<{ handle: string }>;
}

export default async function CollectionDetailPage({
  params,
}: CollectionDetailPageProps) {
  const { handle } = await params;

  return (
    <section className="px-8 max-w-[1600px] mx-auto pt-[calc(72px+28px+60px)] pb-[120px]">
      <div className="mb-12">
        <Link
          href="/collections"
          className="text-xs tracking-[0.12em] uppercase text-accent hover:text-foreground transition-colors mb-3 inline-block"
        >
          ← Collections
        </Link>
        <h1 className="text-[clamp(36px,6vw,64px)] font-bold uppercase tracking-[-0.03em] leading-[0.92]">
          {handle.replace(/-/g, ' ')}
        </h1>
      </div>
      <ProductGrid />
    </section>
  );
}