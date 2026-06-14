'use client';

interface HeroTextProps {
  title: string;
}

export default function HeroText({ title }: HeroTextProps) {
  return (
    <div className="absolute left-10 bottom-10 z-[2] max-w-[80vw]">
      <h1 className="text-white text-[clamp(48px,9vw,160px)] font-bold uppercase leading-[0.9] m-0 drop-shadow-[0_2px_20px_rgba(0,0,0,0.3)]">
        {title}
      </h1>
    </div>
  );
}