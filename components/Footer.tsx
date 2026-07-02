export default function Footer() {
  return (
    <footer id="contacto" className="bg-ink px-6 py-16 md:px-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 text-center">
        <span className="font-display text-3xl text-white">ALTEA</span>
        <p className="font-detail text-xs uppercase tracking-[0.25em] text-warm-gray">
          Av. 30 de Agosto #37-58 · Pereira, Risaralda
        </p>
        <div className="flex flex-wrap justify-center gap-6 font-detail text-xs uppercase tracking-[0.2em] text-white/70">
          <a
            href="https://wa.me/573242227422?text=Hola%20ALTEA%2C%20quiero%20informaci%C3%B3n%20sobre%20cat%C3%A1logo%2C%20reservas%20y%20pagos."
            target="_blank"
            rel="noreferrer"
            className="hover:text-white"
          >
            WhatsApp 3242227422
          </a>
          <a href="tel:+573242227422" className="hover:text-white">
            Llamar
          </a>
          <a href="mailto:contacto@altea.com" className="hover:text-white">
            Contacto
          </a>
          <a
            href="https://www.instagram.com/tomi._.montoya/"
            target="_blank"
            rel="noreferrer"
            className="group hover:text-white"
          >
            <span className="transition-all group-hover:tracking-[0.3em]">
              Designed by Tomas Montoya
            </span>
          </a>
        </div>
        <p className="font-detail text-[11px] text-white/40">
          © {new Date().getFullYear()} ALTEA. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
