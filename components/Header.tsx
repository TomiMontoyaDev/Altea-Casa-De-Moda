"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Menu,
  X,
  Search,
  Heart,
  User,
  ShoppingBag,
  MessageCircle,
} from "lucide-react";

const NAV_LINKS = [
  { label: "Colección", href: "#coleccion" },
  { label: "Catálogo", href: "#catalogo" },
  { label: "Reservas", href: "#reservas" },
  { label: "Pagos", href: "#pagos" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Nosotros", href: "#propósito" },
  { label: "Contacto", href: "#contacto" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-paper/95 backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
        <a
          href="#top"
          className="font-display text-2xl tracking-wide"
          style={{
            color: scrolled ? "var(--color-ink)" : "var(--color-white)",
          }}
        >
          ALTEA
        </a>

        <nav className="hidden gap-10 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-detail text-[13px] uppercase tracking-[0.15em] transition-opacity hover:opacity-60"
              style={{
                color: scrolled ? "var(--color-ink)" : "var(--color-white)",
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div
          className="hidden items-center gap-6 md:flex"
          style={{
            color: scrolled ? "var(--color-ink)" : "var(--color-white)",
          }}
        >
          <Search size={18} strokeWidth={1.5} aria-label="Buscar" />
          <Heart size={18} strokeWidth={1.5} aria-label="Favoritos" />
          <User size={18} strokeWidth={1.5} aria-label="Mi cuenta" />
          <a
            href="/login"
            className="rounded-full border border-current px-3 py-1 font-detail text-[11px] uppercase tracking-[0.2em] transition-opacity hover:opacity-70"
            aria-label="Ingresar al dashboard"
          >
            Admin
          </a>
          <a
            href="#catalogo"
            aria-label="Abrir carrito"
            className="transition-opacity hover:opacity-70"
          >
            <ShoppingBag size={18} strokeWidth={1.5} />
          </a>
          <a
            href="https://wa.me/573242227422?text=Hola%20ALTEA%2C%20quiero%20asesor%C3%ADa%20y%20reservar%20una%20cita."
            target="_blank"
            rel="noreferrer"
            aria-label="Escribir por WhatsApp"
            className="transition-opacity hover:opacity-70"
          >
            <MessageCircle size={18} strokeWidth={1.5} />
          </a>
        </div>

        <button
          className="md:hidden"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((v) => !v)}
          style={{
            color: scrolled ? "var(--color-ink)" : "var(--color-white)",
          }}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden bg-paper md:hidden"
          >
            <nav className="flex flex-col gap-5 px-6 pb-8 pt-2">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="font-detail text-sm uppercase tracking-[0.15em] text-ink"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="/login"
                className="mt-2 inline-flex items-center justify-center border border-ink px-4 py-3 font-detail text-[11px] uppercase tracking-[0.2em] text-ink"
              >
                Entrar al dashboard
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
