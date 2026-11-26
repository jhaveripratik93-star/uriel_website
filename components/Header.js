import Link from "next/link";
import Logo from "./Logo";

const links = [
  { href: "/", label: "Home" },
  { href: "/journeys", label: "Custom Journeys" },
  { href: "/#about", label: "About" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-30 bg-forest-800/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-4">
        <Logo />
        <nav aria-label="Main" className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs uppercase tracking-[0.2em] text-ivory-200">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-gold-400">{l.label}</Link>
          ))}
          <Link href="/request" className="border border-gold-500 px-4 py-2 text-gold-500 hover:bg-gold-500 hover:text-forest-900">
            Request a Design
          </Link>
        </nav>
      </div>
    </header>
  );
}
