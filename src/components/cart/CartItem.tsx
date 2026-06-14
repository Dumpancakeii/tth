'use client';

function MinusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="2" y1="6" x2="10" y2="6" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="6" y1="2" x2="6" y2="10" stroke="currentColor" strokeWidth="1" />
      <line x1="2" y1="6" x2="10" y2="6" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="4" y1="4" x2="12" y2="12" stroke="currentColor" strokeWidth="1" />
      <line x1="12" y1="4" x2="4" y2="12" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

interface CartItemProps {
  id: string;
  title: string;
  price: string;
  quantity: number;
  image: string;
  size?: string;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

export default function CartItem({
  id,
  title,
  price,
  quantity,
  image,
  size,
  onRemove,
  onUpdateQuantity,
}: CartItemProps) {
  return (
    <div className="flex gap-4 pb-6 border-b border-border">
      <div className="w-20 h-24 bg-muted flex-shrink-0">
        {image && (
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${image})` }}
          />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-sm font-medium truncate">{title}</h3>
          <button
            onClick={() => onRemove(id)}
            className="text-accent hover:text-foreground transition-colors ml-2"
            aria-label="Remove item"
          >
            <XIcon />
          </button>
        </div>

        {size && (
          <p className="text-xs text-accent mb-2">Size: {size}</p>
        )}

        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center border border-border">
            <button
              onClick={() => onUpdateQuantity(id, quantity - 1)}
              className="px-2 py-1 hover:bg-muted transition-colors"
              aria-label="Decrease quantity"
            >
              <MinusIcon />
            </button>
            <span className="px-3 py-1 text-xs font-mono">{quantity}</span>
            <button
              onClick={() => onUpdateQuantity(id, quantity + 1)}
              className="px-2 py-1 hover:bg-muted transition-colors"
              aria-label="Increase quantity"
            >
              <PlusIcon />
            </button>
          </div>

          <span className="text-sm font-medium">{price}</span>
        </div>
      </div>
    </div>
  );
}
