import ProductCard from './ProductCard';

interface ProductItem {
  title: string;
  price: string;
  slug: string;
  imageSrc: string;
  imageHoverSrc?: string;
  soldOut?: boolean;
}

const products: ProductItem[] = [
  { title: 'Raw Hoodie — Black', price: '$88', slug: 'raw-hoodie-black', imageSrc: '/images/product-1.jpg', imageHoverSrc: '/images/product-1-hover.jpg', soldOut: false },
  { title: 'Boxy Tee — White', price: '$48', slug: 'boxy-tee-white', imageSrc: '/images/product-2.jpg', imageHoverSrc: '/images/product-2-hover.jpg', soldOut: false },
  { title: 'Cropped Denim', price: '$120', slug: 'cropped-denim', imageSrc: '/images/product-3.jpg', imageHoverSrc: '/images/product-3-hover.jpg', soldOut: false },
  { title: 'Raw Hoodie — Grey', price: '$88', slug: 'raw-hoodie-grey', imageSrc: '/images/product-4.jpg', imageHoverSrc: '/images/product-4-hover.jpg', soldOut: false },
  { title: 'Oversized Tee — Black', price: '$52', slug: 'oversized-tee-black', imageSrc: '/images/product-1.jpg', imageHoverSrc: '/images/product-1-hover.jpg', soldOut: false },
  { title: 'Cargo Pants — Olive', price: '$140', slug: 'cargo-pants-olive', imageSrc: '/images/product-2.jpg', imageHoverSrc: '/images/product-2-hover.jpg', soldOut: false },
  { title: 'Heavy Knit — Natural', price: '$160', slug: 'heavy-knit-natural', imageSrc: '/images/product-3.jpg', imageHoverSrc: '/images/product-3-hover.jpg', soldOut: false },
  { title: '5-Panel Cap — Black', price: '$38', slug: '5-panel-cap-black', imageSrc: '/images/product-4.jpg', imageHoverSrc: '/images/product-4-hover.jpg', soldOut: false },
];

interface ProductGridProps {
  limit?: number;
}

export default function ProductGrid({ limit }: ProductGridProps) {
  const items = limit ? products.slice(0, limit) : products;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
      {items.map((product) => (
        <ProductCard key={product.slug} {...product} />
      ))}
    </div>
  );
}