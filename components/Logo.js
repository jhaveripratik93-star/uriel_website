import Link from "next/link";

// Text logo until the client supplies the real logo file.
export default function Logo({ className = "" }) {
  return (
    <Link href="/" aria-label="Uriel Diamonds by Vinay Jewellers - home" className={`block leading-none ${className}`}>
      <span className="block font-serif text-2xl tracking-[0.3em] text-ivory-200 sm:text-3xl">URIEL</span>
      <span className="mt-1 block text-[9px] uppercase tracking-[0.4em] text-gold-500">Diamonds · by Vinay Jewellers</span>
    </Link>
  );
}
