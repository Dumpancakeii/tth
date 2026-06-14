export interface NavItem {
  title: string;
  href: string;
}

export const navigation: NavItem[] = [
  {
    title: 'Shop',
    href: '/shop',
  },
  {
    title: 'Lookbook',
    href: '/lookbook',
  },
  {
    title: 'Info',
    href: '/info',
  },
];

export const footerNavigation = {
  shop: [
    { title: 'All', href: '/shop' },
    { title: 'Hoodies', href: '/shop?category=hoodies' },
    { title: 'Tees', href: '/shop?category=tees' },
    { title: 'Denim', href: '/shop?category=denim' },
  ],
  info: [
    { title: 'About', href: '/info' },
    { title: 'Lookbook', href: '/lookbook' },
    { title: 'Shipping', href: '#' },
    { title: 'Returns', href: '#' },
  ],
  socials: [
    { title: 'Instagram', href: '#' },
    { title: 'Twitter', href: '#' },
    { title: 'YouTube', href: '#' },
  ],
};