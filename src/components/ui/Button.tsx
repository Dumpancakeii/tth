'use client';

import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  fullWidth?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

export default function Button({
  children,
  onClick,
  className = '',
  variant = 'primary',
  fullWidth = false,
  disabled = false,
  type = 'button',
}: ButtonProps) {
  const baseStyles = 'h-[52px] font-sans text-xs font-medium tracking-[0.15em] uppercase cursor-pointer transition-all duration-200';

  const variants = {
    primary: 'bg-foreground text-background hover:opacity-80 border-none',
    secondary: 'bg-transparent text-foreground border border-foreground hover:bg-foreground hover:text-background',
    ghost: 'bg-transparent text-foreground border-none hover:opacity-60',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : 'px-8'} ${disabled ? 'opacity-30 pointer-events-none' : ''} ${className}`}
    >
      {children}
    </button>
  );
}