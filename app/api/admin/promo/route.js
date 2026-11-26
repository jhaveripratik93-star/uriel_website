import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { updateDb, saveImages, deleteUploads } from "@/lib/db";

const clip = (v, n) => String(v ?? "").trim().slice(0, n);
// Only allow site-relative or https links (blocks javascript: etc.)
const safeLink = (v) => (/^(\/(?!\/)|https:\/\/)/.test(v) ? v : "");

export async function POST(req) {
  if (!isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const form = await req.formData();
    const headline = clip(form.get("headline"), 120);
    if (!headline) return NextResponse.json({ error: "Headline is required." }, { status: 400 });
    const rawLink = clip(form.get("ctaLink"), 300);
    if (rawLink && !safeLink(rawLink)) {
      return NextResponse.json({ error: "Button link must start with / or https://" }, { status: 400 });
    }
    const [newImage] = await saveImages([form.get("image")], 1);

    const oldImage = await updateDb((db) => {
      const prev = db.promo?.image || "";
      const removing = form.get("removeImage") === "on";
      db.promo = {
        enabled: form.get("enabled") === "on",
        eyebrow: clip(form.get("eyebrow"), 60),
        headline,
        text: clip(form.get("text"), 500),
        ctaLabel: clip(form.get("ctaLabel"), 30),
        ctaLink: rawLink,
        image: newImage || (removing ? "" : prev),
      };
      return newImage || removing ? prev : "";
    });
    if (oldImage) await deleteUploads([oldImage]);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e.message || "Something went wrong." }, { status: 400 });
  }
}
