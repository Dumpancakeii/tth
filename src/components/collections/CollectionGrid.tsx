import CollectionCard from './CollectionHero';

export default function CollectionGrid() {
  const collections = [
    {
      title: 'SS25 Capsule',
      description: 'Spring/Summer 2025 — Raw cuts, heavy cotton, no logos.',
      image: '/images/collection-ss25.jpg',
      slug: 'ss25-capsule',
    },
    {
      title: 'FW24 Archive',
      description: 'Fall/Winter 2024 — Layering pieces, dark tones, oversized fits.',
      image: '/images/collection-fw24.jpg',
      slug: 'fw24-archive',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-[48px]">
      {collections.map((collection) => (
        <CollectionCard key={collection.slug} {...collection} />
      ))}
    </div>
  );
}