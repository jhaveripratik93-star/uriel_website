import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { updateDb, deleteUploads } from "@/lib/db";

const STATUSES = ["new", "in-progress", "completed"];

export async function PATCH(req, { params }) {
  if (!isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { status } = await req.json().catch(() => ({}));
  if (!STATUSES.includes(status)) return NextResponse.json({ error: "Bad status" }, { status: 400 });
  const found = await updateDb((db) => {
    const r = db.requests.find((x) => x.id === params.id);
    if (r) r.status = status;
    return !!r;
  });
  return found ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function DELETE(_req, { params }) {
  if (!isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const removed = await updateDb((db) => {
    const i = db.requests.findIndex((x) => x.id === params.id);
    if (i < 0) return null;
    const [r] = db.requests.splice(i, 1);
    // Keep images that a journey still references.
    const used = new Set(db.journeys.flatMap((j) => j.requestImages));
    return r.images.filter((u) => !used.has(u));
  });
  if (!removed) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await deleteUploads(removed);
  return NextResponse.json({ ok: true });
}
