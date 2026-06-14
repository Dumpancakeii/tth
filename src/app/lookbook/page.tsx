import LookbookGrid from '@/components/editorial/LookbookGrid';

export default function LookbookPage() {
  return (
    <section className="px-8 max-w-[1600px] mx-auto pt-[calc(72px+28px+60px)] pb-[120px]">
      <div className="mb-12">
        <div className="text-xs tracking-[0.12em] uppercase text-accent mb-3">
          — Visual Archive
        </div>
        <h1 className="text-[clamp(36px,6vw,64px)] font-bold uppercase tracking-[-0.03em] leading-[0.92] mb-2">
          Lookbook
        </h1>
        <p className="text-xs tracking-[0.12em] uppercase text-accent font-mono">
          Shot on location. No retouching.
        </p>
      </div>
      <LookbookGrid />
    </section>
  );
}