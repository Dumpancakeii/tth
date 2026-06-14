export default function InfoPage() {
  return (
    <section className="px-8 max-w-[1600px] mx-auto pt-[calc(72px+28px+60px)] pb-[120px]">
      <div className="max-w-[640px] mx-auto py-16">
        <div className="text-xs tracking-[0.12em] uppercase text-accent mb-6">
          &mdash; About
        </div>

        <p className="text-[clamp(28px,5vw,64px)] font-bold uppercase tracking-[-0.03em] leading-[0.95] mb-8">
          No trends. No seasons.<br />
          Just clothes.
        </p>

        <p className="text-sm leading-relaxed text-accent mb-6">
          TrustTheHood is an independent streetwear label based somewhere
          between the pavement and the void. Every piece is cut raw,
          sewn in limited runs, and shipped in recycled bags.
        </p>

        <p className="text-sm leading-relaxed text-accent mb-6">
          We don't do seasonal collections. We don't follow trends.
          We make clothes that last &mdash; heavyweight cottons, raw-cut hems,
          garment-dyed finishes. Everything is produced in small batches
          to minimize waste and maximize quality.
        </p>

        <p className="text-sm leading-relaxed text-accent mb-6">
          No logos. No hype. Just clothes that feel like something.
        </p>

        <p className="mt-16 text-[clamp(28px,5vw,64px)] font-bold uppercase tracking-[-0.03em] leading-[0.95] mb-6">
          Contact
        </p>
        <p className="text-sm leading-relaxed text-accent">
          For inquiries, wholesale, or collaborations:<br />
          hello@trustthehood.com
        </p>
      </div>
    </section>
  );
}