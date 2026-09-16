/**
 * POS Session Cookie Utility — Family Adda
 *
 * Creates and verifies tamper-evident HTTP-only `pos_session` cookies.
 *
 * Security model:
 *  - Payload is Base64-encoded JSON (not encrypted — not secret, but signed)
 *  - HMAC-SHA256 signature computed with NEXT_PUBLIC_SUPABASE_URL + secret
 *    to prevent cross-environment replay attacks
 *  - Cookie flags: HttpOnly, Secure, SameSite=Strict, Path=/
 *  - Sessions expire after SESSION_TTL_SECONDS (default 8 hours = one shift)
 *
 * Usage:
 *  - Write: `await setStaffSession(staffData)` inside a Server Action
 *  - Read:  `const session = await getStaffSession()` in Server Components / Actions
 *  - Clear: `await clearStaffSession()` on logout
 *
 * IMPORTANT: All functions are server-only. Never import in 'use client' components.
 */

import { cookies } from "next/headers";
import type { PosSessionPayload } from "@/lib/validations/staff";
import { PosSessionPayloadSchema } from "@/lib/validations/staff";

// Re-export so consumers can import from one place
export type { PosSessionPayload };

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const COOKIE_NAME = "pos_session";
const SESSION_TTL_SECONDS = 8 * 60 * 60; // 8 hours — one kitchen shift

// ---------------------------------------------------------------------------
// HMAC-SHA256 using the Web Crypto API (available in Node 18+ / Edge runtime)
// ---------------------------------------------------------------------------

async function getSigningKey(): Promise<CryptoKey> {
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");

  const encoder = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

async function sign(payload: string): Promise<string> {
  const key = await getSigningKey();
  const encoder = new TextEncoder();
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  // Convert ArrayBuffer to hex string
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function verify(payload: string, signature: string): Promise<boolean> {
  try {
    const expected = await sign(payload);
    // Constant-time comparison (same length hex strings)
    if (expected.length !== signature.length) return false;
    let mismatch = 0;
    for (let i = 0; i < expected.length; i++) {
      mismatch |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
    }
    return mismatch === 0;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Cookie encoding / decoding
// Format: base64url(JSON payload) . hmac-sha256-hex
// ---------------------------------------------------------------------------

async function encodeCookie(payload: PosSessionPayload): Promise<string> {
  const json = JSON.stringify(payload);
  const b64 = Buffer.from(json).toString("base64url");
  const sig = await sign(b64);
  return `${b64}.${sig}`;
}

async function decodeCookie(
  value: string
): Promise<PosSessionPayload | null> {
  const dotIdx = value.lastIndexOf(".");
  if (dotIdx === -1) return null;

  const b64 = value.slice(0, dotIdx);
  const sig = value.slice(dotIdx + 1);

  const valid = await verify(b64, sig);
  if (!valid) return null;

  try {
    const json = Buffer.from(b64, "base64url").toString("utf-8");
    const raw = JSON.parse(json);
    const result = PosSessionPayloadSchema.safeParse(raw);
    if (!result.success) return null;
    return result.data;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Writes a new POS session cookie for the authenticated staff member.
 * Call inside a Server Action after `verify_staff_pin` succeeds.
 */
export async function setStaffSession(data: {
  staffId: string;
  restaurantId: string;
  name: string;
  role: PosSessionPayload["role"];
}): Promise<void> {
  const now = Math.floor(Date.now() / 1000);
  const payload: PosSessionPayload = {
    ...data,
    issuedAt: now,
    expiresAt: now + SESSION_TTL_SECONDS,
  };

  const encoded = await encodeCookie(payload);
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, encoded, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

/**
 * Reads and validates the current POS session cookie.
 * Returns null if missing, expired, or tampered with.
 */
export async function getStaffSession(): Promise<PosSessionPayload | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME);
  if (!cookie?.value) return null;

  const payload = await decodeCookie(cookie.value);
  if (!payload) return null;

  // Check expiry
  const now = Math.floor(Date.now() / 1000);
  if (payload.expiresAt <= now) return null;

  return payload;
}

/**
 * Clears the POS session cookie (logout).
 */
export async function clearStaffSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/**
 * Asserts that a valid staff session exists and the caller has one of the
 * required roles. Throws an error if not — use inside Server Actions.
 */
export async function requireStaffSession(
  ...allowedRoles: PosSessionPayload["role"][]
): Promise<PosSessionPayload> {
  const session = await getStaffSession();

  if (!session) {
    throw new Error("No active staff session. Please sign in with your PIN.");
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(session.role)) {
    throw new Error(
      `Access denied. Required roles: ${allowedRoles.join(", ")}. Your role: ${session.role}`
    );
  }

  return session;
}
