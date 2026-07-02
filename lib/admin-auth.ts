import crypto from "crypto";

const COOKIE_NAME = "altea_admin_session";

function getSecret() {
  return process.env.AUTH_SECRET || "dev-secret-change-me";
}

export function buildAdminToken(email: string) {
  const payload = Buffer.from(email).toString("base64url");
  const signature = crypto
    .createHmac("sha256", getSecret())
    .update(payload)
    .digest("base64url");
  return `${payload}.${signature}`;
}

export function verifyAdminToken(token?: string | null) {
  if (!token) return null;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expectedSignature = crypto
    .createHmac("sha256", getSecret())
    .update(payload)
    .digest("base64url");

  if (signature !== expectedSignature) return null;

  try {
    return Buffer.from(payload, "base64url").toString("utf8");
  } catch {
    return null;
  }
}

export function adminCookieName() {
  return COOKIE_NAME;
}
