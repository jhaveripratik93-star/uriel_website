import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");
export const UPLOAD_DIR = path.join(DATA_DIR, "uploads");

const EMPTY = { requests: [], journeys: [], promo: null, designs: [] };

async function ensure() {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  try {
    await fs.access(DB_FILE);
  } catch {
    await fs.writeFile(DB_FILE, JSON.stringify(EMPTY, null, 2));
  }
}

// Simple serialized write queue so concurrent requests don't corrupt the file.
let queue = Promise.resolve();

export async function readDb() {
  await ensure();
  const raw = await fs.readFile(DB_FILE, "utf8");
  return { ...EMPTY, ...JSON.parse(raw) };
}

export function updateDb(mutator) {
  const run = queue.then(async () => {
    const db = await readDb();
    const result = await mutator(db);
    await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2));
    return result;
  });
  queue = run.catch(() => {});
  return run;
}

export const newId = () => crypto.randomUUID();

const ALLOWED = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
const MAX_BYTES = 8 * 1024 * 1024;

/** Saves uploaded image Files, returns array of public URLs. Throws on invalid files. */
export async function saveImages(files, max = 8) {
  await ensure();
  const valid = files.filter((f) => f && typeof f === "object" && f.size > 0);
  if (valid.length > max) throw new Error(`Please upload at most ${max} images.`);
  const urls = [];
  for (const f of valid) {
    const ext = ALLOWED[f.type];
    if (!ext) throw new Error("Only JPG, PNG or WebP images are allowed.");
    if (f.size > MAX_BYTES) throw new Error("Each image must be under 8 MB.");
    const name = `${crypto.randomUUID()}.${ext}`;
    await fs.writeFile(path.join(UPLOAD_DIR, name), Buffer.from(await f.arrayBuffer()));
    urls.push(`/api/uploads/${name}`);
  }
  return urls;
}

export async function deleteUploads(urls = []) {
  for (const u of urls) {
    const name = u.split("/").pop();
    if (/^[a-f0-9-]+\.(jpg|png|webp)$/.test(name)) {
      await fs.rm(path.join(UPLOAD_DIR, name), { force: true });
    }
  }
}
