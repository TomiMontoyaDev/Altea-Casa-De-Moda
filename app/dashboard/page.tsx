import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import DashboardBoard from "@/components/DashboardBoard";
import { adminCookieName, verifyAdminToken } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

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

  const serializableData = {
    stats: {
      totalSales: paidOrders.reduce((sum, order) => sum + order.total, 0),
      pendingOrders: orders.filter(
        (order) => order.status === "PENDING_PAYMENT",
      ).length,
      reservations: reservations.length,
      urgentNotifications: notifications.filter(
        (notification) => notification.severity === "CRITICAL",
      ).length,
    },
    inventory: products.map((product) => ({
      id: product.id,
      slug: product.slug,
      name: product.name,
      category: product.category,
      stock: product.stock,
      description: product.description,
    })),
    orders: orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      kind: order.kind,
      status: order.status,
      total: order.total,
      createdAt: order.createdAt.toISOString(),
      customerName: order.customer.fullName,
      itemsCount: order.items.length,
    })),
    reservations: reservations.map((reservation) => ({
      id: reservation.id,
      customerName: reservation.customer.fullName,
      scheduledAt: reservation.scheduledAt
        ? reservation.scheduledAt.toISOString()
        : null,
      city: reservation.city,
      address: reservation.address,
      createdAt: reservation.createdAt.toISOString(),
    })),
    notifications: notifications.map((notification) => ({
      id: notification.id,
      type: notification.type,
      severity: notification.severity,
      title: notification.title,
      message: notification.message,
      createdAt: notification.createdAt.toISOString(),
    })),
  };

  return <DashboardBoard data={serializableData} />;
}
