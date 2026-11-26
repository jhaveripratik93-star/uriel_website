import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { updateDb, deleteUploads } from "@/lib/db";

export async function PATCH(req, { params }) {
  if (!isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { published } = await req.json().catch(() => ({}));
  if (typeof published !== "boolean") return NextResponse.json({ error: "Bad request" }, { status: 400 });
  const found = await updateDb((db) => {
    const j = db.journeys.find((x) => x.id === params.id);
    if (j) j.published = published;
    return !!j;
  });
  return found ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function DELETE(_req, { params }) {
  if (!isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const files = await updateDb((db) => {
    const i = db.journeys.findIndex((x) => x.id === params.id);
    if (i < 0) return null;
    const [j] = db.journeys.splice(i, 1);
    // Don't delete request images still owned by the original request.
    const owned = new Set(db.requests.flatMap((r) => r.images));
    return [...j.requestImages.filter((u) => !owned.has(u)), ...j.customImages, ...j.finalImages];
  });
  if (!files) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await deleteUploads(files);
  return NextResponse.json({ ok: true });
}
