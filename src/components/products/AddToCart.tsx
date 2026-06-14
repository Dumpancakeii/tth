'use client';

import { useState } from 'react';

interface AddToCartProps {
  onAdd: () => void;
}

export default function AddToCart({ onAdd }: AddToCartProps) {
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    onAdd();
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <button
      onClick={handleClick}
      className="w-full h-[52px] bg-foreground text-background border-none font-sans text-xs font-medium tracking-[0.15em] uppercase cursor-pointer transition-opacity duration-200 hover:opacity-80"
    >
      {added ? 'ADDED ✓' : 'Add to cart'}
    </button>
  );
}