'use client';

interface EditorialBannerProps {
  imageSrc?: string;
  text?: string;
}

export default function EditorialBanner({
  imageSrc = '/images/banner-1.jpg',
  text = 'No trends. No seasons. Just clothes. — TrustTheHood is an independent streetwear label based somewhere between the pavement and the void.',
}: EditorialBannerProps) {
  return (
    <div className="h-[70vh] relative overflow-hidden w-full">
      <img
        src={imageSrc}
        alt="Editorial"
        className="w-full h-full object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
      <div className="absolute inset-0 z-[1] pointer-events-none bg-black/15" />
      <div className="absolute bottom-10 left-10 z-[2] max-w-[400px]">
        <p className="text-xs tracking-[0.1em] uppercase text-white/80 leading-relaxed">
          {text}
        </p>
      </div>
    </div>
  );
}