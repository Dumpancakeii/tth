/**
 * CMS integration layer for editorial content.
 * Currently uses static fallback data.
 * TODO: Integrate with Sanity / Contentful / Payload CMS
 */

export interface EditorialContent {
  hero: {
    title: string;
    subtitle: string;
    image: string;
  };
  editorialBanner: {
    title: string;
    body: string;
    image: string;
    link: string;
    linkText: string;
  };
  lookbook: Array<{
    title: string;
    image: string;
    href: string;
  }>;
  manifest: Array<{
    title: string;
    description: string;
  }>;
  marquee: string[];
}

const fallbackContent: EditorialContent = {
  hero: {
    title: 'TrustTheHood',
    subtitle: 'Streetwear for the lost ones. Raw cuts, heavy cotton, no logos.',
    image: '/images/hero.jpg',
  },
  editorialBanner: {
    title: 'The Weight of Quality',
    body: 'Every piece is cut from heavy 320gsm cotton. No shortcuts. No logos. Just raw construction that gets better with time.',
    image: '/images/editorial.jpg',
    link: '/shop',
    linkText: 'Shop Now',
  },
  lookbook: [
    { title: 'FW24 Collection', image: '/images/lookbook-1.jpg', href: '/lookbook' },
    { title: 'Behind the Seams', image: '/images/lookbook-2.jpg', href: '/lookbook' },
    { title: 'Studio Sessions', image: '/images/lookbook-3.jpg', href: '/lookbook' },
  ],
  manifest: [
    { title: 'No Logos', description: 'We don\'t need to announce ourselves. The cut speaks.' },
    { title: 'Heavy Cotton', description: '320gsm. Pre-shrunk. Built to last.' },
    { title: 'Raw Cuts', description: 'Unfinished edges. Unpolished. Unapologetic.' },
  ],
  marquee: [
    'Heavyweight Cotton',
    'No Logos',
    'Raw Cuts',
    'Built to Last',
    'Streetwear for the Lost Ones',
  ],
};

export async function getEditorialContent(): Promise<EditorialContent> {
  // TODO: Fetch from CMS
  return fallbackContent;
}

export async function getHeroContent(): Promise<EditorialContent['hero']> {
  const content = await getEditorialContent();
  return content.hero;
}

export async function getEditorialBanner(): Promise<EditorialContent['editorialBanner']> {
  const content = await getEditorialContent();
  return content.editorialBanner;
}

export async function getLookbookItems(): Promise<EditorialContent['lookbook']> {
  const content = await getEditorialContent();
  return content.lookbook;
}