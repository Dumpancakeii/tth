import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/clsx';

interface GridProps {
  children: ReactNode;
  className?: string;
  cols?: number | { base?: number; sm?: number; md?: number; lg?: number; xl?: number };
  gap?: string;
}

function getColClasses(cols: GridProps['cols']): string {
  if (!cols || typeof cols === 'number') {
    return `grid-cols-${cols || 1}`;
  }
  return [
    cols.base && `grid-cols-${cols.base}`,
    cols.sm && `sm:grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`,
  ]
    .filter(Boolean)
    .join(' ');
}

export default function Grid({ children, className, cols, gap }: GridProps) {
  return (
    <div
      className={cn(
        'grid',
        getColClasses(cols),
        gap || 'gap-[24px]',
        className
      )}
    >
      {children}
    </div>
  );
}