import "dotenv/config";
import { PrismaClient, ProductCategory } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const products = [
  {
    slug: "aurora",
    name: "Aurora Couture",
    category: ProductCategory.NOVIAS,
    price: 1290000,
    stock: 2,
    image: "/img/WhatsApp Image 2026-07-02 at 2.07.24 PM.jpeg",
    description: "Silencio visual, volumen editorial y caída de alto impacto.",
  },
  {
    slug: "lumina",
    name: "Lumina Set",
    category: ProductCategory.VENTA,
    price: 520000,
    stock: 5,
    image: "/img/WhatsApp Image 2026-07-02 at 2.07.24 PM (1).jpeg",
    description: "Look de evento con textura rica y presencia contemporánea.",
  },
  {
    slug: "nocturna",
    name: "Nocturna Prime",
    category: ProductCategory.ALQUILER,
    price: 360000,
    stock: 4,
    image: "/img/WhatsApp Image 2026-07-02 at 2.07.24 PM (2).jpeg",
    description: "Ideal para grados, fiestas y noches con fotografía intensa.",
  },
  {
    slug: "atelier",
    name: "Atelier Veil",
    category: ProductCategory.ACCESORIOS,
    price: 180000,
    stock: 8,
    image: "/img/WhatsApp Image 2026-07-02 at 2.07.24 PM (3).jpeg",
    description: "Detalle final para elevar cualquier styling sin ruido.",
  },
  {
    slug: "esencia",
    name: "Esencia Bridal",
    category: ProductCategory.NOVIAS,
    price: 980000,
    stock: 2,
    image: "/img/WhatsApp Image 2026-07-02 at 2.13.10 PM.jpeg",
    description: "Para una prueba cómoda con asesoría y ajuste guiado.",
  },
  {
    slug: "bruma",
    name: "Bruma Signature",
    category: ProductCategory.VENTA,
    price: 690000,
    stock: 3,
    image: "/img/WhatsApp Image 2026-07-02 at 2.13.11 PM.jpeg",
    description: "Editorial limpio, moderno y listo para la vitrina digital.",
  },
  {
    slug: "gala",
    name: "Gala Alquiler",
    category: ProductCategory.ALQUILER,
    price: 450000,
    stock: 3,
    image: "/img/WhatsApp Image 2026-07-02 at 2.13.11 PM (1).jpeg",
    description: "Pensado para el carrito rápido y la reserva por WhatsApp.",
  },
  {
    slug: "noche",
    name: "Noche Alta",
    category: ProductCategory.VENTA,
    price: 750000,
    stock: 2,
    image: "/img/WhatsApp Image 2026-07-02 at 2.13.11 PM (2).jpeg",
    description: "Una pieza contundente para campañas y eventos premium.",
  },
  {
    slug: "invitada",
    name: "Invitada Plus",
    category: ProductCategory.ALQUILER,
    price: 410000,
    stock: 3,
    image: "/img/WhatsApp Image 2026-07-02 at 2.13.11 PM (3).jpeg",
    description: "Filtrado por ocasión, talla y disponibilidad inmediata.",
  },
  {
    slug: "editorial",
    name: "Editorial Mood",
    category: ProductCategory.ACCESORIOS,
    price: 220000,
    stock: 6,
    image: "/img/WhatsApp Image 2026-07-02 at 2.13.11 PM (4).jpeg",
    description:
      "Para complementar sesiones, novias y estilismos de alta gama.",
  },
  {
    slug: "finale",
    name: "Finale Look",
    category: ProductCategory.VENTA,
    price: 870000,
    stock: 1,
    image: "/img/WhatsApp Image 2026-07-02 at 2.13.12 PM.jpeg",
    description: "Una pieza final para lookbooks y vitrinas con movimiento.",
  },
];

async function main() {
  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
