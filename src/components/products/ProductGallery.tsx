'use client';

import { motion } from 'framer-motion';

interface ProductGalleryProps {
  images: string[];
  title: string;
}

export default function ProductGallery({ images, title }: ProductGalleryProps) {
  return (
    <div className="border-r-0 md:border-r border-border">
      <div className="flex flex-col gap-4">
        {images.map((src, i) => (
          <motion.img
            key={i}
            src={src}
            alt={`${title} view ${i + 1}`}
            className="w-full h-auto block border-b border-border"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ))}
      </div>
    </div>
  );
}