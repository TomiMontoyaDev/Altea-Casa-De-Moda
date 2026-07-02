"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { Clock3, MapPin, MessageCircleMore, Sparkles } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const MANIFESTOS = [
  "LA ALTURA DEL ESTILO",
  "ELEGANCIA QUE PERDURA",
  "EL ARTE DE LA PRESENCIA",
  "LUJO SILENCIOSO",
];

const TILE_ROWS = 9;
const TILE_COLS = 8;

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const mosaicRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % MANIFESTOS.length);
    }, 3800);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const letters = titleRef.current?.querySelectorAll(".letter");
      if (!letters?.length) return;

      // Entrada: cada letra del wordmark sube y aparece en cascada
      gsap.from(letters, {
        yPercent: 130,
        opacity: 0,
        duration: 1.2,
        stagger: 0.07,
        ease: "power4.out",
        delay: 0.15,
      });

      // Parallax del mosaico de fondo — se mueve más lento que el scroll
      gsap.to(mosaicRef.current, {
        yPercent: 18,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // "Zoom-through" al estilo tráiler: el wordmark se agranda y se
      // desvanece a medida que el usuario scrollea, como si atravesara
      // la letra hacia la siguiente sección.
      gsap.to(titleRef.current, {
        scale: 5.5,
        opacity: 0,
        ease: "power2.in",
        transformOrigin: "50% 50%",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "60% top",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink"
    >
      {/* Mosaico de wordmark — firma visual de la marca (manual, pág. 2) */}
      <div
        ref={mosaicRef}
        className="pointer-events-none absolute inset-0 flex select-none flex-col justify-between py-4 opacity-70"
        aria-hidden="true"
      >
        {Array.from({ length: TILE_ROWS }).map((_, row) => (
          <div
            key={row}
            className="flex justify-around whitespace-nowrap font-display text-[42px] text-white/[0.05]"
          >
            {Array.from({ length: TILE_COLS }).map((_, col) => (
              <span key={col}>ALTEA</span>
            ))}
          </div>
        ))}
      </div>

      {/* Vignette para legibilidad del centro */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/40 via-transparent to-ink/60" />

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <span className="font-detail text-xs uppercase tracking-[0.3em] text-warm-gray">
          Casa de moda
        </span>

        <h1
          ref={titleRef}
          className="mt-6 font-display text-[15vw] leading-none text-white sm:text-[10rem]"
        >
          {"ALTEA".split("").map((letter, i) => (
            <span key={i} className="letter inline-block">
              {letter}
            </span>
          ))}
        </h1>

        <p
          key={index}
          className="mt-8 font-detail text-sm uppercase tracking-[0.35em] text-light-coffee transition-opacity duration-700"
        >
          {MANIFESTOS[index]}
        </p>

        <div className="mt-12 flex flex-col gap-4 sm:flex-row">
          <a
            href="#coleccion"
            className="border border-white px-8 py-3 font-detail text-[13px] uppercase tracking-[0.15em] text-white transition-colors hover:bg-white hover:text-ink"
          >
            Explorar colección
          </a>
          <a
            href="#alquiler"
            className="bg-claret px-8 py-3 font-detail text-[13px] uppercase tracking-[0.15em] text-white transition-opacity hover:opacity-85"
          >
            Reservar alquiler
          </a>
          <a
            href="/login"
            className="border border-white/40 px-8 py-3 font-detail text-[13px] uppercase tracking-[0.15em] text-white/90 transition-colors hover:border-white hover:bg-white hover:text-ink"
          >
            Ingreso admin
          </a>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
          className="mt-14 grid w-full max-w-4xl gap-4 border border-white/15 bg-white/5 p-4 backdrop-blur-sm sm:grid-cols-3"
        >
          <div className="flex items-center gap-3 text-left text-white">
            <MapPin size={18} />
            <div>
              <p className="font-detail text-[11px] uppercase tracking-[0.25em] text-white/60">
                Ubicación
              </p>
              <p className="mt-1 font-body text-sm text-white/90">
                Av. 30 de Agosto #37-58, Pereira, Risaralda
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-left text-white">
            <Clock3 size={18} />
            <div>
              <p className="font-detail text-[11px] uppercase tracking-[0.25em] text-white/60">
                Horario
              </p>
              <p className="mt-1 font-body text-sm text-white/90">
                Lunes a sábado · 9:00 AM - 12:30 PM y 1:30 PM - 5:00 PM
              </p>
            </div>
          </div>
          <a
            href="https://wa.me/573242227422?text=Hola%20ALTEA%2C%20quiero%20agendar%20una%20cita%20y%20ver%20el%20cat%C3%A1logo."
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-3 text-left text-white transition-opacity hover:opacity-80"
          >
            <MessageCircleMore size={18} />
            <div>
              <p className="font-detail text-[11px] uppercase tracking-[0.25em] text-white/60">
                WhatsApp
              </p>
              <p className="mt-1 font-body text-sm text-white/90">
                324 222 7422 · respuesta rápida
              </p>
            </div>
          </a>
        </motion.div>

        <div className="mt-5 flex items-center gap-2 font-detail text-[11px] uppercase tracking-[0.3em] text-white/60">
          <Sparkles size={14} />
          Scroll inmersivo, catálogo dinámico y reservas directas.
        </div>
      </div>
    </section>
  );
}
