import { createClient } from "@/lib/supabase/server";
import { MenuClient } from "./MenuClient";

export default async function DineInMenuPage({
  params,
}: {
  params: Promise<{ tableId: string }>;
}) {
  const tableId = (await params).tableId;
  const restaurantId = process.env.NEXT_PUBLIC_DEFAULT_RESTAURANT_ID!;
  const supabase = await createClient();

  const { data: categories, error } = await supabase
    .from("categories")
    .select("id, name, menu_items(id, name, description, price, is_available)")
    .eq("restaurant_id", restaurantId)
    .eq("is_active", true)
    .order("sort_order");

  if (error || !categories) {
    return (
      <div className="p-8 text-center text-gray-500">
        Failed to load menu. Please scan the QR code again.
      </div>
    );
  }

  const { getActiveSessionForTable } = await import("@/actions/settlement");
  const { session } = await getActiveSessionForTable(tableId);

  return <MenuClient tableId={tableId} categories={categories} initialSession={session} />;
}
