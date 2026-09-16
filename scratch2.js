const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const supabase = createClient(
  "https://syuxyauriptobnptkxca.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5dXh5YXVyaXB0b2JucHRreGNhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODQ1MDQxNSwiZXhwIjoyMTA0MDI2NDE1fQ.gKcqps_ogipDhR-zTRWGgzn3ZqN6oX99bgXvZ7sAUns"
);

async function main() {
  const { data, error } = await supabase.from('staff').select('*');
  if (error) console.error(error);
  
  const hash = bcrypt.hashSync('1234', 10);
  for (const st of data) {
    const { error: updErr } = await supabase.from('staff').update({ pin_hash: hash }).eq('id', st.id);
    if (updErr) console.error('Error updating:', updErr);
    else console.log('Updated staff', st.name, 'with new pin 1234');
  }
}
main();
