import Link from 'next/link';
import FadeIn from '@/components/animations/FadeIn';

interface CollectionHeroProps {
  title: string;
  description: string;
  image: string;
  slug: string;
}

export default function CollectionHero({
  title,
  description,
  image,
  slug,
}: CollectionHeroProps) {
  return (
    <FadeIn>
      <Link href={`/collections/${slug}`} className="group block">
        <div className="aspect-[4/5] bg-muted mb-6 overflow-hidden">
          <div
            className="w-full h-full bg-muted bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url(${image})` }}
          />
        </div>
        <h3 className="text-lg font-bold uppercase tracking-[-0.02em] mb-2">
          {title}
        </h3>
        <p className="text-sm text-accent leading-relaxed max-w-[40ch]">
          {description}
        </p>
      </Link>
    </FadeIn>
  );
}