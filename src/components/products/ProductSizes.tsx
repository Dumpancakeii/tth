'use client';

interface SizeOption {
  label: string;
  available: boolean;
}

const defaultSizes: SizeOption[] = [
  { label: 'S', available: true },
  { label: 'M', available: true },
  { label: 'L', available: true },
  { label: 'XL', available: true },
];

interface ProductSizesProps {
  sizes?: SizeOption[];
  selectedSize: string;
  onSelectSize: (size: string) => void;
}

export default function ProductSizes({
  sizes = defaultSizes,
  selectedSize,
  onSelectSize,
}: ProductSizesProps) {
  return (
    <div className="flex gap-2 flex-wrap mb-6">
      {sizes.map((size) => (
        <button
          key={size.label}
          onClick={() => size.available && onSelectSize(size.label)}
          className={`px-[14px] py-[10px] border border-foreground font-sans text-xs tracking-[0.05em] uppercase cursor-pointer transition-all duration-150 ${
            !size.available
              ? 'opacity-10 line-through pointer-events-none'
              : selectedSize === size.label
              ? 'bg-foreground text-background'
              : 'bg-transparent text-foreground hover:bg-foreground hover:text-background'
          }`}
        >
          {size.label}
        </button>
      ))}
    </div>
  );
}