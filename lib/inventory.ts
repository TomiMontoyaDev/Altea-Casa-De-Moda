type Tx = any;

const InventoryMovementKind = {
  INBOUND: "INBOUND",
  SOLD: "SOLD",
  RENTED: "RENTED",
  RESERVED: "RESERVED",
  ADJUSTMENT: "ADJUSTMENT",
} as const;

const NotificationType = {
  STOCK_IN: "STOCK_IN",
  SOLD: "SOLD",
  RENTED: "RENTED",
  LOW_STOCK: "LOW_STOCK",
  OUT_OF_STOCK: "OUT_OF_STOCK",
} as const;

const NotificationSeverity = {
  INFO: "INFO",
  WARNING: "WARNING",
  CRITICAL: "CRITICAL",
} as const;

type InventoryMovementKind =
  (typeof InventoryMovementKind)[keyof typeof InventoryMovementKind];

function getNotificationByMovement(kind: InventoryMovementKind) {
  switch (kind) {
    case InventoryMovementKind.INBOUND:
      return {
        type: NotificationType.STOCK_IN,
        severity: NotificationSeverity.INFO,
        title: "Ingreso a bodega",
        message: "Se registró una entrada de inventario.",
      };
    case InventoryMovementKind.SOLD:
      return {
        type: NotificationType.SOLD,
        severity: NotificationSeverity.INFO,
        title: "Venta cerrada",
        message: "Se descontó inventario por una venta confirmada.",
      };
    case InventoryMovementKind.RENTED:
      return {
        type: NotificationType.RENTED,
        severity: NotificationSeverity.INFO,
        title: "Prenda rentada",
        message: "Se descontó inventario por alquiler confirmado.",
      };
    default:
      return {
        type: NotificationType.STOCK_IN,
        severity: NotificationSeverity.INFO,
        title: "Ajuste de inventario",
        message: "Se registró un movimiento manual de stock.",
      };
  }
}

export async function registerMovement(
  tx: Tx,
  input: {
    productId: string;
    kind: InventoryMovementKind;
    quantity: number;
    note?: string | null;
    reference?: string | null;
  },
) {
  const product = await tx.product.findUnique({
    where: { id: input.productId },
  });
  if (!product) {
    throw new Error("Producto no encontrado");
  }

  let stockDelta = input.quantity;
  if (
    input.kind === InventoryMovementKind.SOLD ||
    input.kind === InventoryMovementKind.RENTED ||
    input.kind === InventoryMovementKind.RESERVED
  ) {
    stockDelta = -Math.abs(input.quantity);
  }

  const nextStock = product.stock + stockDelta;
  if (nextStock < 0) {
    throw new Error(`Stock insuficiente para ${product.name}`);
  }

  const updatedProduct = await tx.product.update({
    where: { id: input.productId },
    data: { stock: nextStock },
  });

  await tx.inventoryMovement.create({
    data: {
      productId: input.productId,
      kind: input.kind,
      quantity: input.quantity,
      note: input.note ?? null,
      reference: input.reference ?? null,
    },
  });

  const movementNotification = getNotificationByMovement(input.kind);
  await tx.notification.create({
    data: {
      ...movementNotification,
      productId: input.productId,
      message: `${movementNotification.message} Stock actual: ${updatedProduct.stock}.`,
    },
  });

  if (updatedProduct.stock <= 0) {
    await tx.notification.create({
      data: {
        type: NotificationType.OUT_OF_STOCK,
        severity: NotificationSeverity.CRITICAL,
        title: "Sin stock",
        message: `${product.name} quedó sin stock.`,
        productId: input.productId,
      },
    });
  } else if (updatedProduct.stock === 1) {
    await tx.notification.create({
      data: {
        type: NotificationType.LOW_STOCK,
        severity: NotificationSeverity.CRITICAL,
        title: "Stock urgente",
        message: `${product.name} quedó con 1 unidad disponible.`,
        productId: input.productId,
      },
    });
  } else if (updatedProduct.stock <= 3) {
    await tx.notification.create({
      data: {
        type: NotificationType.LOW_STOCK,
        severity: NotificationSeverity.WARNING,
        title: "Stock bajo",
        message: `${product.name} tiene ${updatedProduct.stock} unidades disponibles.`,
        productId: input.productId,
      },
    });
  }

  return updatedProduct;
}
