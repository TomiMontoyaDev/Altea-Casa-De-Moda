import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { adminCookieName } from "@/lib/admin-auth";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete(adminCookieName());
  return NextResponse.json({ ok: true });
}
