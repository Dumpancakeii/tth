'use client';

import { motion } from 'framer-motion';

interface HeroProps {
  title?: string;
  subtitle?: string;
  imageSrc?: string;
}

export default function Hero({
  title = 'NEW DROP',
  subtitle = 'SS25 Capsule — Out now',
  imageSrc = '/images/hero-placeholder.jpg',
}: HeroProps) {
  return (
    <section className="relative w-full h-screen overflow-hidden border-b border-foreground">
      <motion.img
        src={imageSrc}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover grayscale saturate-[0.3] contrast-[0.85]"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
      />

      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative z-[2] w-full h-full flex flex-col items-center justify-center text-center px-8">
        <h1 className="text-white mix-blend-difference text-[clamp(5rem,22vw,16rem)] font-bold uppercase tracking-[-0.05em] leading-[0.78] select-none">
          {title}
        </h1>
        <p className="text-white mix-blend-difference text-[clamp(0.6rem,1.2vw,0.8rem)] tracking-[0.4em] uppercase mt-6 opacity-70 font-mono">
          {subtitle}
        </p>
      </div>
    </section>
  );
}