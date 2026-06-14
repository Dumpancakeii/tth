'use client';

import { useEffect, useRef } from 'react';

const items = [
  'SS25 Capsule — Out Now',
  '✦',
  'Raw Hoodie',
  '✦',
  'Boxy Tee',
  '✦',
  'Cropped Denim',
  '✦',
  'Limited Release',
  '✦',
  'No Returns',
  '✦',
  'TrustTheHood',
  '✦',
];

export default function MarqueeText() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (trackRef.current) {
      const clone = trackRef.current.cloneNode(true);
      trackRef.current.parentElement?.appendChild(clone);
    }
  }, []);

  return (
    <div className="w-full overflow-hidden border-b border-border py-5 bg-background">
      <div
        ref={trackRef}
        className="flex whitespace-nowrap"
        style={{ animation: 'marquee 30s linear infinite' }}
      >
        {items.map((item, i) => (
          <span
            key={i}
            className={`inline-block px-8 text-[clamp(1.8rem,5vw,3.5rem)] font-bold uppercase tracking-[-0.02em] leading-none ${
              item === '✦' ? 'text-[#ccc] font-light' : 'text-foreground'
            }`}
          >
            {item}
          </span>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}