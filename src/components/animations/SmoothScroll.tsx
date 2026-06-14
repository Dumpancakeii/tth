'use client';

import { useEffect } from 'react';
import type { ReactNode } from 'react';

interface SmoothScrollProps {
  children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');

      if (!anchor) return;

      e.preventDefault();
      const href = anchor.getAttribute('href');
      if (!href) return;

      const element = document.querySelector(href);
      if (!element) return;

      const top = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top,
        behavior: 'smooth',
      });
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  return <>{children}</>;
}