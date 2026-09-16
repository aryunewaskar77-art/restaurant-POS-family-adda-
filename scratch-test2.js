const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  "https://syuxyauriptobnptkxca.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5dXh5YXVyaXB0b2JucHRreGNhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODQ1MDQxNSwiZXhwIjoyMTA0MDI2NDE1fQ.gKcqps_ogipDhR-zTRWGgzn3ZqN6oX99bgXvZ7sAUns"
); 

async function main() {
  const { data, error } = await supabase.from("orders").select("*").limit(1);
  if (error) console.error("ERROR:", JSON.stringify(error, null, 2));
  else console.log("SUCCESS");
}
main();
