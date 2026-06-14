import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/clsx';

interface HeadingProps {
  children: ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'display';
}

export default function Heading({
  children,
  as: Tag = 'h2',
  className,
  size = 'md',
}: HeadingProps) {
  return (
    <Tag
      className={cn(
        'font-bold uppercase tracking-[-0.03em] leading-[0.92]',
        {
          'text-[clamp(24px,4vw,32px)]': size === 'sm',
          'text-[clamp(28px,5vw,40px)]': size === 'md',
          'text-[clamp(36px,6vw,48px)]': size === 'lg',
          'text-[clamp(48px,8vw,64px)]': size === 'xl',
          'text-[clamp(64px,10vw,96px)]': size === 'display',
        },
        className
      )}
    >
      {children}
    </Tag>
  );
}