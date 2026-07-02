import Reveal from "./Reveal";

const STEPS = [
  {
    label: "Descubre",
    accent: "var(--color-claret)",
    text: "Explora un catálogo amplio con filtros por venta, alquiler, novias y accesorios, acompañado de imágenes reales y piezas curadas para impactar.",
  },
  {
    label: "Reserva",
    accent: "var(--color-light-coffee)",
    text: "Agenda tu cita, envía la fecha y hora por WhatsApp y deja listo el flujo de atención para probar, ajustar y confirmar tu look.",
  },
  {
    label: "Compra",
    accent: "var(--color-greenish-gray)",
    text: "El carrito centraliza el pedido y el checkout queda preparado para conectar API PSE, tarjeta o confirmación asistida.",
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
