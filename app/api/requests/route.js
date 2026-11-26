import { NextResponse } from "next/server";
import { updateDb, newId, saveImages } from "@/lib/db";

const TYPES = ["Ring", "Earrings", "Bracelet", "Other"];
const clip = (v, n) => String(v ?? "").trim().slice(0, n);

export async function POST(req) {
  try {
    const form = await req.formData();
    if (clip(form.get("website"), 10)) return NextResponse.json({ ok: true }); // honeypot

    const name = clip(form.get("name"), 100);
    const phone = clip(form.get("phone"), 30);
    const email = clip(form.get("email"), 120);
    const type = clip(form.get("type"), 20);
    const details = clip(form.get("details"), 3000);

    if (!name || !phone || !details) {
      return NextResponse.json({ error: "Name, phone and your idea are required." }, { status: 400 });
    }
    if (!TYPES.includes(type)) {
      return NextResponse.json({ error: "Please choose a type of ornament." }, { status: 400 });
    }

    const images = await saveImages(form.getAll("images"), 5);
    const request = {
      id: newId(),
      createdAt: new Date().toISOString(),
      status: "new",
      name, phone, email, type,
      budget: clip(form.get("budget"), 60),
      metal: clip(form.get("metal"), 60),
      details,
      images,
    };
    await updateDb((db) => void db.requests.unshift(request));
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e.message || "Something went wrong." }, { status: 400 });
  }
}
