"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
      <div className="mx-auto flex max-w-md flex-col gap-6 rounded-3xl border border-white/10 bg-white/6 p-8 backdrop-blur-sm">
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
    </main>
  );
}
