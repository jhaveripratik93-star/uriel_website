import { isAdmin } from "@/lib/auth";
import { readDb } from "@/lib/db";
import LoginForm from "./LoginForm";
import Dashboard from "./Dashboard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Owner Login | Uriel Diamonds", robots: { index: false, follow: false } };

export default async function AdminPage() {
  if (!isAdmin()) return <LoginForm />;
  const db = await readDb();
  return <Dashboard requests={db.requests} journeys={db.journeys} promo={db.promo} designs={db.designs} />;
}
