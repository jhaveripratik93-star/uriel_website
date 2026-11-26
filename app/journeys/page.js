import Link from "next/link";
import { readDb } from "@/lib/db";
import JourneyCard from "@/components/JourneyCard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Custom Journeys | Uriel Diamonds" };

export default async function Journeys() {
  const db = await readDb();
  const journeys = db.journeys.filter((j) => j.published);

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-12 text-center">
        <p className="eyebrow">Custom journeys</p>
        <h1 className="mt-3 font-serif text-5xl">What was asked. What was made.</h1>
        <p className="mx-auto mt-4 max-w-xl text-forest-800">
          Each piece begins as a client&apos;s idea, is customised by Vinay, and ends as a finished design.
        </p>
      </div>
      {journeys.length === 0 ? (
        <p className="text-center text-forest-800">New journeys are coming soon.</p>
      ) : (
        <div className="space-y-10">
          {journeys.map((j) => <JourneyCard key={j.id} journey={j} />)}
        </div>
      )}
      <div className="mt-12 text-center">
        <Link href="/request" className="btn-green">Request your own</Link>
      </div>
    </section>
  );
}
