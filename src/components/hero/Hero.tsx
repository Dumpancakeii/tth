'use client';

import HeroImage from './HeroImage';
import HeroText from './HeroText';

interface HeroProps {
  title?: string;
  imageSrc?: string;
}

export default function Hero({
  title = 'NEW DROP',
  imageSrc = '/images/hero-placeholder.jpg',
}: HeroProps) {
  return (
    <section className="relative w-full h-screen min-h-[900px] overflow-hidden">
      <HeroImage src={imageSrc} alt={title} />
      <div className="absolute inset-0 z-[1] pointer-events-none bg-black/15" />
      <HeroText title={title} />
    </section>
  );
}