import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { updateDb, newId, saveImages } from "@/lib/db";

const clip = (v, n) => String(v ?? "").trim().slice(0, n);

export async function POST(req) {
  if (!isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const form = await req.formData();
    const title = clip(form.get("title"), 100);
    if (!title) return NextResponse.json({ error: "Title is required." }, { status: 400 });
    const [image] = await saveImages([form.get("image")], 1);
    if (!image) return NextResponse.json({ error: "Please add a photo of the design." }, { status: 400 });

    await updateDb((db) => {
      db.designs.unshift({
        id: newId(),
        createdAt: new Date().toISOString(),
        title,
        category: clip(form.get("category"), 20) || "Ring",
        description: clip(form.get("description"), 400),
        image,
      });
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e.message || "Something went wrong." }, { status: 400 });
  }
}
