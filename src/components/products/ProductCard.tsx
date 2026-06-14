'use client';

import Link from 'next/link';

interface ProductCardProps {
  title: string;
  price: string;
  slug: string;
  imageSrc: string;
  imageHoverSrc?: string;
  soldOut?: boolean;
}

export default function ProductCard({
  title,
  price,
  slug,
  imageSrc,
  imageHoverSrc,
  soldOut = false,
}: ProductCardProps) {
  return (
    <Link href={`/shop/${slug}`} className="block pb-8 cursor-pointer group">
      <div className="relative w-full aspect-[4/5] overflow-hidden mb-3 bg-muted">
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-full object-cover transition-opacity duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        {imageHoverSrc && (
          <img
            src={imageHoverSrc}
            alt={`${title} alt view`}
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-[1]"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        )}
      </div>
      <div className="text-sm tracking-[0.08em] uppercase font-medium mb-1">
        {title}
      </div>
      <div className="text-sm opacity-70">
        {soldOut ? <span className="opacity-50 line-through">{price}</span> : price}
      </div>
    </Link>
  );
}