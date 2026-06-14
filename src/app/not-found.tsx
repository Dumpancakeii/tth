import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-8 text-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-lg text-accent mb-8 max-w-md">
        Page not found. The link might be broken or the page has been removed.
      </p>
      <Link
        href="/"
        className="bg-foreground text-background px-8 py-3 text-sm tracking-[0.12em] uppercase hover:opacity-90 transition-opacity inline-block"
      >
        Back to Home
      </Link>
    </div>
  );
}