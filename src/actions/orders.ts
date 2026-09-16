'use server';

/**
 * Order Server Actions — Family Adda
 *
 * All customer-facing order mutations flow through here.
 * Zero client-side writes; prices are always re-fetched from the DB via RPC.
 *
 * Actions:
 *  - createOrder       — atomic order creation via create_customer_order RPC
 *  - cancelOrder       — customer-initiated cancellation (pending only)
 */

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import {
  CreateOrderSchema,
  CancelOrderSchema,
  type CreateOrderInput,
  type CancelOrderInput,
} from '@/lib/validations/order';

// ---------------------------------------------------------------------------
// Response type shared by all actions
// ---------------------------------------------------------------------------

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

// ---------------------------------------------------------------------------
// Typed RPC helper
//
// supabase-js v2.115.0 resolves Database.Functions['Args'] to `never` when the
// Database generic doesn't satisfy the internal GenericSchema constraint.
// We isolate the `as unknown as any` cast here so all other code remains typed.
// Type safety is maintained by Zod validation before every call and explicit
// result casting after every call.
// ---------------------------------------------------------------------------

type RpcArgs = Record<string, unknown>;
type RpcResult<T> = Promise<{ data: T | null; error: { message: string } | null }>;

async function callRpc<T = unknown>(
   
  supabase: any,
  fnName: string,
  args: RpcArgs
): RpcResult<T> {
  return supabase.rpc(fnName, args);
}

// ---------------------------------------------------------------------------
// createOrder
//
// Called from the customer cart page. Validates input, then delegates all
// price calculation and atomicity to the create_customer_order Postgres RPC.
//
// Returns: { orderId, total, itemCount } on success
// ---------------------------------------------------------------------------

export async function createOrder(
  rawInput: CreateOrderInput
): Promise<ActionResult<{ orderId: string; total: number; itemCount: number }>> {
  // ── 1. Validate input shape ──────────────────────────────────────────────
  const parsed = CreateOrderSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      error: 'Invalid order data',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { tableIdentifier, items } = parsed.data;

  // ── 2. Inject server-side restaurant ID (never from client) ──────────────
  const restaurantId = process.env.NEXT_PUBLIC_DEFAULT_RESTAURANT_ID;
  if (!restaurantId) {
    return { success: false, error: 'Restaurant configuration error' };
  }

  // ── 3. Call the atomic RPC ───────────────────────────────────────────────
  const supabase = await createClient();

  const { data, error } = await callRpc<{
    order_id: string;
    total: number;
    item_count: number;
  }>(supabase, 'create_customer_order', {
    p_restaurant_id: restaurantId,
    p_table_identifier: tableIdentifier,
    p_items: items.map((item) => ({
      menu_item_id: item.menuItemId,
      quantity: item.quantity,
      notes: item.notes ?? null,
    })),
  });

  if (error) {
    console.error('[createOrder] RPC error:', error);
    return {
      success: false,
      error: error.message ?? 'Failed to create order. Please try again.',
    };
  }

  if (!data) {
    return { success: false, error: 'Order creation returned no data.' };
  }

  // ── 4. Invalidate kitchen display cache ──────────────────────────────────
  revalidatePath('/display');

  return {
    success: true,
    data: {
      orderId: data.order_id,
      total: data.total,
      itemCount: data.item_count,
    },
  };
}

// ---------------------------------------------------------------------------
// cancelOrder
//
// Allows a customer to cancel their own order while it is still 'pending'.
// Validated with CancelOrderSchema; the RPC enforces state-machine rules.
// ---------------------------------------------------------------------------

export async function cancelOrder(
  rawInput: CancelOrderInput
): Promise<ActionResult> {
  const parsed = CancelOrderSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      error: 'Invalid request',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { orderId } = parsed.data;
  const restaurantId = process.env.NEXT_PUBLIC_DEFAULT_RESTAURANT_ID;
  if (!restaurantId) {
    return { success: false, error: 'Restaurant configuration error' };
  }

  const supabase = await createClient();

  const { error } = await callRpc(supabase, 'transition_order_status', {
    p_order_id: orderId,
    p_new_status: 'cancelled',
    p_staff_id: null,
  });

  if (error) {
    console.error('[cancelOrder] RPC error:', error);
    return { success: false, error: error.message ?? 'Failed to cancel order.' };
  }

  revalidatePath('/orders');
  revalidatePath('/display');

  return { success: true, data: undefined };
}
