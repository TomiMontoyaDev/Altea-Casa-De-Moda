import { redirect } from "next/navigation";
import { cookies } from "next/headers";
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
      orderBy: { stock: "asc" },
    }),
    prisma.notification.findMany({
      orderBy: { createdAt: "desc" },
      take: 12,
      include: { product: true, order: true },
    }),
  ]);

  const totalSales = orders
    .filter((order) => order.status === "PAID" || order.status === "COMPLETED")
    .reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter(
    (order) => order.status === "PENDING_PAYMENT",
  ).length;
  const lowStock = products.filter((product) => product.stock <= 3).length;

  return (
    <main className="min-h-screen bg-paper px-6 py-10 text-ink md:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col justify-between gap-4 border-b border-ink/10 pb-6 md:flex-row md:items-end">
          <div>
            <p className="font-detail text-[11px] uppercase tracking-[0.32em] text-greenish-gray">
              ALTEA Admin
            </p>
            <h1 className="mt-3 font-display text-4xl sm:text-6xl">
              Dashboard operativo
            </h1>
            <p className="mt-3 max-w-2xl font-body text-sm leading-relaxed text-ink/70">
              Monitoreo en tiempo real de ventas, reservas, stock, movimientos
              de bodega y notificaciones urgentes.
            </p>
          </div>
          <LogoutButton />
        </header>

        <section className="grid gap-4 md:grid-cols-4">
          {[
            ["Ventas confirmadas", `$${totalSales.toLocaleString("es-CO")}`],
            ["Órdenes pendientes", String(pendingOrders)],
            ["Reservas activas", String(reservations.length)],
            ["Alertas de stock", String(lowStock)],
          ].map(([label, value]) => (
            <div key={label} className="border border-ink/10 bg-white/70 p-5">
              <p className="font-detail text-[11px] uppercase tracking-[0.3em] text-greenish-gray">
                {label}
              </p>
              <p className="mt-4 font-display text-3xl">{value}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <div className="border border-ink/10 bg-white/70 p-6">
              <h2 className="font-display text-2xl">Inventario</h2>
              <div className="mt-5 overflow-hidden rounded-2xl border border-ink/10">
                <table className="w-full text-left text-sm">
                  <thead className="bg-ink text-white">
                    <tr>
                      <th className="px-4 py-3 font-detail text-[11px] uppercase tracking-[0.2em]">
                        Producto
                      </th>
                      <th className="px-4 py-3 font-detail text-[11px] uppercase tracking-[0.2em]">
                        Categoría
                      </th>
                      <th className="px-4 py-3 font-detail text-[11px] uppercase tracking-[0.2em]">
                        Stock
                      </th>
                      <th className="px-4 py-3 font-detail text-[11px] uppercase tracking-[0.2em]">
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr
                        key={product.id}
                        className="border-t border-ink/10 bg-white"
                      >
                        <td className="px-4 py-3 font-medium">
                          {product.name}
                        </td>
                        <td className="px-4 py-3">{product.category}</td>
                        <td className="px-4 py-3">{product.stock}</td>
                        <td className="px-4 py-3">
                          {product.stock === 0
                            ? "Sin stock"
                            : product.stock === 1
                              ? "Urgente"
                              : product.stock <= 3
                                ? "Bajo"
                                : "OK"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="border border-ink/10 bg-white/70 p-6">
              <h2 className="font-display text-2xl">Últimas órdenes</h2>
              <div className="mt-5 space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-ink/10 bg-white p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-detail text-[11px] uppercase tracking-[0.24em] text-greenish-gray">
                          {order.orderNumber}
                        </p>
                        <p className="mt-2 font-medium">
                          {order.customer.fullName}
                        </p>
                      </div>
                      <span className="font-detail text-[11px] uppercase tracking-[0.2em]">
                        {order.status}
                      </span>
                    </div>
                    <div className="mt-3 grid gap-2 text-sm text-ink/75 sm:grid-cols-3">
                      <span>Total: ${order.total.toLocaleString("es-CO")}</span>
                      <span>Items: {order.items.length}</span>
                      <span>
                        {new Date(order.createdAt).toLocaleString("es-CO")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="border border-ink/10 bg-white/70 p-6">
              <h2 className="font-display text-2xl">Reservas recientes</h2>
              <div className="mt-5 space-y-4">
                {reservations.map((reservation) => (
                  <div
                    key={reservation.id}
                    className="border border-ink/10 bg-white p-4 text-sm"
                  >
                    <p className="font-medium">
                      {reservation.customer.fullName}
                    </p>
                    <p className="mt-2 text-ink/70">
                      {reservation.scheduledAt
                        ? new Date(reservation.scheduledAt).toLocaleString(
                            "es-CO",
                          )
                        : "Sin fecha"}
                    </p>
                    <p className="mt-1 text-ink/60">
                      {reservation.address || reservation.city}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-ink/10 bg-white/70 p-6">
              <h2 className="font-display text-2xl">Notificaciones</h2>
              <div className="mt-5 space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`border p-4 text-sm ${notification.severity === "CRITICAL" ? "border-claret/30 bg-claret/5" : "border-ink/10 bg-white"}`}
                  >
                    <p className="font-medium">{notification.title}</p>
                    <p className="mt-2 text-ink/70">{notification.message}</p>
                    <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-greenish-gray">
                      {notification.type} ·{" "}
                      {new Date(notification.createdAt).toLocaleString("es-CO")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
