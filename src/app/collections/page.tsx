import CollectionGrid from '@/components/collections/CollectionGrid';

export default function CollectionsPage() {
  return (
    <section className="px-8 max-w-[1600px] mx-auto pt-[calc(72px+28px+60px)] pb-[120px]">
      <div className="mb-12">
        <div className="text-xs tracking-[0.12em] uppercase text-accent mb-3">
          — Archive
        </div>
        <h1 className="text-[clamp(36px,6vw,64px)] font-bold uppercase tracking-[-0.03em] leading-[0.92]">
          Collections
        </h1>
      </div>
      <CollectionGrid />
    </section>
  );
}