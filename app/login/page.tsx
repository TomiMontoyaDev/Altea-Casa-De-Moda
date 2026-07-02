"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState(
    process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@altea.com",
  );
  const [password, setPassword] = useState("Altea123!");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      setError(payload.error || "No fue posible iniciar sesión");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-ink px-6 py-20 text-white">
      <div className="mx-auto mb-8 max-w-5xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-detail text-[11px] uppercase tracking-[0.24em] text-white/60 transition-colors hover:text-white"
        >
          ← Volver a la página principal
        </Link>
      </div>
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="space-y-6">
          <p className="font-detail text-[11px] uppercase tracking-[0.3em] text-white/45">
            ALTEA ERP
          </p>
          <h1 className="max-w-xl font-display text-5xl leading-tight sm:text-7xl">
            Acceso al dashboard de ventas, inventario y notificaciones.
          </h1>
          <p className="max-w-xl font-body text-sm leading-relaxed text-white/70">
            Desde aquí entras al panel donde ves compras, reservas, stock y
            alertas de urgencia. El acceso está protegido y redirige al ERP
            interno.
          </p>
          <div className="flex flex-wrap gap-3 text-[11px] uppercase tracking-[0.24em] text-white/60">
            <span className="rounded-full border border-white/15 px-3 py-2">
              Ventas
            </span>
            <span className="rounded-full border border-white/15 px-3 py-2">
              Stock
            </span>
            <span className="rounded-full border border-white/15 px-3 py-2">
              Reservas
            </span>
            <span className="rounded-full border border-white/15 px-3 py-2">
              Notificaciones
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/6 p-8 backdrop-blur-sm">
          <div>
            <p className="font-detail text-[11px] uppercase tracking-[0.3em] text-white/50">
              ALTEA Admin
            </p>
            <h1 className="mt-3 font-display text-4xl">Ingreso al dashboard</h1>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              className="w-full border border-white/15 bg-transparent px-4 py-3 font-body text-sm outline-none"
              placeholder="Correo"
            />
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              className="w-full border border-white/15 bg-transparent px-4 py-3 font-body text-sm outline-none"
              placeholder="Contraseña"
            />
            {error ? (
              <p className="font-body text-sm text-red-300">{error}</p>
            ) : null}
            <button
              disabled={loading}
              className="w-full bg-white px-4 py-3 font-detail text-[11px] uppercase tracking-[0.25em] text-ink transition-transform hover:-translate-y-0.5 disabled:opacity-60"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
