const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  "https://syuxyauriptobnptkxca.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5dXh5YXVyaXB0b2JucHRreGNhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODQ1MDQxNSwiZXhwIjoyMTA0MDI2NDE1fQ.gKcqps_ogipDhR-zTRWGgzn3ZqN6oX99bgXvZ7sAUns"
);

async function main() {
  const { data, error } = await supabase
    .from("orders")
    .select("id, table_number, status, placed_at, order_items(id, quantity, notes, menu_items(name))")
    .eq("restaurant_id", "00000000-0000-0000-0000-000000000001")
    .in("status", ["pending", "in_kitchen", "ready", "completed", "voided", "cancelled"])
    .order("placed_at", { ascending: true })
    .limit(50);
  
  if (error) console.error("ERROR:", JSON.stringify(error, null, 2));
  else console.log("SUCCESS:", data.length);
}
main();
