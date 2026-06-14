import Link from 'next/link';
import { footerNavigation } from '@/config/navigation';

export default function Footer() {
  return (
    <footer className="px-8 py-20 md:py-20 border-t border-border">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
          <div className="footer-col">
            <h4 className="text-xs tracking-[0.12em] uppercase text-accent font-medium mb-4">
              Shop
            </h4>
            {footerNavigation.shop.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="block text-sm tracking-[0.05em] text-accent hover:text-foreground transition-colors mb-2"
              >
                {item.title}
              </Link>
            ))}
          </div>

          <div className="footer-col">
            <h4 className="text-xs tracking-[0.12em] uppercase text-accent font-medium mb-4">
              Info
            </h4>
            {footerNavigation.info.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="block text-sm tracking-[0.05em] text-accent hover:text-foreground transition-colors mb-2"
              >
                {item.title}
              </Link>
            ))}
          </div>

          <div className="footer-col">
            <h4 className="text-xs tracking-[0.12em] uppercase text-accent font-medium mb-4">
              Socials
            </h4>
            {footerNavigation.socials.map((item) => (
              <a
                key={item.title}
                href={item.href}
                className="block text-sm tracking-[0.05em] text-accent hover:text-foreground transition-colors mb-2"
              >
                {item.title}
              </a>
            ))}
          </div>

          <div className="footer-col">
            <h4 className="text-xs tracking-[0.12em] uppercase text-accent font-medium mb-4">
              Newsletter
            </h4>
            <div className="flex border-b border-foreground pb-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 bg-transparent border-none outline-none font-mono text-sm tracking-[0.08em] text-foreground uppercase placeholder:text-accent/50"
              />
              <button className="bg-none border-none text-accent hover:text-foreground transition-colors text-xs tracking-[0.15em] uppercase cursor-pointer">
                →
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-[11px] text-accent/60">
            © 2025 TrustTheHood
          </span>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-[11px] tracking-[0.08em] uppercase text-accent/60 hover:text-foreground transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-[11px] tracking-[0.08em] uppercase text-accent/60 hover:text-foreground transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}