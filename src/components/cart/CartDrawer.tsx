'use client';

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/lib/hooks/useCart';
import CartItem from './CartItem';
import CartSummary from './CartSummary';

export default function CartDrawer() {
  const { isOpen, close, items, removeItem, updateQuantity } = useCart();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    },
    [close]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />

          {/* Drawer */}
          <motion.div
            className="fixed top-0 right-0 h-full w-full max-w-md bg-background z-50 flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <div className="flex items-center justify-between px-8 h-[72px] border-b border-border">
              <h2 className="text-sm tracking-[0.12em] uppercase">Your Cart</h2>
              <button
                onClick={close}
                className="text-sm hover:text-accent transition-colors"
                aria-label="Close cart"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-8 space-y-6">
              {items.length === 0 ? (
                <p className="text-sm text-accent text-center py-12">
                  Your cart is empty
                </p>
              ) : (
                items.map((item) => (
                  <CartItem
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    price={item.price}
                    quantity={item.quantity}
                    image={item.image}
                    size={item.size}
                    onRemove={removeItem}
                    onUpdateQuantity={updateQuantity}
                  />
                ))
              )}
            </div>

            <CartSummary />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
