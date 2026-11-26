import RequestForm from "./RequestForm";

export const metadata = { title: "Request a Design | Uriel Diamonds" };

export default function RequestPage() {
  return (
    <section className="mx-auto max-w-xl px-6 py-16">
      <div className="mb-10 text-center">
        <p className="eyebrow">Request a design</p>
        <h1 className="mt-3 font-serif text-5xl">Tell us what you have in mind</h1>
        <p className="mt-4 text-forest-800">Vinay will review your idea and get back to you with customised design options.</p>
      </div>
      <RequestForm />
    </section>
  );
}
