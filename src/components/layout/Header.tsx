'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import MobileMenu from './MobileMenu';
import { navigation } from '@/config/navigation';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 h-[72px] flex items-center justify-between px-8 transition-all duration-300 ${
          scrolled
            ? 'bg-white/98 border-b border-foreground/10'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <Link
          href="/"
          className={`text-sm font-medium tracking-[0.12em] uppercase transition-colors duration-300 ${
            scrolled ? 'text-foreground' : 'text-white'
          }`}
        >
          TrustTheHood
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm tracking-[0.12em] uppercase font-medium hover:opacity-60 transition-all duration-300 ${
                scrolled ? 'text-foreground' : 'text-white'
              }`}
            >
              {item.title}
            </Link>
          ))}
          <span className={`text-sm tracking-[0.12em] uppercase font-medium transition-colors duration-300 ${
            scrolled ? 'text-foreground' : 'text-white'
          } opacity-60`}>
            CART ({cartCount})
          </span>
        </nav>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`md:hidden text-sm tracking-[0.12em] uppercase font-medium bg-none border-none cursor-pointer transition-colors duration-300 ${
            scrolled ? 'text-foreground' : 'text-white'
          }`}
        >
          MENU
        </button>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}