import Reveal from "./Reveal";

const STEPS = [
  {
    label: "Por qué",
    accent: "var(--color-claret)",
    text: "Acompañamos a cada persona para que exprese su esencia con seguridad y elegancia, entregando experiencias únicas en cada ocasión especial.",
  },
  {
    label: "Cómo",
    accent: "var(--color-light-coffee)",
    text: "Asesoría de imagen, ajuste a medida, espacios exclusivos para prepararse antes del evento y un catálogo curado de piezas de alto valor.",
  },
  {
    label: "Qué",
    accent: "var(--color-greenish-gray)",
    text: "Alquiler y venta de vestidos para grados, quinceañeras, novias, primeras comuniones, bautizos y eventos sociales en general.",
  },
];

export default function GoldenCircle() {
  return (
    <section className="bg-ink px-6 py-28 md:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-16 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <Reveal key={step.label} delay={i * 0.12} className="flex flex-col">
              <div
                className="h-px w-10"
                style={{ backgroundColor: step.accent }}
                aria-hidden="true"
              />
              <span
                className="mt-6 font-detail text-xs uppercase tracking-[0.3em]"
                style={{ color: step.accent }}
              >
                {String(i + 1).padStart(2, "0")} — {step.label}
              </span>
              <p className="mt-4 font-heading text-lg leading-relaxed text-white/85">
                {step.text}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
