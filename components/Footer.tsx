export default function Footer() {
  return (
    <footer id="contacto" className="bg-ink px-6 py-16 md:px-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 text-center">
        <span className="font-display text-3xl text-white">ALTEA</span>
        <p className="font-detail text-xs uppercase tracking-[0.25em] text-warm-gray">
          Casa de moda — Medellín, Colombia
        </p>
        <div className="flex gap-8 font-detail text-xs uppercase tracking-[0.2em] text-white/70">
          <a href="mailto:contacto@altea.com" className="hover:text-white">
            Contacto
          </a>
          <a href="#" className="hover:text-white">
            Instagram
          </a>
          <a href="#" className="hover:text-white">
            WhatsApp
          </a>
        </div>
        <p className="font-detail text-[11px] text-white/40">
          © {new Date().getFullYear()} ALTEA. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
