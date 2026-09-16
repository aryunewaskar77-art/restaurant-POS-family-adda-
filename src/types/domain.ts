/**
 * Domain Types — Family Adda
 *
 * Application-level types derived from the raw database row types.
 * These are the shapes your UI components and Server Actions should work with.
 *
 * Key patterns:
 *  - Domain types extend/alias Row types so they stay in sync with the schema
 *  - Joined types use `&` intersection for nested relations
 *  - UI-specific shapes (e.g. CartItem) are defined here, not in database.types.ts
 *  - All monetary values are in smallest currency unit (paise for INR)
 *    → use formatCurrency() utility to display to users
 */

import type {
  RestaurantRow,
  ProfileRow,
  CategoryRow,
  MenuRow,
  MenuItemRow,
  OrderRow,
  OrderItemRow,
  StaffRow,
  OrderStatus,
  ItemAvailability,
  UserRole,
} from "./database.types";

// ---------------------------------------------------------------------------
// Re-export enums for convenience — import from here, not database.types
// ---------------------------------------------------------------------------
export type { OrderStatus, ItemAvailability, UserRole };

// ---------------------------------------------------------------------------
// Core Domain Entities
// (direct aliases — no transformation needed at this layer)
// ---------------------------------------------------------------------------

/** A restaurant tenant */
export type Restaurant = RestaurantRow;

/** An authenticated user's extended profile */
export type Profile = ProfileRow;

/** A grouping of menu items (e.g. "Starters", "Main Course") */
export type Category = CategoryRow;

/** A named menu set (e.g. "Lunch Menu", "Dinner Special") */
export type Menu = MenuRow;

/** A single dish or product */
export type MenuItem = MenuItemRow;

/** An order placed by a customer */
export type Order = OrderRow;

/** A single line item within an order */
export type OrderItem = OrderItemRow;

/**
 * A staff member — `pin_hash` is deliberately omitted.
 * Never expose bcrypt hashes to client components or action return values.
 */
export type Staff = Omit<StaffRow, "pin_hash">;

// ---------------------------------------------------------------------------
// RPC Result Types (Phase 2)
// ---------------------------------------------------------------------------

export interface CreateOrderResult {
  orderId: string;
  total: number;
  itemCount: number;
}

export interface TransitionOrderResult {
  orderId: string;
  oldStatus: OrderStatus;
  newStatus: OrderStatus;
}

export interface VerifyPinSuccessResult {
  valid: true;
  staffId: string;
  name: string;
  role: string;
}

export type VerifyPinResult = VerifyPinSuccessResult | { valid: false };

// ---------------------------------------------------------------------------
// Joined / Expanded Types
// (returned by Supabase queries with .select() including relations)
// ---------------------------------------------------------------------------

/** MenuItem with its parent category hydrated */
export type MenuItemWithCategory = MenuItem & {
  category: Category | null;
};

/** MenuItem with its parent menu hydrated */
export type MenuItemWithMenu = MenuItem & {
  menu: Menu | null;
};

/** Full MenuItem with both category and menu hydrated */
export type MenuItemFull = MenuItem & {
  category: Category | null;
  menu: Menu | null;
};

/** Category with its menu items */
export type CategoryWithItems = Category & {
  menu_items: MenuItem[];
};

/** Order with its line items hydrated */
export type OrderWithItems = Order & {
  order_items: OrderItemWithMenuItem[];
};

/** OrderItem with the menu item snapshot hydrated */
export type OrderItemWithMenuItem = OrderItem & {
  menu_item: MenuItem;
};

/** Full order with customer profile and line items */
export type OrderFull = Order & {
  customer: Profile | null;
  order_items: OrderItemWithMenuItem[];
};

// ---------------------------------------------------------------------------
// Cart Types
// (client-side state — never persisted directly to DB in this shape)
// ---------------------------------------------------------------------------

/** A single item in the customer's cart */
export interface CartItem {
  menuItemId: string;
  name: string;
  price: number; // unit price in smallest currency unit
  quantity: number;
  imageUrl: string | null;
  notes: string | null;
}

/** The full cart state */
export interface Cart {
  restaurantId: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
}

// ---------------------------------------------------------------------------
// API / Mutation Payload Types
// ---------------------------------------------------------------------------

/** Payload to create a new order from the cart */
export interface CreateOrderPayload {
  restaurantId: string;
  tableNumber: string | null;
  notes: string | null;
  items: Array<{
    menuItemId: string;
    quantity: number;
    unitPrice: number;
    notes: string | null;
  }>;
}

/** Payload to update an order's status (kitchen or admin) */
export interface UpdateOrderStatusPayload {
  orderId: string;
  status: OrderStatus;
}

// ---------------------------------------------------------------------------
// Table Session Types (Phase 3)
// ---------------------------------------------------------------------------

export type SessionStatus = 'active' | 'bill_requested' | 'paid' | 'abandoned';
export type PaymentMethod = 'cash' | 'upi' | 'card';

export interface TableSessionSummary {
  sessionId: string;
  tableIdentifier: string;
  status: SessionStatus;
  startedAt: string;
  subtotal: number;
  tax: number;
  total: number;
  orderCount: number;
  orders: {
    id: string;
    placedAt: string;
    status: string;
    total: number;
    items: { name: string; quantity: number; unitPrice: number }[];
  }[];
}

// ---------------------------------------------------------------------------
// UI / Display Types
// ---------------------------------------------------------------------------

/** Condensed restaurant info for public-facing pages */
export type RestaurantPublic = Pick<
  Restaurant,
  | "id"
  | "name"
  | "slug"
  | "description"
  | "logo_url"
  | "cover_image_url"
  | "is_accepting_orders"
  | "currency"
>;

/** Condensed menu item for display in the customer menu */
export type MenuItemCard = Pick<
  MenuItem,
  | "id"
  | "name"
  | "description"
  | "price"
  | "image_url"
  | "availability"
  | "is_vegetarian"
  | "is_vegan"
  | "is_gluten_free"
  | "prep_time_minutes"
>;

/** Kitchen display order card */
export type KitchenOrderCard = {
  id: string;
  tableNumber: string | null;
  status: OrderStatus;
  placedAt: string;
  items: Array<{
    name: string;
    quantity: number;
    notes: string | null;
  }>;
};

// ---------------------------------------------------------------------------
// Utility / Helper Types
// ---------------------------------------------------------------------------

/** Make specific keys of T required */
export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;

/** Make specific keys of T optional */
export type OptionalKeys<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

/** Pagination parameters */
export interface PaginationParams {
  page: number;
  pageSize: number;
}

/** Paginated response wrapper */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** Standard API error */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
