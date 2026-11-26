"use client";
import { useState } from "react";

export default function RequestForm() {
  const [state, setState] = useState({ busy: false, error: "", done: false });

  async function onSubmit(e) {
    e.preventDefault();
    setState({ busy: true, error: "", done: false });
    try {
      const res = await fetch("/api/requests", { method: "POST", body: new FormData(e.currentTarget) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not send your request.");
      setState({ busy: false, error: "", done: true });
    } catch (err) {
      setState({ busy: false, error: err.message, done: false });
    }
  }

  if (state.done) {
    return (
      <div role="status" className="border border-gold-500 bg-forest-100 p-8 text-center">
        <p className="font-serif text-3xl">Thank you</p>
        <p className="mt-3 text-forest-800">Your request has been received. Vinay will contact you soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Honeypot for bots; hidden from people and assistive tech */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div>
        <label htmlFor="name" className="label">Your name *</label>
        <input id="name" name="name" required maxLength={100} autoComplete="name" className="field" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className="label">Phone / WhatsApp *</label>
          <input id="phone" name="phone" type="tel" required maxLength={30} autoComplete="tel" className="field" />
        </div>
        <div>
          <label htmlFor="email" className="label">Email</label>
          <input id="email" name="email" type="email" maxLength={120} autoComplete="email" className="field" />
        </div>
      </div>
      <div>
        <label htmlFor="type" className="label">Type of ornament *</label>
        <select id="type" name="type" required defaultValue="" className="field">
          <option value="" disabled>Select…</option>
          <option>Ring</option>
          <option>Earrings</option>
          <option>Bracelet</option>
          <option>Other</option>
        </select>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="budget" className="label">Budget (optional)</label>
          <input id="budget" name="budget" maxLength={60} className="field" />
        </div>
        <div>
          <label htmlFor="metal" className="label">Metal / stone (optional)</label>
          <input id="metal" name="metal" maxLength={60} placeholder="e.g. 18k yellow gold" className="field" />
        </div>
      </div>
      <div>
        <label htmlFor="details" className="label">Describe your idea *</label>
        <textarea id="details" name="details" required rows={5} maxLength={3000} className="field" />
      </div>
      <div>
        <label htmlFor="images" className="label">Reference images (up to 5, JPG/PNG/WebP, 8 MB each)</label>
        <input id="images" name="images" type="file" accept="image/jpeg,image/png,image/webp" multiple className="field" />
      </div>

      {state.error && <p role="alert" className="text-sm text-red-700">{state.error}</p>}
      <button type="submit" disabled={state.busy} className="btn-green w-full">
        {state.busy ? "Sending…" : "Submit request"}
      </button>
    </form>
  );
}
