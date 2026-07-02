import { NextResponse } from "next/server";
import { z } from "zod";
import { InventoryMovementKind } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { registerMovement } from "@/lib/inventory";

const schema = z.object({
  productId: z.string().min(1),
  kind: z.nativeEnum(InventoryMovementKind),
  quantity: z.number().int().positive(),
  note: z.string().optional(),
  reference: z.string().optional(),
});

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = schema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "Movimiento inválido" }, { status: 400 });
  }

  try {
    const result = await prisma.$transaction((tx) =>
      registerMovement(tx, {
        productId: parsed.data.productId,
        kind: parsed.data.kind,
        quantity: parsed.data.quantity,
        note: parsed.data.note,
        reference: parsed.data.reference,
      }),
    );

    return NextResponse.json({ ok: true, stock: result.stock });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "No fue posible registrar el movimiento";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
