import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {
  AlertTriangle,
  Bell,
  PackageOpen,
  RefreshCcw,
  Search,
  ShoppingBag,
  Warehouse,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { adminCookieName, verifyAdminToken } from "@/lib/admin-auth";
import LogoutButton from "@/components/LogoutButton";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const session = verifyAdminToken(cookieStore.get(adminCookieName())?.value);

  if (!session) {
    redirect("/login");
  }

  const [orders, reservations, products, notifications] = await Promise.all([
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { customer: true, items: true },
    }),
    prisma.reservation.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { customer: true, order: true },
    }),
    prisma.product.findMany({
      orderBy: [{ stock: "asc" }, { createdAt: "desc" }],
    }),
    prisma.notification.findMany({
      orderBy: { createdAt: "desc" },
      take: 14,
      include: { product: true, order: true },
    }),
  ]);

  const paidOrders = orders.filter(
    (order) => order.status === "PAID" || order.status === "COMPLETED",
  );
  const totalSales = paidOrders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter(
    (order) => order.status === "PENDING_PAYMENT",
  ).length;
  const lowStock = products.filter((product) => product.stock <= 3).length;
  const outOfStock = products.filter((product) => product.stock === 0).length;
  const urgentNotifications = notifications.filter(
    (notification) => notification.severity === "CRITICAL",
  ).length;

  return (
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
                Ventas, reservas, inventario, movimientos de bodega y alertas de
                stock en una sola vista.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white/55">
                <Search size={16} />
                <span className="font-detail text-[11px] uppercase tracking-[0.18em]">
                  Buscar por SKU, producto o marca
                </span>
              </div>
              <LogoutButton />
            </div>
          </div>
        </header>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Ventas confirmadas",
              value: `$${totalSales.toLocaleString("es-CO")}`,
              icon: ShoppingBag,
              tone: "from-emerald-500/20 to-emerald-500/5",
            },
            {
              label: "Órdenes pendientes",
              value: String(pendingOrders),
              icon: RefreshCcw,
              tone: "from-amber-500/20 to-amber-500/5",
            },
            {
              label: "Reservas activas",
              value: String(reservations.length),
              icon: Warehouse,
              tone: "from-sky-500/20 to-sky-500/5",
            },
            {
              label: "Alertas críticas",
              value: String(urgentNotifications),
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
              <p className="mt-6 font-display text-3xl sm:text-4xl">{value}</p>
            </div>
          ))}
        </section>

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
                    {lowStock} bajo stock
                  </span>
                  <span className="rounded-full border border-white/10 px-3 py-2">
                    {outOfStock} sin stock
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
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => {
                      const statusLabel =
                        product.stock === 0
                          ? "Sin stock"
                          : product.stock === 1
                            ? "Urgente"
                            : product.stock <= 3
                              ? "Bajo"
                              : "OK";

                      const statusTone =
                        product.stock === 0
                          ? "bg-rose-500/20 text-rose-200 border-rose-500/30"
                          : product.stock === 1
                            ? "bg-orange-500/20 text-orange-200 border-orange-500/30"
                            : product.stock <= 3
                              ? "bg-amber-500/20 text-amber-200 border-amber-500/30"
                              : "bg-emerald-500/20 text-emerald-200 border-emerald-500/30";

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
                            {product.stock}
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex rounded-full border px-3 py-1 font-detail text-[10px] uppercase tracking-[0.22em] ${statusTone}`}
                            >
                              {statusLabel}
                            </span>
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
                            {order.customer.fullName}
                          </p>
                          <p className="mt-1 text-sm text-white/55">
                            {order.items.length} ítems · {order.kind}
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
                <Bell size={18} className="text-white/50" />
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-3 text-sm text-white/60">
                <div className="flex items-center justify-between">
                  <span>Críticas</span>
                  <span className="rounded-full bg-rose-500/20 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-rose-200">
                    {urgentNotifications}
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
                  <span className="font-semibold">{paidOrders.length}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                  <span>Inventario sin stock</span>
                  <span className="font-semibold">{outOfStock}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                  <span>Productos visibles</span>
                  <span className="font-semibold">{products.length}</span>
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
                      {reservation.customer.fullName}
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
  );
}
