'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils/clsx';

interface ImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
}

export default function Image({
  src,
  alt,
  className,
  aspectRatio = '4/5',
}: ImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div
      className={cn('relative overflow-hidden bg-muted', className)}
      style={{ aspectRatio }}
    >
      {!error && (
        <img
          src={src}
          alt={alt}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-500',
            loaded ? 'opacity-100' : 'opacity-0'
          )}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs text-accent">Image unavailable</span>
        </div>
      )}
    </div>
  );
}