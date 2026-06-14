// Fallback product data for development when Shopify is not connected
export const FALLBACK_PRODUCTS: Array<{
  slug: string;
  title: string;
  price: string;
  soldOut: boolean;
  description?: string;
}> = [
  {
    slug: 'raw-hoodie-black',
    title: 'Raw Hoodie — Black',
    price: '$88',
    soldOut: false,
    description: '100% heavyweight cotton. Raw-cut hem. Garment-dyed black. Made in limited quantities. Each piece is unique.',
  },
  {
    slug: 'boxy-tee-white',
    title: 'Boxy Tee — White',
    price: '$48',
    soldOut: false,
    description: 'Heavyweight cotton jersey. Box-cut silhouette. Ribbed collar. Oversized fit.',
  },
  {
    slug: 'cropped-denim',
    title: 'Cropped Denim',
    price: '$120',
    soldOut: false,
    description: 'Raw-edge denim. Cropped hem. Five-pocket construction. Unfinished details.',
  },
  {
    slug: 'raw-hoodie-grey',
    title: 'Raw Hoodie — Grey',
    price: '$88',
    soldOut: false,
    description: '100% heavyweight cotton. Raw-cut hem. Garment-dyed heather grey.',
  },
  {
    slug: 'oversized-tee-black',
    title: 'Oversized Tee — Black',
    price: '$52',
    soldOut: false,
    description: 'Oversized silhouette. Drop shoulder. Heavyweight cotton.',
  },
  {
    slug: 'cargo-pants-olive',
    title: 'Cargo Pants — Olive',
    price: '$140',
    soldOut: false,
    description: 'Heavy cotton twill. Cargo pockets. Adjustable waist. Straight leg.',
  },
  {
    slug: 'heavy-knit-natural',
    title: 'Heavy Knit — Natural',
    price: '$160',
    soldOut: false,
    description: 'Chunky knit cotton. Ribbed cuffs. Natural undyed finish.',
  },
  {
    slug: '5-panel-cap-black',
    title: '5-Panel Cap — Black',
    price: '$38',
    soldOut: false,
    description: 'Unstructured 5-panel. Adjustable strap. Raw edge visor.',
  },
];