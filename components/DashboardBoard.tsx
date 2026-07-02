"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Bell,
  Filter,
  PackageOpen,
  RefreshCcw,
  Search,
  ShoppingBag,
  Warehouse,
  ArrowDown,
  Trash2,
  Truck,
  LogOut,
} from "lucide-react";

type InventoryItem = {
  id: string;
  slug: string;
  name: string;
  category: string;
  stock: number;
  description: string | null;
};

type OrderItem = {
  id: string;
  orderNumber: string;
  kind: string;
  status: string;
  total: number;
  createdAt: string;
  customerName: string;
  itemsCount: number;
};

type ReservationItem = {
  id: string;
  customerName: string;
  scheduledAt: string | null;
  city: string | null;
  address: string | null;
  createdAt: string;
};

type NotificationItem = {
  id: string;
  type: string;
  severity: string;
  title: string;
  message: string;
  createdAt: string;
};

type DashboardData = {
  stats: {
    totalSales: number;
    pendingOrders: number;
    reservations: number;
    urgentNotifications: number;
  };
  inventory: InventoryItem[];
  orders: OrderItem[];
  reservations: ReservationItem[];
  notifications: NotificationItem[];
};

const FILTERS = [
  "Todo",
  "Bajo stock",
  "Sin stock",
  "Venta",
  "Alquiler",
  "Novias",
  "Accesorios",
] as const;
const PRODUCT_CATEGORIES = [
  "Todos",
  "VENTA",
  "ALQUILER",
  "NOVIAS",
  "ACCESORIOS",
] as const;

export default function DashboardBoard({ data }: { data: DashboardData }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("Todo");
  const [category, setCategory] =
    useState<(typeof PRODUCT_CATEGORIES)[number]>("Todos");
  const [showNotifications, setShowNotifications] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.push("/login");
      router.refresh();
    }
  };

  const searchText = query.trim().toLowerCase();

  const inventory = useMemo(() => {
    return data.inventory.filter((item) => {
      const matchesQuery =
        !searchText ||
        [item.slug, item.name, item.category, item.description || ""].some(
          (value) => value.toLowerCase().includes(searchText),
        );

      const matchesCategory =
        category === "Todos" || item.category === category;

      const matchesQuickFilter =
        filter === "Todo" ||
        (filter === "Bajo stock" && item.stock > 0 && item.stock <= 3) ||
        (filter === "Sin stock" && item.stock === 0) ||
        (filter === "Venta" && item.category === "VENTA") ||
        (filter === "Alquiler" && item.category === "ALQUILER") ||
        (filter === "Novias" && item.category === "NOVIAS") ||
        (filter === "Accesorios" && item.category === "ACCESORIOS");

      return matchesQuery && matchesCategory && matchesQuickFilter;
    });
  }, [category, data.inventory, filter, searchText]);

  const orders = useMemo(() => {
    return data.orders.filter((item) => {
      if (!searchText) return true;
      return [item.orderNumber, item.customerName, item.kind, item.status]
        .join(" ")
        .toLowerCase()
        .includes(searchText);
    });
  }, [data.orders, searchText]);

  const reservations = useMemo(() => {
    return data.reservations.filter((item) => {
      if (!searchText) return true;
      return [item.customerName, item.city || "", item.address || ""]
        .join(" ")
        .toLowerCase()
        .includes(searchText);
    });
  }, [data.reservations, searchText]);

  const notifications = useMemo(() => {
    return data.notifications.filter((item) => {
      if (!searchText) return true;
      return [item.type, item.title, item.message]
        .join(" ")
        .toLowerCase()
        .includes(searchText);
    });
  }, [data.notifications, searchText]);

  const paidOrdersCount = data.orders.filter(
    (item) => item.status === "PAID" || item.status === "COMPLETED",
  ).length;
  const outOfStockCount = data.inventory.filter(
    (item) => item.stock === 0,
  ).length;

  const actionRequest = (
    productId: string,
    kind: string,
    quantity: number,
    note: string,
  ) => {
    startTransition(async () => {
      await fetch("/api/inventory/movement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          kind,
          quantity,
          note,
        }),
      });
      router.refresh();
    });
  };

  return (
    <>
      <main className="min-h-screen bg-[#0c0f14] px-4 py-4 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1400px] space-y-4">
          <header className="rounded-3xl border border-white/10 bg-[#11161d] px-5 py-4 shadow-2xl shadow-black/20">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="flex items-center gap-2 text-white/55">
                  <div className="h-3 w-3 rounded-sm border border-white/30" />
                  <span className="font-detail text-[11px] uppercase tracking-[0.32em]">
                    Hards/ALTEA ERP
                  </span>
                </div>
                <h1 className="mt-3 font-display text-3xl sm:text-4xl xl:text-5xl">
                  Dashboard operativo
                </h1>
                <p className="mt-2 max-w-3xl font-body text-sm text-white/65">
                  Ventas, reservas, inventario, movimientos de bodega y alertas
                  de stock en una sola vista.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white/55">
                  <Search size={16} />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Buscar por SKU, producto, orden o reserva"
                    className="w-80 bg-transparent font-detail text-[11px] uppercase tracking-[0.16em] outline-none placeholder:text-white/30"
                  />
                </div>
                <button
                  onClick={() => setShowNotifications((current) => !current)}
                  className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white/70 transition-colors hover:bg-black/35"
                >
                  <Bell size={16} />
                </button>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-4 py-3 font-detail text-[11px] uppercase tracking-[0.18em] text-white/70 transition-colors hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-200 disabled:opacity-50"
                >
                  <LogOut size={16} />
                  {isLoggingOut ? "Saliendo..." : "Cerrar sesión"}
                </button>
              </div>
            </div>
          </header>

          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: "Ventas confirmadas",
                value: `$${data.stats.totalSales.toLocaleString("es-CO")}`,
                icon: ShoppingBag,
                tone: "from-emerald-500/20 to-emerald-500/5",
              },
              {
                label: "Órdenes pendientes",
                value: String(data.stats.pendingOrders),
                icon: RefreshCcw,
                tone: "from-amber-500/20 to-amber-500/5",
              },
              {
                label: "Reservas activas",
                value: String(data.stats.reservations),
                icon: Warehouse,
                tone: "from-sky-500/20 to-sky-500/5",
              },
              {
                label: "Alertas críticas",
                value: String(data.stats.urgentNotifications),
                icon: Bell,
                tone: "from-rose-500/20 to-rose-500/5",
              },
            ].map(({ label, value, icon: Icon, tone }) => (
              <div
                key={label}
                className={`rounded-3xl border border-white/10 bg-gradient-to-br ${tone} p-5`}
              >
                <div className="flex items-center justify-between text-white/60">
                  <span className="font-detail text-[11px] uppercase tracking-[0.24em]">
                    {label}
                  </span>
                  <Icon size={18} />
                </div>
                <p className="mt-6 font-display text-3xl sm:text-4xl">
                  {value}
                </p>
              </div>
            ))}
          </section>

          <div className="flex flex-wrap items-center gap-2 rounded-3xl border border-white/10 bg-[#11161d] p-3">
            <Filter size={16} className="ml-1 text-white/45" />
            {FILTERS.map((option) => (
              <button
                key={option}
                onClick={() => setFilter(option)}
                className={`rounded-full border px-4 py-2 font-detail text-[11px] uppercase tracking-[0.18em] transition-colors ${filter === option ? "border-white bg-white text-ink" : "border-white/10 text-white/60 hover:border-white/30 hover:text-white"}`}
              >
                {option}
              </button>
            ))}
            <div className="ml-auto flex flex-wrap items-center gap-2">
              {PRODUCT_CATEGORIES.map((option) => (
                <button
                  key={option}
                  onClick={() => setCategory(option)}
                  className={`rounded-full border px-4 py-2 font-detail text-[11px] uppercase tracking-[0.18em] transition-colors ${category === option ? "border-cyan-300 bg-cyan-300 text-ink" : "border-white/10 text-white/60 hover:border-white/30 hover:text-white"}`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4">
              <div className="rounded-3xl border border-white/10 bg-[#11161d] p-5 shadow-2xl shadow-black/20">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-detail text-[11px] uppercase tracking-[0.24em] text-white/45">
                      Inventario
                    </p>
                    <h2 className="mt-2 font-display text-2xl">
                      Stock total y estados
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.18em] text-white/65">
                    <span className="rounded-full border border-white/10 px-3 py-2">
                      {
                        data.inventory.filter(
                          (item) => item.stock <= 3 && item.stock > 0,
                        ).length
                      }{" "}
                      bajo stock
                    </span>
                    <span className="rounded-full border border-white/10 px-3 py-2">
                      {data.inventory.filter((item) => item.stock === 0).length}{" "}
                      sin stock
                    </span>
                  </div>
                </div>

                <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-black/35 text-white/70">
                      <tr>
                        <th className="px-4 py-3 font-detail text-[11px] uppercase tracking-[0.18em]">
                          SKU / ID
                        </th>
                        <th className="px-4 py-3 font-detail text-[11px] uppercase tracking-[0.18em]">
                          Producto
                        </th>
                        <th className="px-4 py-3 font-detail text-[11px] uppercase tracking-[0.18em]">
                          Categoría
                        </th>
                        <th className="px-4 py-3 font-detail text-[11px] uppercase tracking-[0.18em]">
                          Stock Total
                        </th>
                        <th className="px-4 py-3 font-detail text-[11px] uppercase tracking-[0.18em]">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventory.map((product) => {
                        const statusTone =
                          product.stock === 0
                            ? "bg-rose-500/20 text-rose-200 border-rose-500/30"
                            : product.stock === 1
                              ? "bg-orange-500/20 text-orange-200 border-orange-500/30"
                              : product.stock <= 3
                                ? "bg-amber-500/20 text-amber-200 border-amber-500/30"
                                : "bg-emerald-500/20 text-emerald-200 border-emerald-500/30";

                        const statusLabel =
                          product.stock === 0
                            ? "Sin stock"
                            : product.stock === 1
                              ? "Urgente"
                              : product.stock <= 3
                                ? "Bajo"
                                : "OK";

                        return (
                          <tr
                            key={product.id}
                            className="border-t border-white/8 bg-white/[0.02]"
                          >
                            <td className="px-4 py-4 font-detail text-[12px] tracking-[0.16em] text-white/45">
                              {product.slug.toUpperCase()}
                            </td>
                            <td className="px-4 py-4">
                              <div className="font-medium text-white">
                                {product.name}
                              </div>
                              <div className="mt-1 text-xs text-white/45">
                                {product.description || "Inventario base"}
                              </div>
                            </td>
                            <td className="px-4 py-4 text-white/70">
                              {product.category}
                            </td>
                            <td className="px-4 py-4 font-semibold">
                              <span
                                className={`inline-flex rounded-full border px-3 py-1 font-detail text-[10px] uppercase tracking-[0.22em] ${statusTone}`}
                              >
                                {statusLabel} · {product.stock}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex flex-wrap gap-2">
                                <button
                                  disabled={isPending}
                                  onClick={() =>
                                    actionRequest(
                                      product.id,
                                      "INBOUND",
                                      1,
                                      `Ingreso a bodega ${product.slug}`,
                                    )
                                  }
                                  className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-[11px] uppercase tracking-[0.16em] text-white/75 transition-colors hover:border-cyan-300 hover:text-cyan-200 disabled:opacity-50"
                                >
                                  <ArrowDown size={13} /> Recibir
                                </button>
                                <button
                                  disabled={isPending}
                                  onClick={() =>
                                    actionRequest(
                                      product.id,
                                      "SOLD",
                                      1,
                                      `Venta registrada ${product.slug}`,
                                    )
                                  }
                                  className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-[11px] uppercase tracking-[0.16em] text-white/75 transition-colors hover:border-emerald-300 hover:text-emerald-200 disabled:opacity-50"
                                >
                                  <ShoppingBag size={13} /> Vender
                                </button>
                                <button
                                  disabled={isPending}
                                  onClick={() =>
                                    actionRequest(
                                      product.id,
                                      "RENTED",
                                      1,
                                      `Prenda rentada ${product.slug}`,
                                    )
                                  }
                                  className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-[11px] uppercase tracking-[0.16em] text-white/75 transition-colors hover:border-amber-300 hover:text-amber-200 disabled:opacity-50"
                                >
                                  <Truck size={13} /> Rentar
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-[#11161d] p-5 shadow-2xl shadow-black/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-detail text-[11px] uppercase tracking-[0.24em] text-white/45">
                        Ventas recientes
                      </p>
                      <h2 className="mt-2 font-display text-2xl">
                        Últimas órdenes
                      </h2>
                    </div>
                    <ShoppingBag size={18} className="text-white/50" />
                  </div>

                  <div className="mt-5 space-y-3">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="font-detail text-[11px] uppercase tracking-[0.24em] text-white/45">
                              {order.orderNumber}
                            </p>
                            <p className="mt-2 font-medium">
                              {order.customerName}
                            </p>
                            <p className="mt-1 text-sm text-white/55">
                              {order.itemsCount} ítems · {order.kind}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-display text-xl">
                              ${order.total.toLocaleString("es-CO")}
                            </p>
                            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/45">
                              {order.status}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <button className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-[11px] uppercase tracking-[0.16em] text-white/70 hover:border-white/30">
                            <RefreshCcw size={13} /> Revisar
                          </button>
                          <button className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-[11px] uppercase tracking-[0.16em] text-white/70 hover:border-white/30">
                            <Trash2 size={13} /> Cancelar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-[#11161d] p-5 shadow-2xl shadow-black/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-detail text-[11px] uppercase tracking-[0.24em] text-white/45">
                        Movimientos
                      </p>
                      <h2 className="mt-2 font-display text-2xl">
                        Ingresos y salidas
                      </h2>
                    </div>
                    <RefreshCcw size={18} className="text-white/50" />
                  </div>

                  <div className="mt-5 space-y-3">
                    {notifications.slice(0, 5).map((notification) => (
                      <div
                        key={notification.id}
                        className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                      >
                        <p className="font-medium">{notification.title}</p>
                        <p className="mt-1 text-sm text-white/60">
                          {notification.message}
                        </p>
                        <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-white/40">
                          {notification.type} ·{" "}
                          {new Date(notification.createdAt).toLocaleString(
                            "es-CO",
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <aside className="space-y-4 xl:sticky xl:top-4 xl:self-start">
              <div className="rounded-3xl border border-white/10 bg-[#11161d] p-5 shadow-2xl shadow-black/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-detail text-[11px] uppercase tracking-[0.24em] text-white/45">
                      Notificaciones
                    </p>
                    <h2 className="mt-2 font-display text-2xl">
                      Centro de alertas
                    </h2>
                  </div>
                  <button
                    onClick={() => setShowNotifications((current) => !current)}
                    className="rounded-full border border-white/10 p-3 text-white/60 hover:border-white/30 hover:text-white"
                  >
                    <Bell size={18} />
                  </button>
                </div>

                <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-3 text-sm text-white/60">
                  <div className="flex items-center justify-between">
                    <span>Críticas</span>
                    <span className="rounded-full bg-rose-500/20 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-rose-200">
                      {data.stats.urgentNotifications}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-white/45">
                    Cuando quede 1 en stock o se agote un producto, aparece aquí
                    como alerta urgente.
                  </p>
                </div>

                <div className="mt-4 max-h-[520px] space-y-3 overflow-auto pr-1">
                  {notifications.map((notification) => {
                    const isCritical = notification.severity === "CRITICAL";

                    return (
                      <div
                        key={notification.id}
                        className={`rounded-2xl border p-4 ${isCritical ? "border-emerald-500/25 bg-emerald-500/10" : "border-white/10 bg-white/[0.03]"}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p
                              className={`font-detail text-[11px] uppercase tracking-[0.24em] ${isCritical ? "text-emerald-300" : "text-cyan-300"}`}
                            >
                              {notification.type.replaceAll("_", " ")}
                            </p>
                            <p className="mt-2 font-medium">
                              {notification.title}
                            </p>
                          </div>
                          <span
                            className={`rounded-full border px-2 py-1 text-[10px] uppercase tracking-[0.18em] ${isCritical ? "border-emerald-500/25 text-emerald-200" : "border-white/10 text-white/55"}`}
                          >
                            {notification.severity}
                          </span>
                        </div>
                        <p className="mt-2 text-sm leading-relaxed text-white/60">
                          {notification.message}
                        </p>
                        <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-white/35">
                          {new Date(notification.createdAt).toLocaleString(
                            "es-CO",
                          )}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-[#11161d] p-5 shadow-2xl shadow-black/20">
                <div className="flex items-center gap-3">
                  <AlertTriangle size={18} className="text-amber-300" />
                  <div>
                    <p className="font-detail text-[11px] uppercase tracking-[0.24em] text-white/45">
                      Resumen rápido
                    </p>
                    <h2 className="mt-2 font-display text-2xl">
                      Estado operativo
                    </h2>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 text-sm text-white/70">
                  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                    <span>Ventas confirmadas</span>
                    <span className="font-semibold">{paidOrdersCount}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                    <span>Inventario sin stock</span>
                    <span className="font-semibold">{outOfStockCount}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                    <span>Productos visibles</span>
                    <span className="font-semibold">
                      {data.inventory.length}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-[#11161d] p-5 shadow-2xl shadow-black/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-detail text-[11px] uppercase tracking-[0.24em] text-white/45">
                      Reservas recientes
                    </p>
                    <h2 className="mt-2 font-display text-2xl">Agenda</h2>
                  </div>
                  <PackageOpen size={18} className="text-white/50" />
                </div>

                <div className="mt-4 space-y-3">
                  {reservations.map((reservation) => (
                    <div
                      key={reservation.id}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/70"
                    >
                      <p className="font-medium text-white">
                        {reservation.customerName}
                      </p>
                      <p className="mt-1 text-white/55">
                        {reservation.scheduledAt
                          ? new Date(reservation.scheduledAt).toLocaleString(
                              "es-CO",
                            )
                          : "Sin fecha"}
                      </p>
                      <p className="mt-1 text-white/45">
                        {reservation.address || reservation.city}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </section>
        </div>
      </main>

      <button
        onClick={() => setShowNotifications((current) => !current)}
        className="fixed bottom-6 right-6 z-40 flex h-16 w-16 items-center justify-center rounded-full border border-white/15 bg-white text-ink shadow-[0_18px_60px_rgba(0,0,0,0.45)] transition-transform hover:scale-105"
        aria-label="Abrir notificaciones"
      >
        <Bell size={22} />
        {data.stats.urgentNotifications > 0 ? (
          <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-rose-500 text-[11px] font-semibold text-white">
            {data.stats.urgentNotifications > 9
              ? "9+"
              : data.stats.urgentNotifications}
          </span>
        ) : null}
      </button>

      {showNotifications ? (
        <div className="fixed right-4 top-4 z-50 w-[380px] max-w-[calc(100vw-2rem)] rounded-3xl border border-white/10 bg-[#0f1319] p-4 shadow-2xl shadow-black/40 backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Bell size={18} className="text-cyan-300" />
              <span className="font-detail text-[11px] uppercase tracking-[0.24em] text-white/80">
                Notificaciones
              </span>
            </div>
            <button
              onClick={() => setShowNotifications(false)}
              className="text-white/60 hover:text-white"
            >
              ✕
            </button>
          </div>
          <div className="mt-3 max-h-[420px] space-y-3 overflow-auto pr-1">
            {notifications.slice(0, 6).map((notification) => (
              <div
                key={notification.id}
                className={`rounded-2xl border p-4 ${notification.severity === "CRITICAL" ? "border-emerald-500/25 bg-emerald-500/10" : "border-white/10 bg-white/[0.03]"}`}
              >
                <p className="font-detail text-[11px] uppercase tracking-[0.22em] text-white/45">
                  {notification.type.replaceAll("_", " ")}
                </p>
                <p className="mt-2 font-medium">{notification.title}</p>
                <p className="mt-2 text-sm text-white/60">
                  {notification.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}
