'use client';

import { useState } from 'react';
import ProductSizes from './ProductSizes';
import AddToCart from './AddToCart';

interface ProductInfoProps {
  title: string;
  price: string;
  description: string;
  label?: string;
}

export default function ProductInfo({
  title,
  price,
  description,
  label = 'SS25 — Drop 01',
}: ProductInfoProps) {
  const [selectedSize, setSelectedSize] = useState('S');
  const [cartCount, setCartCount] = useState(0);

  return (
    <div className="px-10 md:px-16 py-16 sticky top-[120px] self-start">
      <div className="max-w-[420px]">
        <div className="text-xs tracking-[0.12em] uppercase text-accent font-medium mb-2">
          {label}
        </div>

        <h1 className="text-[28px] leading-none uppercase font-bold mb-3">
          {title}
        </h1>

        <div className="text-sm opacity-70 mb-8">
          {price}
        </div>

        <ProductSizes selectedSize={selectedSize} onSelectSize={setSelectedSize} />

        <AddToCart onAdd={() => setCartCount((c) => c + 1)} />

        <p className="text-sm leading-relaxed text-accent max-w-[38ch] mt-10">
          {description}
        </p>
      </div>
    </div>
  );
}