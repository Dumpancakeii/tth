'use client';

import { motion } from 'framer-motion';

const looks = [
  { id: 1, caption: 'SS25 — Look 01', image: '/images/product-1.jpg' },
  { id: 2, caption: 'SS25 — Look 02', image: '/images/product-2.jpg' },
  { id: 3, caption: 'SS25 — Look 03', image: '/images/product-3.jpg' },
  { id: 4, caption: 'SS25 — Look 04', image: '/images/product-4.jpg' },
  { id: 5, caption: 'SS25 — Look 05', image: '/images/product-1.jpg' },
  { id: 6, caption: 'SS25 — Look 06', image: '/images/product-2.jpg' },
];

export default function LookbookGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {looks.map((look, i) => (
        <motion.div
          key={look.id}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: i * 0.1 }}
          className={`overflow-hidden ${(i + 1) % 3 === 0 ? 'md:col-span-2' : ''}`}
        >
          <div className="aspect-[4/5] bg-muted overflow-hidden">
            <img
              src={look.image}
              alt={look.caption}
              className="w-full h-full object-cover transition-transform duration-600 hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
          <div className="pt-3 text-xs tracking-[0.08em] uppercase text-accent">
            {look.caption}
          </div>
        </motion.div>
      ))}
    </div>
  );
}