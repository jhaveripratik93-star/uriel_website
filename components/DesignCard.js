// Shared by the home page and the admin live preview.
export default function DesignCard({ design }) {
  return (
    <div className="border border-gold-500/60 bg-ivory-50">
      {design.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={design.image} alt={design.title} loading="lazy" className="aspect-square w-full object-cover" />
      ) : (
        <div className="flex aspect-square items-center justify-center bg-forest-700/60 text-3xl text-gold-500" aria-hidden="true">◆</div>
      )}
      <div className="p-4">
        <p className="text-[10px] uppercase tracking-[0.3em] text-gold-600">{design.category} · New</p>
        <h3 className="mt-1 font-serif text-2xl">{design.title || "Design name"}</h3>
        {design.description && <p className="mt-1 text-sm text-forest-800">{design.description}</p>}
      </div>
    </div>
  );
}
