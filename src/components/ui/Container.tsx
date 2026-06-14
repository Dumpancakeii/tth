import { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'main';
}

export default function Container({ children, className = '', as: Tag = 'div' }: ContainerProps) {
  return (
    <Tag className={`max-w-[1600px] mx-auto px-8 md:px-8 ${className}`}>
      {children}
    </Tag>
  );
}