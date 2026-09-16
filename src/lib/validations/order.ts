import { z } from "zod";

export const OrderItemInputSchema = z.object({
  menuItemId: z.string().uuid(),
  quantity: z.number().int().min(1).max(50),
  notes: z.string().max(200).optional(),
});

export const CreateOrderSchema = z.object({
  tableIdentifier: z.string().min(1).max(20),
  items: z.array(OrderItemInputSchema).min(1),
});

export type OrderItemInput = z.infer<typeof OrderItemInputSchema>;
export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;

export const CancelOrderSchema = z.object({
  orderId: z.string().uuid(),
  reason: z.string().max(300).optional(),
});
export type CancelOrderInput = z.infer<typeof CancelOrderSchema>;

export const SettleSessionSchema = z.object({
  sessionId: z.string().uuid('Invalid session ID'),
  paymentMethod: z.enum(['cash', 'upi', 'card']),
  paymentReference: z.string().max(100).optional(),
});
export type SettleSessionInput = z.infer<typeof SettleSessionSchema>;

