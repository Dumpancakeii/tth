'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-8 text-center">
      <h1 className="text-6xl font-bold mb-4">500</h1>
      <p className="text-lg text-accent mb-8 max-w-md">
        Something went wrong. Please try again later.
      </p>
      <button
        onClick={reset}
        className="bg-foreground text-background px-8 py-3 text-sm tracking-[0.12em] uppercase hover:opacity-90 transition-opacity"
      >
        Try Again
      </button>
    </div>
  );
}