/**
 * Staff Validation Schemas — Family Adda
 *
 * Zod v4 schemas for staff PIN verification and session management.
 */

import { z } from "zod";

// ---------------------------------------------------------------------------
// Staff PIN Verification
// Numeric PIN of 4–8 digits. Never stored or transmitted raw after hashing.
// ---------------------------------------------------------------------------

export const VerifyStaffPinSchema = z.object({
  pin: z
    .string()
    .length(4, "PIN must be exactly 4 digits")
    .regex(/^\d+$/, "PIN must contain only digits"),
});

export type VerifyStaffPinInput = z.infer<typeof VerifyStaffPinSchema>;

// ---------------------------------------------------------------------------
// POS Session Cookie Payload
// This is the shape stored inside the tamper-evident HTTP-only cookie.
// ---------------------------------------------------------------------------

export const STAFF_ROLE_VALUES = ["staff", "kitchen", "admin", "owner"] as const;
export type StaffRole = (typeof STAFF_ROLE_VALUES)[number];

export const PosSessionPayloadSchema = z.object({
  staffId: z.string().uuid(),
  restaurantId: z.string().uuid(),
  name: z.string().min(1),
  role: z.enum(STAFF_ROLE_VALUES),
  /** Unix timestamp (seconds) when this session was issued */
  issuedAt: z.number().int().positive(),
  /** Unix timestamp (seconds) when this session expires */
  expiresAt: z.number().int().positive(),
});

export type PosSessionPayload = z.infer<typeof PosSessionPayloadSchema>;

// ---------------------------------------------------------------------------
// Staff creation (admin panel — plain PIN is hashed server-side via RPC)
// ---------------------------------------------------------------------------

export const CreateStaffSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name cannot exceed 80 characters"),
  role: z.enum(STAFF_ROLE_VALUES, {
    error: "Role must be staff, kitchen, admin, or owner",
  }),
  pin: z
    .string()
    .length(4, "PIN must be exactly 4 digits")
    .regex(/^\d+$/, "PIN must contain only digits"),
});

export type CreateStaffInput = z.infer<typeof CreateStaffSchema>;
