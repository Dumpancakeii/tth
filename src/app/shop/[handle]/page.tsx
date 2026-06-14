'use client';

import { use } from 'react';
import { FALLBACK_PRODUCTS } from '@/lib/shopify/shopify';
import ProductGallery from '@/components/products/ProductGallery';
import ProductInfo from '@/components/products/ProductInfo';

export default function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = use(params);
  const product = FALLBACK_PRODUCTS.find((p) => p.slug === handle);

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-accent text-sm uppercase tracking-widest">Product not found</p>
      </div>
    );
  }

  const images = [
    `/images/${product.slug}.jpg`,
    `/images/${product.slug}-b.jpg`,
    `/images/${product.slug}-c.jpg`,
    `/images/${product.slug}-d.jpg`,
  ];

  const defaultDesc = '100% heavyweight cotton. Raw-cut hem. Garment-dyed. Made in limited quantities. Each piece is unique.';

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1.3fr_0.7fr] min-h-screen mt-[72px]">
      <ProductGallery images={images} title={product.title} />
      <ProductInfo
        title={product.title}
        price={product.price}
        description={product.description || defaultDesc}
        label="SS25 — Drop 01"
      />
    </div>
  );
}