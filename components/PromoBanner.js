// Shared by the home page and the admin live preview.
export default function PromoBanner({ promo }) {
  if (!promo?.headline) return null;
  return (
    <section aria-label="Promotion" className="border-y border-gold-500 bg-ivory-200">
      <div className={`mx-auto grid max-w-6xl items-center gap-8 px-6 py-12 ${promo.image ? "md:grid-cols-2" : "text-center"}`}>
        <div>
          {promo.eyebrow && <p className="eyebrow !text-gold-600">{promo.eyebrow}</p>}
          <h2 className="mt-2 font-serif text-4xl text-forest-800 sm:text-5xl">{promo.headline}</h2>
          {promo.text && <p className="mt-4 max-w-xl text-forest-800">{promo.text}</p>}
          {promo.ctaLabel && promo.ctaLink && (
            <a href={promo.ctaLink} className="btn-green mt-6">{promo.ctaLabel}</a>
          )}
        </div>
        {promo.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={promo.image} alt={promo.headline} className="max-h-80 w-full object-cover" />
        )}
      </div>
    </section>
  );
}
