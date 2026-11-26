import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { updateDb, newId, saveImages } from "@/lib/db";

const clip = (v, n) => String(v ?? "").trim().slice(0, n);

export async function POST(req) {
  if (!isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const form = await req.formData();
    const title = clip(form.get("title"), 120);
    const category = clip(form.get("category"), 20) || "Ring";
    if (!title) return NextResponse.json({ error: "Title is required." }, { status: 400 });

    const requestId = clip(form.get("requestId"), 60);
    const [customImages, finalImages, extraRequestImages] = await Promise.all([
      saveImages(form.getAll("customImages"), 8),
      saveImages(form.getAll("finalImages"), 8),
      saveImages(form.getAll("requestImages"), 5),
    ]);

    const journey = await updateDb((db) => {
      const src = requestId ? db.requests.find((r) => r.id === requestId) : null;
      const j = {
        id: newId(),
        createdAt: new Date().toISOString(),
        title,
        category,
        requestId: src?.id || "",
        requestText: clip(form.get("requestText"), 2000) || src?.details || "",
        requestImages: [...(src?.images || []), ...extraRequestImages],
        customNote: clip(form.get("customNote"), 2000),
        customImages,
        finalNote: clip(form.get("finalNote"), 2000),
        finalImages,
        published: form.get("published") === "on",
      };
      db.journeys.unshift(j);
      if (src && src.status === "new") src.status = "in-progress";
      return j;
    });
    return NextResponse.json({ ok: true, id: journey.id });
  } catch (e) {
    return NextResponse.json({ error: e.message || "Something went wrong." }, { status: 400 });
  }
}
