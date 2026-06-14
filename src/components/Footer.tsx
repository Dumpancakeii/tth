import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="px-10 py-12 md:py-16 border-t border-border">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <span className="font-mono text-[0.7rem] tracking-[0.3em] uppercase font-bold block mb-3">
              TrustTheHood
            </span>
            <p className="text-accent text-[0.6rem] tracking-[0.05em] max-w-[28ch] leading-relaxed">
              Streetwear for the lost ones. Raw cuts, heavy cotton, no logos.
            </p>
          </div>

          <div>
            <h4 className="text-[0.5rem] tracking-[0.25em] uppercase text-accent font-medium mb-4">
              Socials
            </h4>
            <div className="flex flex-col gap-2">
              <a href="#" className="text-accent hover:text-foreground transition-colors text-[0.6rem] tracking-[0.08em]">Instagram</a>
              <a href="#" className="text-accent hover:text-foreground transition-colors text-[0.6rem] tracking-[0.08em]">Twitter</a>
              <a href="#" className="text-accent hover:text-foreground transition-colors text-[0.6rem] tracking-[0.08em]">YouTube</a>
            </div>
          </div>

          <div>
            <h4 className="text-[0.5rem] tracking-[0.25em] uppercase text-accent font-medium mb-4">
              Info
            </h4>
            <div className="flex flex-col gap-2">
              <Link href="/shop" className="text-accent hover:text-foreground transition-colors text-[0.6rem] tracking-[0.08em]">Shop</Link>
              <Link href="/lookbook" className="text-accent hover:text-foreground transition-colors text-[0.6rem] tracking-[0.08em]">Lookbook</Link>
              <Link href="/info" className="text-accent hover:text-foreground transition-colors text-[0.6rem] tracking-[0.08em]">About</Link>
            </div>
          </div>

          <div>
            <h4 className="text-[0.5rem] tracking-[0.25em] uppercase text-accent font-medium mb-4">
              Newsletter
            </h4>
            <div className="flex border-b border-foreground pb-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 bg-transparent border-none outline-none font-mono text-[0.6rem] tracking-[0.08em] text-foreground uppercase placeholder:text-accent/50"
              />
              <button className="bg-none border-none text-accent hover:text-foreground transition-colors text-[0.55rem] tracking-[0.15em] uppercase cursor-pointer">
                →
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-accent/50 text-[0.5rem]">© 2025 TrustTheHood</span>
          <div className="flex gap-6">
            <a href="#" className="text-accent/50 hover:text-foreground transition-colors text-[0.5rem] tracking-[0.1em] uppercase">Privacy Policy</a>
            <a href="#" className="text-accent/50 hover:text-foreground transition-colors text-[0.5rem] tracking-[0.1em] uppercase">Terms of Service</a>
            <a href="#" className="text-accent/50 hover:text-foreground transition-colors text-[0.5rem] tracking-[0.1em] uppercase">Shipping & Returns</a>
          </div>
          <span className="text-accent/50 text-[0.5rem]">Made in the underground</span>
        </div>
      </div>
    </footer>
  );
}