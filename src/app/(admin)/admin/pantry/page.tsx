import { createClient } from "@/lib/supabase/server";
import { PantryManagerClient } from "@/components/admin/PantryManagerClient";

export default async function AdminPantryPage() {
  const supabase = await createClient();
  const restaurantId = process.env.NEXT_PUBLIC_DEFAULT_RESTAURANT_ID!;

  // Fetch pantry items
  const { data: pantryItems, error } = await supabase
    .from("pantry_items")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .order("category", { ascending: true })
    .order("name", { ascending: true });

  if (error && error.code !== 'PGRST205' && error.code !== '42P01') {
    // Ignore PGRST205/42P01 (table does not exist) to allow graceful degradation before migration
    console.error("Failed to load pantry items", JSON.stringify(error, null, 2) || error);
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-extrabold text-brand-900 tracking-tight">Pantry Management</h1>
      <p className="text-gray-500 mb-8">Track ingredients, manage current stock, and identify what needs to be ordered.</p>
      
      {error && (error.code === 'PGRST205' || error.code === '42P01') ? (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-6 rounded-xl">
          <h3 className="font-bold mb-2">Database Table Missing</h3>
          <p>Please run the <code>04_pantry.sql</code> migration in your Supabase SQL Editor to enable Pantry Management.</p>
        </div>
      ) : (
        <PantryManagerClient initialItems={pantryItems || []} restaurantId={restaurantId} />
      )}
    </div>
  );
}
