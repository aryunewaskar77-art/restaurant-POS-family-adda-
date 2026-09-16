const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  "https://syuxyauriptobnptkxca.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5dXh5YXVyaXB0b2JucHRreGNhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODQ1MDQxNSwiZXhwIjoyMTA0MDI2NDE1fQ.gKcqps_ogipDhR-zTRWGgzn3ZqN6oX99bgXvZ7sAUns"
); 
async function main() {
  const { data } = await supabase.from("categories").select("restaurant_id").limit(1);
  console.log("Restaurant ID in DB:", data[0]?.restaurant_id);
}
main();
