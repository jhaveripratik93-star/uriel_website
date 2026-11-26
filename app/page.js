import Link from "next/link";
import { readDb } from "@/lib/db";
import JourneyCard from "@/components/JourneyCard";
import PromoBanner from "@/components/PromoBanner";
import DesignCard from "@/components/DesignCard";

export const dynamic = "force-dynamic";

const SAMPLE = {
  category: "Sample",
  title: "Leaf Solitaire Ring",
  requestText: "A solitaire ring with a leaf-inspired band, around 1 carat.",
  requestImages: [],
  customNote: "Three tailored concepts shared with the client to choose from.",
  customImages: [],
  finalNote: "The approved design, crafted and delivered.",
  finalImages: [],
};

const categories = [
  { name: "Rings", icon: "💍", text: "Solitaires, bands and statement pieces." },
  { name: "Earrings", icon: "✨", text: "Studs, drops and everyday sparkle." },
  { name: "Bracelets", icon: "◇", text: "Tennis, charm and bespoke cuffs." },
];

export default async function Home() {
  const db = await readDb();
  const featured = db.journeys.filter((j) => j.published)[0];
  const promo = db.promo;
  const designs = db.designs.slice(0, 8);

  return (
    <>
      <section className="bg-gradient-to-br from-forest-900 to-forest-700 px-6 py-24 text-center text-ivory-200 sm:py-32">
        <p className="text-xs uppercase tracking-[0.5em] text-gold-500">Custom Diamond Jewellery</p>
        <h1 className="mx-auto mt-5 max-w-3xl font-serif text-5xl leading-tight sm:text-6xl">
          Your imagination,<br />set in diamonds.
        </h1>
        <p className="mx-auto mt-6 max-w-xl opacity-85">
          Tell us what you dream of. We design it, refine it with you, and craft it by hand.
        </p>
        <Link href="/request" className="btn-gold mt-9">Request your piece</Link>
      </section>

      {promo?.enabled && <PromoBanner promo={promo} />}

      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <p className="eyebrow">Crafted for you</p>
        <h2 className="mt-3 font-serif text-4xl">Rings · Earrings · Bracelets</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {categories.map((c) => (
            <Link key={c.name} href="/request" className="border border-gold-500 bg-forest-100 px-6 py-12 transition hover:bg-forest-100/60">
              <span className="text-4xl" aria-hidden="true">{c.icon}</span>
              <span className="mt-4 block font-serif text-2xl">{c.name}</span>
              <span className="mt-2 block text-sm text-forest-700">{c.text}</span>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="new-designs" className="bg-forest-100 px-6 py-20">
        <div className="mx-auto max-w-6xl text-center">
          <p className="eyebrow">Just arrived</p>
          <h2 id="new-designs" className="mt-3 font-serif text-4xl">New Designs</h2>
          {designs.length === 0 ? (
            <p className="mt-8 text-forest-800">Fresh designs are on their way. Check back soon.</p>
          ) : (
            <ul className="mt-10 grid gap-6 text-left sm:grid-cols-2 lg:grid-cols-4">
              {designs.map((d) => (
                <li key={d.id}><DesignCard design={d} /></li>
              ))}
            </ul>
          )}
          <Link href="/request" className="btn-green mt-10">Request something similar</Link>
        </div>
      </section>

      <section className="bg-forest-900 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center text-ivory-200">
            <p className="text-xs uppercase tracking-[0.35em] text-gold-500">The custom journey</p>
            <h2 className="mt-3 font-serif text-4xl">From request to final design</h2>
          </div>
          <JourneyCard journey={featured || SAMPLE} />
          <div className="mt-8 text-center">
            <Link href="/journeys" className="btn-gold">See all journeys</Link>
          </div>
        </div>
      </section>

      <section id="about" className="mx-auto max-w-3xl px-6 py-20 text-center">
        <p className="eyebrow">About Uriel</p>
        <h2 className="mt-3 font-serif text-4xl">Designed by Vinay, made for you</h2>
        {/* TODO: replace with the client's own story */}
        <p className="mt-6 leading-relaxed text-forest-800">
          Uriel Diamonds is the custom jewellery studio of Vinay Jewellers. Every ring, pair of earrings
          and bracelet starts with your idea and is shaped through Vinay&apos;s own designs, so the finished
          piece is truly yours.
        </p>
      </section>
    </>
  );
}
