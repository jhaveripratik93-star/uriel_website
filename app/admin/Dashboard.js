"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import PromoBanner from "@/components/PromoBanner";
import DesignCard from "@/components/DesignCard";

// Shows a local preview URL for a chosen file, falling back to the saved one.
function useFilePreview(initial = "") {
  const [url, setUrl] = useState(initial);
  const [removed, setRemoved] = useState(false);
  function onFile(e) {
    const f = e.target.files?.[0];
    setRemoved(false);
    setUrl(f && f.type.startsWith("image/") ? URL.createObjectURL(f) : initial);
  }
  return { url: removed ? "" : url, onFile, setRemoved };
}

function PreviewBox({ title, children }) {
  return (
    <div className="mt-8 border border-gold-500">
      <p className="bg-gold-500 px-4 py-2 text-xs uppercase tracking-[0.25em] text-forest-900">
        Live preview · {title} <span className="opacity-70">(not saved until you click Save)</span>
      </p>
      <div className="overflow-hidden bg-ivory-100">{children}</div>
    </div>
  );
}

function PromoEditor({ promo, busy, onSubmit }) {
  const [v, setV] = useState({
    eyebrow: promo?.eyebrow || "",
    headline: promo?.headline || "",
    text: promo?.text || "",
    ctaLabel: promo?.ctaLabel || "",
    ctaLink: promo?.ctaLink || "",
  });
  const img = useFilePreview(promo?.image || "");
  const set = (k) => (e) => setV((p) => ({ ...p, [k]: e.target.value }));

  return (
    <div>
      <form onSubmit={onSubmit} className="mt-6 space-y-5">
        <p className="text-sm text-forest-800">A banner shown near the top of the home page, for offers, festivals or announcements.</p>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="enabled" defaultChecked={promo?.enabled ?? true} /> Show this promotion on the home page
        </label>
        <div>
          <label htmlFor="eyebrow" className="label">Small label (optional)</label>
          <input id="eyebrow" name="eyebrow" maxLength={60} value={v.eyebrow} onChange={set("eyebrow")} placeholder="e.g. Festive offer" className="field" />
        </div>
        <div>
          <label htmlFor="headline" className="label">Headline *</label>
          <input id="headline" name="headline" required maxLength={120} value={v.headline} onChange={set("headline")} className="field" />
        </div>
        <div>
          <label htmlFor="text" className="label">Message</label>
          <textarea id="text" name="text" rows={3} maxLength={500} value={v.text} onChange={set("text")} className="field" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="ctaLabel" className="label">Button text</label>
            <input id="ctaLabel" name="ctaLabel" maxLength={30} value={v.ctaLabel} onChange={set("ctaLabel")} placeholder="Request a design" className="field" />
          </div>
          <div>
            <label htmlFor="ctaLink" className="label">Button link</label>
            <input id="ctaLink" name="ctaLink" maxLength={300} value={v.ctaLink} onChange={set("ctaLink")} placeholder="/request or https://..." className="field" />
          </div>
        </div>
        <div>
          <label htmlFor="promoImage" className="label">Banner image (optional)</label>
          <input id="promoImage" name="image" type="file" accept="image/jpeg,image/png,image/webp" onChange={img.onFile} className="field" />
          {promo?.image && (
            <label className="mt-2 flex items-center gap-2 text-sm">
              <input type="checkbox" name="removeImage" onChange={(e) => img.setRemoved(e.target.checked)} /> Remove current image
            </label>
          )}
        </div>
        <button type="submit" disabled={busy} className="btn-green">{busy ? "Saving…" : "Save promotion"}</button>
      </form>
      <PreviewBox title="Promotion banner">
        {v.headline ? <PromoBanner promo={{ ...v, image: img.url }} /> : <p className="p-6 text-sm text-forest-800">Type a headline to see the banner.</p>}
      </PreviewBox>
    </div>
  );
}

function DesignEditor({ busy, onSubmit }) {
  const [v, setV] = useState({ title: "", category: "Ring", description: "" });
  const img = useFilePreview("");
  const set = (k) => (e) => setV((p) => ({ ...p, [k]: e.target.value }));

  return (
    <div>
      <form
        onSubmit={async (e) => {
          const ok = await onSubmit(e);
          if (ok) { setV({ title: "", category: "Ring", description: "" }); img.onFile({ target: { files: [] } }); }
        }}
        className="space-y-5"
      >
        <p className="text-sm text-forest-800">Add a new piece to the &quot;New Designs&quot; section of the home page (the latest 8 are shown).</p>
        <div className="grid gap-5 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label htmlFor="dTitle" className="label">Design name *</label>
            <input id="dTitle" name="title" required maxLength={100} value={v.title} onChange={set("title")} className="field" />
          </div>
          <div>
            <label htmlFor="dCategory" className="label">Category</label>
            <select id="dCategory" name="category" value={v.category} onChange={set("category")} className="field"><option>Ring</option><option>Earrings</option><option>Bracelet</option><option>Other</option></select>
          </div>
        </div>
        <div>
          <label htmlFor="dDesc" className="label">Short description</label>
          <textarea id="dDesc" name="description" rows={2} maxLength={400} value={v.description} onChange={set("description")} className="field" />
        </div>
        <div>
          <label htmlFor="dImage" className="label">Photo *</label>
          <input id="dImage" name="image" type="file" required accept="image/jpeg,image/png,image/webp" onChange={img.onFile} className="field" />
        </div>
        <button type="submit" disabled={busy} className="btn-green">{busy ? "Saving…" : "Add design"}</button>
      </form>
      <PreviewBox title="Design card">
        <div className="max-w-xs p-4"><DesignCard design={{ ...v, image: img.url }} /></div>
      </PreviewBox>
    </div>
  );
}

const fmt = (iso) => new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

function Thumbs({ images }) {
  if (!images?.length) return null;
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {images.map((src) => (
        <a key={src} href={src} target="_blank" rel="noreferrer">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="Reference" className="h-16 w-16 object-cover" />
        </a>
      ))}
    </div>
  );
}

function FileField({ id, name, label, max }) {
  return (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      <input id={id} name={name} type="file" multiple accept="image/jpeg,image/png,image/webp" className="field" />
      <p className="mt-1 text-xs text-forest-700">Up to {max} images, 8 MB each.</p>
    </div>
  );
}

export default function Dashboard({ requests, journeys, promo, designs }) {
  const router = useRouter();
  const [tab, setTab] = useState("requests");
  const [msg, setMsg] = useState({ error: "", ok: "" });
  const [busy, setBusy] = useState(false);
  const [prefill, setPrefill] = useState("");

  async function call(url, options) {
    const res = await fetch(url, options);
    const data = await res.json().catch(() => ({}));
    if (res.status === 401) return router.refresh();
    if (!res.ok) throw new Error(data.error || "Request failed.");
    return data;
  }

  async function act(fn) {
    setMsg({ error: "", ok: "" });
    try { await fn(); router.refresh(); } catch (e) { setMsg({ error: e.message, ok: "" }); }
  }

  const setStatus = (id, status) =>
    act(() => call(`/api/admin/requests/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) }));
  const delRequest = (id) => confirm("Delete this request?") &&
    act(() => call(`/api/admin/requests/${id}`, { method: "DELETE" }));
  const togglePublish = (j) =>
    act(() => call(`/api/admin/journeys/${j.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ published: !j.published }) }));
  const delJourney = (id) => confirm("Delete this journey and its images?") &&
    act(() => call(`/api/admin/journeys/${id}`, { method: "DELETE" }));

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  async function createJourney(e) {
    e.preventDefault();
    const form = e.currentTarget;
    setBusy(true);
    setMsg({ error: "", ok: "" });
    try {
      await call("/api/admin/journeys", { method: "POST", body: new FormData(form) });
      form.reset();
      setPrefill("");
      setMsg({ error: "", ok: "Journey saved." });
      router.refresh();
    } catch (err) {
      setMsg({ error: err.message, ok: "" });
    }
    setBusy(false);
  }

  async function submitForm(e, url, okText, reset) {
    e.preventDefault();
    const form = e.currentTarget;
    setBusy(true);
    setMsg({ error: "", ok: "" });
    try {
      await call(url, { method: "POST", body: new FormData(form) });
      if (reset) form.reset();
      setMsg({ error: "", ok: okText });
      router.refresh();
      setBusy(false);
      return true;
    } catch (err) {
      setMsg({ error: err.message, ok: "" });
      setBusy(false);
      return false;
    }
  }

  const delDesign = (id) => confirm("Remove this design from the website?") &&
    act(() => call(`/api/admin/designs/${id}`, { method: "DELETE" }));

  const tabBtn = (id, label) => (
    <button
      onClick={() => { setTab(id); setMsg({ error: "", ok: "" }); }}
      aria-pressed={tab === id}
      className={`px-5 py-2 text-xs uppercase tracking-[0.2em] ${tab === id ? "bg-forest-800 text-ivory-200" : "border border-forest-800 text-forest-800"}`}
    >
      {label}
    </button>
  );

  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-4xl">Owner Dashboard</h1>
        <div className="flex items-center gap-5 text-xs uppercase tracking-[0.2em]">
          <a href="/" target="_blank" rel="noreferrer" className="border border-forest-800 px-4 py-2 hover:bg-forest-800 hover:text-ivory-200">View live site ↗</a>
          <button onClick={logout} className="underline">Log out</button>
        </div>
      </div>
      <p className="mt-2 text-sm text-forest-800">Edits show a live preview below each form. After saving, use &quot;View live site&quot; to see the real home page.</p>

      <div className="mt-6 flex flex-wrap gap-3">
        {tabBtn("requests", `Requests (${requests.length})`)}
        {tabBtn("new", "New journey")}
        {tabBtn("journeys", `Journeys (${journeys.length})`)}
        {tabBtn("designs", `New designs (${designs.length})`)}
        {tabBtn("promo", "Promotion")}
      </div>

      {msg.error && <p role="alert" className="mt-5 text-sm text-red-700">{msg.error}</p>}
      {msg.ok && <p role="status" className="mt-5 text-sm text-forest-700">{msg.ok}</p>}

      {tab === "requests" && (
        <div className="mt-6 space-y-4">
          {requests.length === 0 && <p className="text-forest-800">No requests yet.</p>}
          {requests.map((r) => (
            <article key={r.id} className="border border-forest-700/30 bg-ivory-50 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-serif text-2xl">{r.name} <span className="text-base text-forest-700">· {r.type}</span></p>
                  <p className="text-sm text-forest-800">{r.phone}{r.email ? ` · ${r.email}` : ""} · {fmt(r.createdAt)}</p>
                  {(r.budget || r.metal) && <p className="text-sm text-forest-800">{[r.budget && `Budget: ${r.budget}`, r.metal && `Metal: ${r.metal}`].filter(Boolean).join(" · ")}</p>}
                </div>
                <select aria-label={`Status for ${r.name}`} value={r.status} onChange={(e) => setStatus(r.id, e.target.value)} className="field !w-auto !py-2">
                  <option value="new">New</option>
                  <option value="in-progress">In progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm">{r.details}</p>
              <Thumbs images={r.images} />
              <div className="mt-4 flex gap-5 text-xs uppercase tracking-[0.15em]">
                <button onClick={() => { setPrefill(r.id); setTab("new"); }} className="underline">Create journey</button>
                <button onClick={() => delRequest(r.id)} className="text-red-700 underline">Delete</button>
              </div>
            </article>
          ))}
        </div>
      )}

      {tab === "new" && (
        <form onSubmit={createJourney} className="mt-6 space-y-5">
          <div>
            <label htmlFor="requestId" className="label">Link to a client request (optional)</label>
            <select id="requestId" name="requestId" value={prefill} onChange={(e) => setPrefill(e.target.value)} className="field">
              <option value="">None (manual entry)</option>
              {requests.map((r) => <option key={r.id} value={r.id}>{r.name} · {r.type} · {fmt(r.createdAt)}</option>)}
            </select>
            <p className="mt-1 text-xs text-forest-700">Linking copies the client&apos;s idea and reference images. The client&apos;s name is never shown publicly.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label htmlFor="title" className="label">Title *</label>
              <input id="title" name="title" required maxLength={120} className="field" />
            </div>
            <div>
              <label htmlFor="category" className="label">Category</label>
              <select id="category" name="category" className="field"><option>Ring</option><option>Earrings</option><option>Bracelet</option><option>Other</option></select>
            </div>
          </div>
          <div>
            <label htmlFor="requestText" className="label">What the client asked for (public)</label>
            <textarea id="requestText" name="requestText" rows={3} maxLength={2000} className="field" placeholder="Leave empty to use the linked request's text" />
          </div>
          <FileField id="requestImages" name="requestImages" label="Extra request images" max={5} />
          <FileField id="customImages" name="customImages" label="Customised design options" max={8} />
          <div>
            <label htmlFor="customNote" className="label">Note about the customisation</label>
            <textarea id="customNote" name="customNote" rows={3} maxLength={2000} className="field" />
          </div>
          <FileField id="finalImages" name="finalImages" label="Final design photos" max={8} />
          <div>
            <label htmlFor="finalNote" className="label">Note about the final piece</label>
            <textarea id="finalNote" name="finalNote" rows={3} maxLength={2000} className="field" />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="published" /> Publish on the website now
          </label>
          <button type="submit" disabled={busy} className="btn-green">{busy ? "Saving…" : "Save journey"}</button>
        </form>
      )}

      {tab === "promo" && (
        <PromoEditor key={JSON.stringify(promo)} promo={promo} busy={busy} onSubmit={(e) => submitForm(e, "/api/admin/promo", "Promotion saved.", false)} />
      )}

      {tab === "designs" && (
        <div className="mt-6 space-y-8">
          <DesignEditor busy={busy} onSubmit={(e) => submitForm(e, "/api/admin/designs", "Design added to the home page.", true)} />

          <div className="space-y-3">
            {designs.length === 0 && <p className="text-forest-800">No designs added yet.</p>}
            {designs.map((d) => (
              <article key={d.id} className="flex items-center gap-4 border border-forest-700/30 bg-ivory-50 p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={d.image} alt={d.title} className="h-16 w-16 object-cover" />
                <div className="flex-1">
                  <p className="font-serif text-xl">{d.title}</p>
                  <p className="text-sm text-forest-800">{d.category} · {fmt(d.createdAt)}</p>
                </div>
                <button onClick={() => delDesign(d.id)} className="text-xs uppercase tracking-[0.15em] text-red-700 underline">Remove</button>
              </article>
            ))}
          </div>
        </div>
      )}

      {tab === "journeys" && (
        <div className="mt-6 space-y-4">
          {journeys.length === 0 && <p className="text-forest-800">No journeys yet.</p>}
          {journeys.map((j) => (
            <article key={j.id} className="flex flex-wrap items-center justify-between gap-4 border border-forest-700/30 bg-ivory-50 p-5">
              <div>
                <p className="font-serif text-2xl">{j.title}</p>
                <p className="text-sm text-forest-800">{j.category} · {fmt(j.createdAt)} · {j.published ? "Published" : "Draft"}</p>
              </div>
              <div className="flex gap-5 text-xs uppercase tracking-[0.15em]">
                <a href={`/admin/preview/${j.id}`} target="_blank" rel="noreferrer" className="underline">Preview</a>
                <button onClick={() => togglePublish(j)} className="underline">{j.published ? "Unpublish" : "Publish"}</button>
                <button onClick={() => delJourney(j.id)} className="text-red-700 underline">Delete</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
