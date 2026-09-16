import { z } from "zod";

export const PinLoginSchema = z.object({
  pin: z.string().regex(/^\d{4}$/, "PIN must be exactly 4 digits"),
});

export const OrderStatusEnum = z.enum(["pending", "in_kitchen", "ready", "completed", "voided"]);

export const UpdateOrderStatusSchema = z.object({
  orderId: z.string().uuid(),
  status: OrderStatusEnum,
});

export type PinLoginInput = z.infer<typeof PinLoginSchema>;
export type UpdateOrderStatusInput = z.infer<typeof UpdateOrderStatusSchema>;
