import fs from "fs/promises";
import path from "path";
import { UPLOAD_DIR } from "@/lib/db";

const TYPES = { jpg: "image/jpeg", png: "image/png", webp: "image/webp" };

export async function GET(_req, { params }) {
  const { name } = params;
  if (!/^[a-f0-9-]+\.(jpg|png|webp)$/.test(name)) {
    return new Response("Not found", { status: 404 });
  }
  try {
    const data = await fs.readFile(path.join(UPLOAD_DIR, name));
    return new Response(data, {
      headers: {
        "Content-Type": TYPES[name.split(".").pop()],
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
