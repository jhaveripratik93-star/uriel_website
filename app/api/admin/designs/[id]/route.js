import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { updateDb, deleteUploads } from "@/lib/db";

export async function DELETE(_req, { params }) {
  if (!isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const image = await updateDb((db) => {
    const i = db.designs.findIndex((d) => d.id === params.id);
    if (i < 0) return null;
    return db.designs.splice(i, 1)[0].image;
  });
  if (image === null) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await deleteUploads([image]);
  return NextResponse.json({ ok: true });
}
