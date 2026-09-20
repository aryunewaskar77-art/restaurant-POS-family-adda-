import { createClient } from "@/lib/supabase/server";
import { MenuManagerClient } from "@/components/admin/MenuManagerClient";
import { cookies } from "next/headers";
import { UnlockEditingBanner } from "@/components/admin/UnlockEditingBanner";

export const revalidate = 10; // Cache for 10 seconds

export default async function AdminMenuPage() {
  const cookieStore = await cookies();
  const isEditUnlocked = !!cookieStore.get("edit_mode_access");

  const supabase = await createClient();
  const restaurantId = process.env.NEXT_PUBLIC_DEFAULT_RESTAURANT_ID!;

  // Fetch both in parallel
  const [{ data: categories, error: catError }, { data: menuItems, error: itemError }] = await Promise.all([
    supabase.from("categories").select("id, name").eq("restaurant_id", restaurantId).order("sort_order"),
    supabase.from("menu_items").select("id, name, price, is_available, category_id").eq("restaurant_id", restaurantId).order("name"),
  ]);

  if (catError || itemError) {
    return <div className="text-red-500 p-8"><h3>Error loading catalog.</h3><pre className="mt-4 p-4 bg-red-50 rounded text-xs overflow-auto">{JSON.stringify({ catError, itemError, restaurantId }, null, 2)}</pre></div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-extrabold text-brand-900 tracking-tight">Menu Catalog</h1>
      <p className="text-gray-500 mb-8">Manage pricing and instantly 86 (hide) items from the customer menu.</p>
      
      <UnlockEditingBanner isUnlocked={isEditUnlocked} />
      
      <MenuManagerClient categories={categories || []} menuItems={menuItems || []} isEditUnlocked={isEditUnlocked} />
    </div>
  );
}
