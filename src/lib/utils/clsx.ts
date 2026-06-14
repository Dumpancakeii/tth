type ClassValue = string | boolean | undefined | null | Record<string, boolean | undefined | null>;

export function cn(...classes: ClassValue[]) {
  return classes
    .flatMap((cls) => {
      if (!cls) return [];
      if (typeof cls === 'object') {
        return Object.entries(cls)
          .filter(([, value]) => value)
          .map(([key]) => key);
      }
      return cls;
    })
    .join(' ');
}