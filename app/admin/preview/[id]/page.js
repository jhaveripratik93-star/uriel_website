import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { readDb } from "@/lib/db";
import JourneyCard from "@/components/JourneyCard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Preview | Uriel Diamonds", robots: { index: false, follow: false } };

// Owner-only preview of a journey exactly as visitors will see it, even if it is still a draft.
export default async function PreviewJourney({ params }) {
  if (!isAdmin()) redirect("/admin");
  const db = await readDb();
  const journey = db.journeys.find((j) => j.id === params.id);
  if (!journey) notFound();

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border border-gold-500 bg-ivory-200 px-5 py-3 text-sm">
        <p>
          <strong>Preview</strong> · {journey.published ? "This journey is live on the website." : "Draft: visitors cannot see this yet."}
        </p>
        <Link href="/admin" className="underline">Back to dashboard</Link>
      </div>
      <JourneyCard journey={journey} />
    </section>
  );
}
