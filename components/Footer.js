import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-forest-900 text-ivory-200">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 sm:grid-cols-3">
        <div>
          <p className="font-serif text-2xl tracking-[0.3em]">URIEL</p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.35em] text-gold-500">Diamonds · by Vinay Jewellers</p>
          <p className="mt-4 text-sm opacity-80">Custom diamond jewellery, designed with you and crafted by hand.</p>
        </div>
        <div className="text-sm">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-gold-500">Explore</p>
          <ul className="space-y-2">
            <li><Link href="/journeys" className="hover:text-gold-400">Custom Journeys</Link></li>
            <li><Link href="/request" className="hover:text-gold-400">Request a Design</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-gold-500">Contact</p>
          {/* TODO: replace with the client's real details */}
          <p className="opacity-80">Phone / WhatsApp: +91 00000 00000</p>
          <p className="opacity-80">Email: hello@example.com</p>
          <p className="opacity-80">Instagram: @urieldiamonds</p>
        </div>
      </div>
      <div className="border-t border-gold-500/20 px-6 py-4 text-center text-[11px] tracking-widest text-gold-500/80">
        © {new Date().getFullYear()} URIEL DIAMONDS BY VINAY JEWELLERS ·{" "}
        <Link href="/admin" className="hover:text-gold-400">OWNER LOGIN</Link>
      </div>
    </footer>
  );
}
