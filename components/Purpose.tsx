import Reveal from "./Reveal";

export default function Purpose() {
  return (
    <section id="propósito" className="bg-paper px-6 py-28 md:px-10">
      <Reveal className="mx-auto max-w-3xl text-center">
        <span className="font-detail text-xs uppercase tracking-[0.3em] text-greenish-gray">
          Experiencia
        </span>
        <p className="mt-8 font-display text-2xl italic leading-relaxed text-ink sm:text-3xl">
          &ldquo;ALTEA combina asesoría, alquiler, venta y un catálogo vivo para
          que cada cita se sienta como una experiencia privada, visual y precisa
          desde el primer scroll.&rdquo;
        </p>
        <div className="mt-10 grid gap-4 text-left sm:grid-cols-3">
          {[
            "Atención personalizada para eventos, novias y sesiones especiales.",
            "Pruebas guiadas, pagos PSE listos para integrar y checkout asistido.",
            "WhatsApp directo, reservas por agenda y acompañamiento de styling.",
          ].map((item) => (
            <div
              key={item}
              className="border border-ink/10 bg-white/60 p-5 font-body text-sm leading-relaxed text-ink/75"
            >
              {item}
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
