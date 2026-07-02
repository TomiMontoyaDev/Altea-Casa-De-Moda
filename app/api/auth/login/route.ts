import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";

import { adminCookieName, buildAdminToken } from "@/lib/admin-auth";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const allowedEmail = process.env.ADMIN_EMAIL;
  const allowedPassword = process.env.ADMIN_PASSWORD;

  if (!allowedEmail || !allowedPassword) {
    return NextResponse.json(
      { error: "Credenciales de admin no configuradas" },
      { status: 500 },
    );
  }

  if (
    parsed.data.email !== allowedEmail ||
    parsed.data.password !== allowedPassword
  ) {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 401 });
  }

  const token = buildAdminToken(parsed.data.email);
  const cookieStore = await cookies();
  cookieStore.set(adminCookieName(), token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return NextResponse.json({ ok: true });
}
