export type OrderStatus = "pending" | "in_kitchen" | "ready" | "completed" | "voided" | "confirmed" | "preparing" | "delivered" | "cancelled";
export type ItemAvailability = "available" | "unavailable" | "seasonal";
export type UserRole = "customer" | "staff" | "kitchen" | "admin" | "owner";

export interface RestaurantRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
  currency: string;
  timezone: string;
  is_accepting_orders: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProfileRow {
  id: string;
  restaurant_id: string | null;
  full_name: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface CategoryRow {
  id: string;
  restaurant_id: string;
  name: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface MenuRow {
  id: string;
  restaurant_id: string;
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MenuItemRow {
  id: string;
  restaurant_id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  image_url: string | null;
  price: number;
  availability: ItemAvailability;
  is_available: boolean;
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_gluten_free: boolean;
  prep_time_minutes: number | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface OrderRow {
  id: string;
  restaurant_id: string;
  table_number: string | null;
  status: OrderStatus;
  subtotal: number;
  tax: number;
  total: number;
  placed_at: string;
  updated_at: string;
}

export interface OrderItemRow {
  id: string;
  order_id: string;
  menu_item_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  notes: string | null;
}

export interface StaffRow {
  id: string;
  restaurant_id: string;
  name: string;
  role: UserRole;
  pin_hash: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      restaurants: { Row: RestaurantRow; Insert: Partial<RestaurantRow>; Update: Partial<RestaurantRow> };
      profiles: { Row: ProfileRow; Insert: Partial<ProfileRow>; Update: Partial<ProfileRow> };
      categories: { Row: CategoryRow; Insert: Partial<CategoryRow>; Update: Partial<CategoryRow> };
      menus: { Row: MenuRow; Insert: Partial<MenuRow>; Update: Partial<MenuRow> };
      menu_items: { Row: MenuItemRow; Insert: Partial<MenuItemRow>; Update: Partial<MenuItemRow> };
      orders: { Row: OrderRow; Insert: Partial<OrderRow>; Update: Partial<OrderRow> };
      order_items: { Row: OrderItemRow; Insert: Partial<OrderItemRow>; Update: Partial<OrderItemRow> };
      staff: { Row: StaffRow; Insert: Partial<StaffRow>; Update: Partial<StaffRow> };
    };
    Enums: {
      order_status: OrderStatus;
      item_availability: ItemAvailability;
      user_role: UserRole;
    };
  };
}