"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const onLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <button
      onClick={onLogout}
      className="border border-white/15 px-4 py-2 font-detail text-[11px] uppercase tracking-[0.22em] text-white transition-colors hover:border-white hover:bg-white hover:text-ink"
    >
      Cerrar sesión
    </button>
  );
}
