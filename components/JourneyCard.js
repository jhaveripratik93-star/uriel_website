function Gallery({ images, label }) {
  if (!images?.length) {
    return (
      <div className="flex aspect-square items-center justify-center bg-forest-700/60 text-3xl text-gold-500" aria-hidden="true">◆</div>
    );
  }
  return (
    <div className={`grid gap-1 ${images.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
      {images.slice(0, 4).map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={src} src={src} alt={`${label} ${i + 1}`} loading="lazy" className="aspect-square w-full object-cover" />
      ))}
    </div>
  );
}

function Step({ n, title, images, text, highlight }) {
  return (
    <div className={`flex flex-col border p-5 ${highlight ? "border-gold-500 bg-forest-800" : "border-gold-500/50 bg-forest-900/40"}`}>
      <p className="text-[11px] uppercase tracking-[0.25em] text-gold-500">{n} · {title}</p>
      <div className="my-4"><Gallery images={images} label={title} /></div>
      {text ? <p className="text-sm leading-relaxed text-ivory-200/85">{text}</p> : null}
    </div>
  );
}

export default function JourneyCard({ journey }) {
  return (
    <article className="bg-forest-800 p-6 text-ivory-200 sm:p-8">
      <header className="mb-6 text-center">
        <p className="text-[11px] uppercase tracking-[0.35em] text-gold-500">{journey.category}</p>
        <h3 className="mt-1 font-serif text-3xl">{journey.title}</h3>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        <Step n="1" title="Client Request" images={journey.requestImages} text={journey.requestText} />
        <Step n="2" title="Customised by Vinay" images={journey.customImages} text={journey.customNote} />
        <Step n="3" title="Final Piece" images={journey.finalImages} text={journey.finalNote} highlight />
      </div>
    </article>
  );
}
