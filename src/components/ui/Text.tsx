import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/clsx';

interface TextProps {
  children: ReactNode;
  as?: 'p' | 'span' | 'div' | 'label';
  className?: string;
  size?: 'xs' | 'sm' | 'base' | 'lg';
  color?: 'default' | 'muted' | 'accent';
}

export default function Text({
  children,
  as: Tag = 'p',
  className,
  size = 'base',
  color = 'default',
}: TextProps) {
  return (
    <Tag
      className={cn(
        'leading-relaxed',
        {
          'text-xs': size === 'xs',
          'text-sm': size === 'sm',
          'text-base': size === 'base',
          'text-lg': size === 'lg',
        },
        {
          'text-foreground': color === 'default',
          'text-accent': color === 'accent',
          'text-accent/60': color === 'muted',
        },
        className
      )}
    >
      {children}
    </Tag>
  );
}