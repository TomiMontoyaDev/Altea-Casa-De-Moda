# ALTEA — Fase 1: Setup + Design System

Setup inicial del e-commerce ALTEA con la identidad de marca aplicada
(paleta, tipografías, hero y estructura base de Home).

## Cómo correrlo

```bash
npm install
npm run dev
```

Abrí http://localhost:3000

## Notas de diseño (leer antes de tocar estilos)

- **Paleta**: tomada literal del manual de marca, pág. 20. Están todas
  en `app/globals.css` bajo `@theme`. No agregar colores nuevos sin
  actualizar ese archivo — es la única fuente de verdad de la paleta.
- **Tipografía del logo/hero** (`--font-display`): usé **Bodoni Moda**
  de Google Fonts como aproximación a la serif Didone del wordmark
  original. Si tenés el archivo real de la fuente del logo (.otf/.woff2),
  reemplazala en `app/globals.css` y quedará 100% fiel.
- **Tipografía de detalles** (`--font-detail`, labels/eyebrows chicos):
  usé **DM Sans** como sustituto de "Brother 1816" (no está disponible
  en Google Fonts públicamente).
- **Mosaico de wordmark** en el Hero: es el mismo recurso visual de la
  página 2 del manual de marca — se reutiliza como elemento de firma
  del sitio, no es un fondo genérico.
- **Arquetipos de marca** (Mago 50% / Amante 50%): reflejados en el
  Hero (misterio, mosaico, foco en un solo elemento centrado — Mago) y
  en Colecciones (exclusividad, personalización, "Ver más" que aparece
  solo al pasar el mouse — Amante).

## Animaciones

- **Lenis** (`components/SmoothScroll.tsx`): scroll suave global, sincronizado
  con el ticker de GSAP. Se desactiva solo si el usuario tiene activado
  "reducir movimiento" en su sistema — en ese caso queda el scroll nativo.
- **GSAP + ScrollTrigger**:
  - `components/Hero.tsx`: el wordmark "ALTEA" entra letra por letra al
    cargar, el mosaico de fondo tiene parallax, y al scrollear el wordmark
    se escala y desvanece en un "zoom-through" (efecto tráiler tipo GTA VI).
  - `components/Reveal.tsx`: wrapper genérico de fade-up al entrar en
    viewport, usado en Propósito, Círculo de Oro y Colecciones.
- **Framer Motion**: micro-interacciones — hover de las cards de
  Colecciones (borde + "Ver más" deslizante) y la animación de apertura
  del menú mobile en el Header.

Todas las animaciones respetan `prefers-reduced-motion` (chequeo manual en
cada componente, ya que GSAP no lo respeta automáticamente).

## Qué sigue (Fase 2 en adelante)

Este commit es solo Fase 1 del plan (setup + design system + Home).
Faltan: schema de Prisma, Auth, catálogo real con datos, sistema de
alquiler, carrito/checkout con Wompi, cuenta de usuario y dashboard
admin — según el roadmap del documento de planificación.
