import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE = "uriel_admin";
const TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error("SESSION_SECRET is not set");
  return s;
}

const sign = (v) => crypto.createHmac("sha256", secret()).update(v).digest("hex");

function safeEqual(a, b) {
  const ha = crypto.createHash("sha256").update(a).digest();
  const hb = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

export function checkPassword(input) {
  const real = process.env.ADMIN_PASSWORD;
  if (!real || typeof input !== "string") return false;
  return safeEqual(input, real);
}

export function createSession() {
  const exp = String(Date.now() + TTL_MS);
  cookies().set(COOKIE, `${exp}.${sign(exp)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: TTL_MS / 1000,
  });
}

export function destroySession() {
  cookies().delete(COOKIE);
}

export function isAdmin() {
  const token = cookies().get(COOKIE)?.value;
  if (!token) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  return safeEqual(sig, sign(exp));
}
