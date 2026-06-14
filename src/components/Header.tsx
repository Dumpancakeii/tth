'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount] = useState(0);

  const links = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
    { href: '/lookbook', label: 'Lookbook' },
    { href: '/info', label: 'Info' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-10 py-6 bg-white/95 backdrop-blur border-b border-foreground">
        <Link href="/" className="font-mono text-xs tracking-[0.3em] uppercase font-bold">
          TrustTheHood
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-accent hover:text-foreground transition-colors text-[0.6rem] tracking-[0.25em] uppercase font-medium"
            >
              {link.label}
            </Link>
          ))}
          <span className="text-accent text-[0.6rem] tracking-[0.25em] uppercase font-mono">
            CART ({cartCount})
          </span>
        </nav>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-xl cursor-pointer bg-none border-none text-foreground"
          aria-label="Toggle menu"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-white flex flex-col items-center justify-center gap-8 md:hidden"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-6 right-10 text-2xl cursor-pointer bg-none border-none text-foreground"
            >
              ✕
            </button>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-accent hover:text-foreground transition-colors text-xl font-bold uppercase tracking-widest"
              >
                {link.label}
              </Link>
            ))}
            <span className="text-accent text-xl font-bold uppercase tracking-widest font-mono">
              CART ({cartCount})
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}