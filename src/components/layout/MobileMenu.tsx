'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { navigation } from '@/config/navigation';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-40 bg-background flex flex-col items-center justify-center gap-8"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-8 text-2xl cursor-pointer bg-none border-none text-foreground"
          >
            ✕
          </button>
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="text-accent hover:text-foreground transition-colors text-2xl font-bold uppercase tracking-[0.08em]"
            >
              {item.title}
            </Link>
          ))}
          <Link
            href="#"
            onClick={onClose}
            className="text-accent text-2xl font-bold uppercase tracking-[0.08em] font-mono"
          >
            CART (0)
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}