const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  "https://syuxyauriptobnptkxca.supabase.co",
  "sb_publishable_z_zOF-u_QRZ3YgNtO3U3Rg_W7n_H9L2"
); 
async function main() {
  const { data: cat, error } = await supabase.from("categories").select("*");
  console.log("Anon Categories:", cat?.length, error);
}
main();
