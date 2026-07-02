"use client";

import { motion } from "framer-motion";
import Reveal from "./Reveal";

const COLLECTIONS = [
  {
    id: "coleccion",
    title: "Editorial viva",
    tag: "Venta / tendencia",
    description:
      "Piezas de alto impacto con fotografía real, selección curada y disponibilidad pensada para destacar.",
  },
  {
    id: "alquiler",
    title: "Alquiler premium",
    tag: "Eventos",
    description:
      "Vestidos para graduaciones, celebraciones, sesiones y ocasiones donde el look necesita presencia.",
  },
  {
    id: "novias",
    title: "Novias",
    tag: "Alquiler / Venta",
    description:
      "Acompañamiento de imagen, ajustes y un espacio pensado para pruebas tranquilas y asesoría cercana.",
  },
];

export default function Collections() {
  return (
    <section className="bg-paper px-6 py-28 md:px-10">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-16 flex items-end justify-between">
          <h2 className="font-display text-4xl text-ink sm:text-5xl">
            Colecciones
          </h2>
          <span className="hidden font-detail text-xs uppercase tracking-[0.25em] text-greenish-gray sm:block">
            Curadas para cada ocasión
          </span>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-3">
          {COLLECTIONS.map((c, i) => (
            <Reveal key={c.id} delay={i * 0.1}>
              <motion.a
                id={c.id}
                href={`#${c.id}`}
                whileHover="hover"
                initial="rest"
                animate="rest"
                variants={{
                  rest: { borderColor: "#ddd8d2" },
                  hover: { borderColor: "#822e36" },
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex h-full flex-col justify-between border bg-white/40 p-8"
              >
                <div>
                  <span className="font-detail text-[11px] uppercase tracking-[0.25em] text-light-coffee">
                    {c.tag}
                  </span>
                  <h3 className="mt-4 font-display text-2xl text-ink">
                    {c.title}
                  </h3>
                  <p className="mt-3 font-body text-sm leading-relaxed text-ink/70">
                    {c.description}
                  </p>
                </div>
                <motion.span
                  variants={{
                    rest: { opacity: 0, x: -6 },
                    hover: { opacity: 1, x: 0 },
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="mt-8 font-detail text-xs uppercase tracking-[0.2em] text-claret"
                >
                  Ver más →
                </motion.span>
              </motion.a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
