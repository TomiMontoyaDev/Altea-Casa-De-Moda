import { NextResponse } from "next/server";
import { z } from "zod";
import {
  NotificationSeverity,
  NotificationType,
  OrderKind,
  OrderStatus,
  InventoryMovementKind,
  ProductCategory,
} from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { registerMovement } from "@/lib/inventory";

const itemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive(),
});

const schema = z.object({
  mode: z.enum(["purchase", "reservation"]),
  customer: z.object({
    fullName: z.string().min(3),
    documentNumber: z.string().min(5),
    phone: z.string().min(7),
    email: z.string().email().optional().or(z.literal("")),
    city: z.string().min(2),
    address: z.string().min(5),
  }),
  shippingCity: z.string().min(2),
  shippingAddress: z.string().min(5),
  shippingMode: z.enum(["national", "local"]),
  note: z.string().optional(),
  reservationDate: z.string().optional(),
  reservationTime: z.string().optional(),
  idPhoto: z.string().min(20),
  signature: z.string().min(20),
  items: z.array(itemSchema).min(1),
});

function calcShipping(city: string, shippingMode: "national" | "local") {
  if (shippingMode === "local") return 12000;
  if (city.toLowerCase().includes("pereira")) return 12000;
  return 18000;
}

function categoryFromSlug(slug: string) {
  if (["nocturna", "gala", "invitada"].includes(slug))
    return ProductCategory.ALQUILER;
  if (["aurora", "esencia"].includes(slug)) return ProductCategory.NOVIAS;
  if (["atelier", "editorial"].includes(slug))
    return ProductCategory.ACCESORIOS;
  return ProductCategory.VENTA;
}

function buildOrderNumber() {
  return `ALT-${Date.now().toString().slice(-8)}`;
}

function parseDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!match) {
    throw new Error("Archivo inválido");
  }

  return dataUrl;
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos de compra inválidos" },
      { status: 400 },
    );
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const customer = await tx.customer.upsert({
        where: { documentNumber: parsed.data.customer.documentNumber },
        update: {
          fullName: parsed.data.customer.fullName,
          phone: parsed.data.customer.phone,
          email: parsed.data.customer.email || null,
          city: parsed.data.customer.city,
          address: parsed.data.customer.address,
          idPhotoUrl: parseDataUrl(parsed.data.idPhoto),
          signatureUrl: parseDataUrl(parsed.data.signature),
        },
        create: {
          fullName: parsed.data.customer.fullName,
          documentNumber: parsed.data.customer.documentNumber,
          phone: parsed.data.customer.phone,
          email: parsed.data.customer.email || null,
          city: parsed.data.customer.city,
          address: parsed.data.customer.address,
          idPhotoUrl: parseDataUrl(parsed.data.idPhoto),
          signatureUrl: parseDataUrl(parsed.data.signature),
        },
      });

      const productIds = parsed.data.items.map((item) => item.productId);
      const products = await tx.product.findMany({
        where: { id: { in: productIds } },
      });

      if (products.length !== productIds.length) {
        throw new Error("Uno o más productos no existen");
      }

      const orderNumber = buildOrderNumber();
      const subtotal = parsed.data.items.reduce((sum, item) => {
        const product = products.find((entry) => entry.id === item.productId);
        return sum + (product?.price ?? 0) * item.quantity;
      }, 0);
      const shippingCost =
        parsed.data.mode === "purchase"
          ? calcShipping(parsed.data.shippingCity, parsed.data.shippingMode)
          : 0;
      const total = subtotal + shippingCost;

      const order = await tx.order.create({
        data: {
          orderNumber,
          kind:
            parsed.data.mode === "purchase"
              ? OrderKind.PURCHASE
              : OrderKind.RESERVATION,
          status:
            parsed.data.mode === "purchase"
              ? OrderStatus.PENDING_PAYMENT
              : OrderStatus.RESERVED,
          paymentMethod: "PSE",
          subtotal,
          shippingCost,
          total,
          shippingCity: parsed.data.shippingCity,
          shippingAddress: parsed.data.shippingAddress,
          notes: parsed.data.note || null,
          documentPhotoUrl: parseDataUrl(parsed.data.idPhoto),
          signatureUrl: parseDataUrl(parsed.data.signature),
          customerId: customer.id,
          paymentProvider: process.env.PSE_CHECKOUT_URL ? "PSE_PROVIDER" : null,
          paymentUrl: process.env.PSE_CHECKOUT_URL || null,
        },
      });

      for (const item of parsed.data.items) {
        const product = products.find((entry) => entry.id === item.productId);
        if (!product) continue;

        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: product.id,
            productName: product.name,
            unitPrice: product.price,
            quantity: item.quantity,
            lineTotal: product.price * item.quantity,
          },
        });

        await registerMovement(tx, {
          productId: product.id,
          kind:
            parsed.data.mode === "purchase"
              ? InventoryMovementKind.SOLD
              : InventoryMovementKind.RESERVED,
          quantity: item.quantity,
          note:
            parsed.data.mode === "purchase"
              ? `Venta cerrada en ${orderNumber}`
              : `Reserva creada en ${orderNumber}`,
          reference: orderNumber,
        });
      }

      if (parsed.data.mode === "reservation") {
        await tx.reservation.create({
          data: {
            orderId: order.id,
            customerId: customer.id,
            scheduledAt: parsed.data.reservationDate
              ? new Date(
                  `${parsed.data.reservationDate}T${parsed.data.reservationTime || "00:00"}:00`,
                )
              : null,
            deliveryMode: parsed.data.shippingMode,
            city: parsed.data.shippingCity,
            address: parsed.data.shippingAddress,
            note: parsed.data.note || null,
          },
        });
      }

      await tx.notification.create({
        data: {
          type:
            parsed.data.mode === "purchase"
              ? NotificationType.ORDER_CREATED
              : NotificationType.RESERVATION_CREATED,
          severity: NotificationSeverity.INFO,
          title:
            parsed.data.mode === "purchase"
              ? "Compra creada"
              : "Reserva creada",
          message: `${parsed.data.customer.fullName} generó una ${parsed.data.mode === "purchase" ? "compra" : "reserva"} con número ${orderNumber}.`,
          orderId: order.id,
        },
      });

      return {
        orderNumber,
        orderId: order.id,
        customerId: customer.id,
        status: order.status,
        paymentUrl: order.paymentUrl,
      };
    });

    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No fue posible crear la orden";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
