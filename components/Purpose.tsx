import Reveal from "./Reveal";

export default function Purpose() {
  return (
    <section id="propósito" className="bg-paper px-6 py-28 md:px-10">
      <Reveal className="mx-auto max-w-3xl text-center">
        <span className="font-detail text-xs uppercase tracking-[0.3em] text-greenish-gray">
          Propósito
        </span>
        <p className="mt-8 font-display text-2xl italic leading-relaxed text-ink sm:text-3xl">
          &ldquo;Acompañamos a cada persona para que exprese su esencia con
          seguridad y elegancia, entregando experiencias únicas, y prendas
          con diseños modernos adecuados a cada ocasión especial.&rdquo;
        </p>
      </Reveal>
    </section>
  );
}
