"use client";

import { useMemo, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  CreditCard,
  Filter,
  Heart,
  Minus,
  PackageSearch,
  Plus,
  ShoppingBag,
  Sparkles,
  Truck,
  MessageCircleMore,
  MapPin,
} from "lucide-react";

import img01 from "@/img/WhatsApp Image 2026-07-02 at 2.07.24 PM.jpeg";
import img02 from "@/img/WhatsApp Image 2026-07-02 at 2.07.24 PM (1).jpeg";
import img03 from "@/img/WhatsApp Image 2026-07-02 at 2.07.24 PM (2).jpeg";
import img04 from "@/img/WhatsApp Image 2026-07-02 at 2.07.24 PM (3).jpeg";
import img05 from "@/img/WhatsApp Image 2026-07-02 at 2.13.10 PM.jpeg";
import img06 from "@/img/WhatsApp Image 2026-07-02 at 2.13.11 PM.jpeg";
import img07 from "@/img/WhatsApp Image 2026-07-02 at 2.13.11 PM (1).jpeg";
import img08 from "@/img/WhatsApp Image 2026-07-02 at 2.13.11 PM (2).jpeg";
import img09 from "@/img/WhatsApp Image 2026-07-02 at 2.13.11 PM (3).jpeg";
import img10 from "@/img/WhatsApp Image 2026-07-02 at 2.13.11 PM (4).jpeg";
import img11 from "@/img/WhatsApp Image 2026-07-02 at 2.13.12 PM.jpeg";

type FilterKey = "Todos" | "Venta" | "Alquiler" | "Novias" | "Accesorios";
type SortKey = "Destacados" | "Precio asc" | "Precio desc";

type Product = {
  id: string;
  name: string;
  category: FilterKey;
  flow: "Venta" | "Alquiler";
  price: number;
  accent: string;
  image: StaticImageData;
  note: string;
};

type CartItem = Product & { quantity: number };

const formatCop = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const FILTERS: FilterKey[] = [
  "Todos",
  "Venta",
  "Alquiler",
  "Novias",
  "Accesorios",
];
const SORTS: SortKey[] = ["Destacados", "Precio asc", "Precio desc"];

const PRODUCTS: Product[] = [
  {
    id: "aurora",
    name: "Aurora Couture",
    category: "Novias",
    flow: "Venta",
    price: 1290000,
    accent: "#822e36",
    image: img01,
    note: "Silencio visual, volumen editorial y caída de alto impacto.",
  },
  {
    id: "lumina",
    name: "Lumina Set",
    category: "Venta",
    flow: "Venta",
    price: 520000,
    accent: "#a78569",
    image: img02,
    note: "Look de evento con textura rica y presencia contemporánea.",
  },
  {
    id: "nocturna",
    name: "Nocturna Prime",
    category: "Alquiler",
    flow: "Alquiler",
    price: 360000,
    accent: "#4c5f63",
    image: img03,
    note: "Ideal para grados, fiestas y noches con fotografía intensa.",
  },
  {
    id: "atelier",
    name: "Atelier Veil",
    category: "Accesorios",
    flow: "Venta",
    price: 180000,
    accent: "#c8b39b",
    image: img04,
    note: "Detalle final para elevar cualquier styling sin ruido.",
  },
  {
    id: "esencia",
    name: "Esencia Bridal",
    category: "Novias",
    flow: "Venta",
    price: 980000,
    accent: "#ece8df",
    image: img05,
    note: "Para una prueba cómoda con asesoría y ajuste guiado.",
  },
  {
    id: "bruma",
    name: "Bruma Signature",
    category: "Venta",
    flow: "Venta",
    price: 690000,
    accent: "#822e36",
    image: img06,
    note: "Editorial limpio, moderno y listo para la vitrina digital.",
  },
  {
    id: "gala",
    name: "Gala Alquiler",
    category: "Alquiler",
    flow: "Alquiler",
    price: 450000,
    accent: "#a78569",
    image: img07,
    note: "Pensado para el carrito rápido y la reserva por WhatsApp.",
  },
  {
    id: "noche",
    name: "Noche Alta",
    category: "Venta",
    flow: "Venta",
    price: 750000,
    accent: "#1c1a17",
    image: img08,
    note: "Una pieza contundente para campañas y eventos premium.",
  },
  {
    id: "invitada",
    name: "Invitada Plus",
    category: "Alquiler",
    flow: "Alquiler",
    price: 410000,
    accent: "#4c5f63",
    image: img09,
    note: "Filtrado por ocasión, talla y disponibilidad inmediata.",
  },
  {
    id: "editorial",
    name: "Editorial Mood",
    category: "Accesorios",
    flow: "Venta",
    price: 220000,
    accent: "#c2a28a",
    image: img10,
    note: "Para complementar sesiones, novias y estilismos de alta gama.",
  },
  {
    id: "finale",
    name: "Finale Look",
    category: "Venta",
    flow: "Venta",
    price: 870000,
    accent: "#822e36",
    image: img11,
    note: "Una pieza final para lookbooks y vitrinas con movimiento.",
  },
];

function buildWhatsappMessage(cartItems: CartItem[], bookingText: string) {
  const cartSummary = cartItems
    .map(
      (item) =>
        `- ${item.name} x${item.quantity} (${formatCop.format(item.price)})`,
    )
    .join("\n");

  return encodeURIComponent(
    [
      "Hola ALTEA, quiero avanzar con este pedido:",
      cartSummary || "- Aún no agrego productos al carrito",
      bookingText,
      "También quiero confirmar disponibilidad, pago PSE y reserva.",
    ]
      .filter(Boolean)
      .join("\n\n"),
  );
}

export default function BoutiqueExperience() {
  const [filter, setFilter] = useState<FilterKey>("Todos");
  const [sort, setSort] = useState<SortKey>("Destacados");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingHour, setBookingHour] = useState("");
  const [bookingNote, setBookingNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<
    "pse" | "tarjeta" | "whatsapp"
  >("pse");

  const filteredProducts = useMemo(() => {
    const filtered = PRODUCTS.filter((product) => {
      if (filter === "Todos") return true;
      if (filter === "Venta" || filter === "Alquiler")
        return product.flow === filter;
      return product.category === filter;
    });

    const sorted = [...filtered];

    if (sort === "Precio asc") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sort === "Precio desc") {
      sorted.sort((a, b) => b.price - a.price);
    }

    return sorted;
  }, [filter, sort]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const bookingText =
    bookingDate || bookingHour || bookingNote
      ? `Reserva: ${bookingDate || "pendiente"} · ${bookingHour || "hora por definir"} · ${bookingNote || "sin observaciones"}`
      : "Reserva: aún no diligenciada";

  const whatsappUrl = `https://wa.me/573242227422?text=${buildWhatsappMessage(cartItems, bookingText)}`;

  const addToCart = (product: Product) => {
    setCartItems((current) => {
      const exists = current.find((item) => item.id === product.id);
      if (exists) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...current, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCartItems((current) =>
      current
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + delta }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  return (
    <section
      id="catalogo"
      className="relative overflow-hidden bg-ink px-6 py-28 md:px-10"
    >
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute left-[-8%] top-8 h-72 w-72 rounded-full bg-claret/20 blur-3xl" />
        <div className="absolute right-[-4%] top-24 h-96 w-96 rounded-full bg-light-coffee/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-greenish-gray/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-10 xl:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="border border-white/10 bg-white/6 p-8 backdrop-blur-sm">
                <span className="font-detail text-[11px] uppercase tracking-[0.35em] text-warm-gray">
                  Boutique 360
                </span>
                <h2 className="mt-5 max-w-2xl font-display text-4xl leading-tight text-white sm:text-6xl">
                  Carrito, reservas y catálogo con una estética cinematográfica.
                </h2>
                <p className="mt-5 max-w-xl font-body text-sm leading-relaxed text-white/72">
                  La página está lista para crecer con pasarela PSE, checkout
                  propio, confirmación por WhatsApp y un sistema de selección
                  visual pensado para venta, alquiler y citas privadas.
                </p>
              </div>

              <div className="grid gap-4">
                {[
                  ["Horario", "Lunes a sábado · 9AM-12:30PM y 1:30PM-5PM"],
                  ["Dirección", "Av. 30 de Agosto #37-58, Pereira, Risaralda"],
                  ["Contacto", "3242227422 · WhatsApp listo"],
                ].map(([title, value]) => (
                  <div
                    key={title}
                    className="border border-white/10 bg-white/6 p-5 backdrop-blur-sm"
                  >
                    <p className="font-detail text-[11px] uppercase tracking-[0.3em] text-white/45">
                      {title}
                    </p>
                    <p className="mt-3 font-body text-sm leading-relaxed text-white/82">
                      {value}
                    </p>
                  </div>
                ))}
                <a
                  href="/ALTEALOGO.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="border border-white/10 bg-white/8 p-5 backdrop-blur-sm transition-transform hover:-translate-y-0.5"
                >
                  <p className="font-detail text-[11px] uppercase tracking-[0.3em] text-white/45">
                    Logo / brand kit
                  </p>
                  <p className="mt-3 font-body text-sm leading-relaxed text-white/82">
                    Abrir el archivo del logo alojado en public.
                  </p>
                </a>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {FILTERS.map((item) => (
                <button
                  key={item}
                  onClick={() => setFilter(item)}
                  className={`border px-4 py-2 font-detail text-[11px] uppercase tracking-[0.22em] transition-all ${
                    filter === item
                      ? "border-white bg-white text-ink"
                      : "border-white/15 bg-transparent text-white/75 hover:border-white/40 hover:text-white"
                  }`}
                >
                  {item}
                </button>
              ))}

              <div className="ml-auto flex items-center gap-2 border border-white/10 bg-white/6 px-4 py-2 text-white/70">
                <Filter size={14} />
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value as SortKey)}
                  className="bg-transparent font-detail text-[11px] uppercase tracking-[0.2em] text-white outline-none"
                >
                  {SORTS.map((item) => (
                    <option key={item} value={item} className="text-ink">
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product, index) => (
                <motion.article
                  key={product.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.55, delay: index * 0.03 }}
                  whileHover={{ y: -8 }}
                  className="group overflow-hidden border border-white/10 bg-white/6 backdrop-blur-sm"
                >
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 45vw, 28vw"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent opacity-85"
                      style={{ backgroundColor: `${product.accent}10` }}
                    />
                    <div className="absolute left-4 top-4 flex items-center gap-2">
                      <span className="rounded-full border border-white/20 bg-ink/75 px-3 py-1 font-detail text-[10px] uppercase tracking-[0.25em] text-white">
                        {product.category}
                      </span>
                      <span className="rounded-full border border-white/20 bg-white px-3 py-1 font-detail text-[10px] uppercase tracking-[0.25em] text-ink">
                        {product.flow}
                      </span>
                    </div>
                    <div className="absolute inset-x-4 bottom-4 flex items-center justify-between text-white">
                      <div>
                        <p className="font-detail text-[10px] uppercase tracking-[0.25em] text-white/60">
                          Destacado
                        </p>
                        <p className="mt-1 font-display text-2xl">
                          {product.name}
                        </p>
                      </div>
                      <div className="rounded-full border border-white/20 bg-ink/70 p-3">
                        <Heart size={15} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 p-5 text-white">
                    <p className="font-body text-sm leading-relaxed text-white/72">
                      {product.note}
                    </p>
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="font-detail text-[10px] uppercase tracking-[0.25em] text-white/45">
                          Desde
                        </p>
                        <p className="mt-2 font-heading text-xl">
                          {formatCop.format(product.price)}
                        </p>
                      </div>
                      <button
                        onClick={() => addToCart(product)}
                        className="inline-flex items-center gap-2 border border-white px-4 py-2 font-detail text-[11px] uppercase tracking-[0.22em] transition-colors hover:bg-white hover:text-ink"
                      >
                        Añadir
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>

          <aside className="space-y-6 xl:sticky xl:top-28 xl:self-start">
            <div className="border border-white/10 bg-white/8 p-6 text-white backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-detail text-[11px] uppercase tracking-[0.3em] text-white/45">
                    Carrito de compras
                  </p>
                  <h3 className="mt-2 font-display text-3xl">
                    {cartCount} items
                  </h3>
                </div>
                <div className="rounded-full border border-white/15 bg-white/10 p-3">
                  <ShoppingBag size={18} />
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {cartItems.length ? (
                  cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 border-b border-white/10 pb-4"
                    >
                      <div className="relative h-20 w-16 overflow-hidden rounded-md border border-white/10">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-body text-sm text-white">
                          {item.name}
                        </p>
                        <p className="mt-1 font-detail text-[10px] uppercase tracking-[0.22em] text-white/45">
                          {formatCop.format(item.price)}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="rounded-full border border-white/15 p-1.5"
                            aria-label={`Disminuir ${item.name}`}
                          >
                            <Minus size={13} />
                          </button>
                          <span className="w-7 text-center font-detail text-xs uppercase tracking-[0.2em]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="rounded-full border border-white/15 p-1.5"
                            aria-label={`Aumentar ${item.name}`}
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="border border-dashed border-white/15 p-6 text-center text-white/55">
                    <PackageSearch className="mx-auto" size={28} />
                    <p className="mt-4 font-body text-sm">
                      El carrito está vacío. Agrega piezas para activar el
                      checkout.
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 border-t border-white/10 pt-5">
                <div className="flex items-center justify-between font-detail text-[11px] uppercase tracking-[0.24em] text-white/50">
                  <span>Subtotal</span>
                  <span>{formatCop.format(subtotal)}</span>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-white px-4 py-3 font-detail text-[11px] uppercase tracking-[0.22em] text-ink transition-transform hover:-translate-y-0.5"
                  >
                    <MessageCircleMore size={14} />
                    WhatsApp
                  </a>
                  <button
                    onClick={() => setPaymentMethod("pse")}
                    className={`inline-flex items-center justify-center gap-2 border px-4 py-3 font-detail text-[11px] uppercase tracking-[0.22em] transition-colors ${
                      paymentMethod === "pse"
                        ? "border-white bg-claret text-white"
                        : "border-white/20 text-white/80 hover:border-white hover:text-white"
                    }`}
                  >
                    <CreditCard size={14} />
                    PSE
                  </button>
                  <button
                    onClick={() => setPaymentMethod("tarjeta")}
                    className={`inline-flex items-center justify-center gap-2 border px-4 py-3 font-detail text-[11px] uppercase tracking-[0.22em] transition-colors ${
                      paymentMethod === "tarjeta"
                        ? "border-white bg-white text-ink"
                        : "border-white/20 text-white/80 hover:border-white hover:text-white"
                    }`}
                  >
                    <CreditCard size={14} />
                    Tarjeta
                  </button>
                </div>

                <div className="mt-4 rounded-2xl border border-white/10 bg-white/6 p-4 text-white/75">
                  <p className="font-detail text-[10px] uppercase tracking-[0.24em] text-white/45">
                    Pasarela lista
                  </p>
                  <p className="mt-2 font-body text-sm leading-relaxed">
                    El checkout queda preparado para conectar API PSE, proveedor
                    de pagos o confirmación manual.
                  </p>
                </div>
              </div>
            </div>

            <div
              id="reservas"
              className="border border-white/10 bg-white/8 p-6 text-white backdrop-blur-sm"
            >
              <div className="flex items-center gap-3">
                <CalendarDays size={18} />
                <div>
                  <p className="font-detail text-[11px] uppercase tracking-[0.3em] text-white/45">
                    Reserva
                  </p>
                  <h3 className="mt-1 font-display text-2xl">
                    Agenda tu prueba
                  </h3>
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(event) => setBookingDate(event.target.value)}
                  className="border border-white/10 bg-transparent px-4 py-3 font-body text-sm text-white outline-none placeholder:text-white/35"
                />
                <input
                  type="time"
                  value={bookingHour}
                  onChange={(event) => setBookingHour(event.target.value)}
                  className="border border-white/10 bg-transparent px-4 py-3 font-body text-sm text-white outline-none placeholder:text-white/35"
                />
                <textarea
                  value={bookingNote}
                  onChange={(event) => setBookingNote(event.target.value)}
                  placeholder="Ej: probador para novias, ajuste de talla, asesoría de imagen"
                  rows={4}
                  className="border border-white/10 bg-transparent px-4 py-3 font-body text-sm text-white outline-none placeholder:text-white/35"
                />
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex w-full items-center justify-center gap-2 bg-white px-4 py-3 font-detail text-[11px] uppercase tracking-[0.22em] text-ink transition-transform hover:-translate-y-0.5"
              >
                Confirmar por WhatsApp
                <ArrowRight size={14} />
              </a>
            </div>

            <div
              id="pagos"
              className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1"
            >
              {[
                [
                  Truck,
                  "Despachos y entrega",
                  "Recoge en tienda o coordina salida asistida según disponibilidad.",
                ],
                [
                  Sparkles,
                  "Styling premium",
                  "Asesoría visual para elevar el look antes de confirmar la compra.",
                ],
                [
                  MapPin,
                  "Ubicación fija",
                  "Visítanos en Pereira con horario extendido de atención.",
                ],
              ].map(([Icon, title, text]) => (
                <div
                  key={title as string}
                  className="border border-white/10 bg-white/6 p-5 text-white backdrop-blur-sm"
                >
                  <Icon size={18} />
                  <h4 className="mt-4 font-display text-xl">
                    {title as string}
                  </h4>
                  <p className="mt-3 font-body text-sm leading-relaxed text-white/70">
                    {text as string}
                  </p>
                </div>
              ))}
            </div>
          </aside>
        </div>

        <div className="mt-12 overflow-hidden border-y border-white/10 py-5 text-white/60">
          <div className="animate-[marquee_18s_linear_infinite] whitespace-nowrap font-detail text-[11px] uppercase tracking-[0.36em]">
            PSE listo para integrar · carrito central · reservas por WhatsApp ·
            catálogo visual · pruebas privadas · pagos asistidos
          </div>
        </div>
      </div>
    </section>
  );
}
