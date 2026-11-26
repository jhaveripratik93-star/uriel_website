import { NextResponse } from "next/server";
import { checkPassword, createSession } from "@/lib/auth";

// Basic in-memory throttle: 5 failed attempts per 15 minutes per IP.
const attempts = new Map();

export async function POST(req) {
  const ip = req.headers.get("x-forwarded-for") || "local";
  const rec = attempts.get(ip) || { n: 0, t: Date.now() };
  if (Date.now() - rec.t > 15 * 60 * 1000) { rec.n = 0; rec.t = Date.now(); }
  if (rec.n >= 5) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }

  const { password } = await req.json().catch(() => ({}));
  if (!checkPassword(password)) {
    rec.n += 1;
    attempts.set(ip, rec);
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }
  attempts.delete(ip);
  createSession();
  return NextResponse.json({ ok: true });
}
