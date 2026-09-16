const fs = require('fs');

const menuData = {
  "FRESH SOUP": [
    ["Veg. Clear Soup", 140.0], ["Tomato Soup", 140.0], ["Sweet Corn Soup", 160.0], ["Hot & Sour Soup", 160.0], ["Manchow Soup", 180.0], ["Vegetable Noodles Soup", 160.0], ["Lemon Coriander Soup", 160.0], ["Cream of Mushroom Soup", 180.0], ["Cream of Vegetable Soup", 170.0]
  ],
  "SALAD": [
    ["Onion Salad", 60.0], ["Green Salad", 70.0], ["Kachumber Salad", 70.0]
  ],
  "STARTERS": [
    ["Papad Roasted", 30.0], ["Papad Fried", 40.0], ["Masala Papad Roasted", 40.0], ["Masala Papad Fried", 50.0], ["Peanut Chaat", 110.0], ["Corn Chaat", 110.0], ["Onion Pakoda", 140.0], ["Veg. Pakoda", 140.0], ["Paneer Pakoda", 180.0], ["Kalali Pakoda", 180.0], ["Finger Chips", 130.0], ["Peri-Peri Finger Chips", 150.0], ["Crispy Honey Potato", 170.0], ["Chinese Bhel", 170.0], ["Crispy Veg.", 190.0], ["Crispy Corn", 180.0], ["Veg. Kothe", 170.0], ["Chilli Potato", 190.0], ["Soya Chilli", 200.0], ["Veg. Lollipop", 190.0], ["Salt n Pepper", 240.0], ["Mix Bhel", 270.0], ["Paneer Black Pepper", 270.0], ["Crispy Chilli Baby Corn", 270.0], ["Mushroom Chilli", 250.0], ["Mushroom Garlic", 250.0], ["Stir Fried Vegetables", 270.0], ["Schezwan Cheese Potato", 300.0], ["Cheese Balls in Hot Garlic Sauce", 280.0]
  ],
  "CHINESE MAIN COURSE": [
    ["Veg. Manchurian", 180.0], ["Chilli Manchurian", 190.0], ["Paneer Manchurian", 230.0], ["Chilli Paneer", 240.0], ["Paneer in Hot Garlic Sauce", 260.0], ["Paneer Schezwan", 260.0], ["Paneer Crispy", 240.0], ["Paneer 65", 270.0], ["Paneer Camlin", 370.0], ["Garlic Paneer", 260.0], ["Vegetable Sweet n Sour", 250.0], ["Chinese Platter", 360.0]
  ],
  "NOODLES": [
    ["Veg. Noodles / Veg. Chowmein", 180.0], ["Veg. Hakka Noodles", 180.0], ["Chatpata Noodles", 220.0], ["Chilli Garlic Noodles", 220.0], ["Burnt Garlic Noodles", 230.0], ["Schezwan Noodles", 230.0], ["Smoky Noodles", 220.0], ["Noodles with Manchurian Balls", 220.0], ["American Chopsuey", 270.0], ["Noodles with Mushroom", 270.0], ["Malaysian Noodles", 280.0], ["Singapori Noodles", 280.0]
  ],
  "MAGGI": [
    ["Simple Maggi", 120.0], ["Chilli Garlic Maggi", 140.0], ["Maggi in Punjabi Tadka", 150.0], ["Cheese Maggi", 170.0], ["Schezwan Maggi", 160.0], ["Manchurian Maggi", 170.0]
  ],
  "CHINESE RICE": [
    ["Veg. Fried Rice", 190.0], ["Schezwan Fried Rice", 220.0], ["Rice with Manchurian Balls", 230.0], ["Burnt Garlic Rice", 220.0], ["Mix Fried Rice", 270.0], ["Mushroom Fried Rice", 240.0], ["Triple Schezwan Fried Rice", 260.0], ["Paneer Fried Rice", 240.0]
  ],
  "ROLLS": [
    ["Veg. Spring Roll", 170.0], ["Spider Roll", 170.0], ["Paneer Mexican Roll", 300.0]
  ],
  "MOMOS (8 PCS.)": [
    ["Steamed Momos", 130.0], ["Fried Momos", 150.0], ["Cheese Corn Momos", 200.0], ["Paneer Momos", 180.0]
  ],
  "PASTA": [
    ["Macaroni Hot n Pot", 220.0], ["Macaroni in Red Sauce", 260.0], ["Pasta in White / Red Sauce", 280.0], ["Vegetable in Pasta White Sauce", 330.0], ["Corn White Pasta", 350.0], ["Pasta Cheese Creamy Sauce", 320.0], ["Pink Pasta", 300.0], ["Mushroom Broccoli Pasta", 350.0]
  ],
  "PANEER MAIN COURSE": [
    ["Butter Paneer Masala", 250.0], ["Mutter Paneer", 220.0], ["Kadhai Paneer", 250.0], ["Shahi Paneer", 280.0], ["Paneer Bhurji", 280.0], ["Palak Paneer", 250.0], ["Paneer Kolhapuri", 250.0]
  ],
  "BEVERAGES": [
    ["Hot Coffee", 50.0], ["Hot Coffee with Ginger", 60.0], ["Hot Chocolate", 70.0], ["Cold Coffee", 140.0], ["Cold Coffee with Ice Cream", 160.0], ["Kit Kat Shake", 180.0], ["Oreo Shake", 180.0], ["Butter Milk", 30.0], ["Fresh Lime Water", 30.0], ["Fresh Lime Soda", 40.0]
  ],
  "CRISPY DOSA": [
    ["Masala Dosa", 130.0], ["Sada Dosa", 100.0], ["Mysore Masala Dosa", 150.0], ["Mysore Sada Dosa", 120.0], ["Paneer Masala Dosa", 160.0], ["Paneer Punjabi Dosa", 170.0], ["Cheese Masala Dosa", 170.0], ["Cheese Sada Dosa", 150.0], ["Rawa Masala Dosa", 160.0], ["Rawa Onion Dosa", 150.0], ["Rawa Onion Masala Dosa", 170.0], ["Spring Masala Dosa", 160.0], ["Paper Masala Dosa", 180.0], ["Paper Sada Dosa", 160.0]
  ],
  "SPONGY IDLI": [
    ["Idli Sambar", 90.0], ["Masala Idli", 130.0], ["Fried Idli", 110.0], ["Vada Sambar", 140.0], ["Idli / Vada Combo", 120.0]
  ],
  "FLUFFY UTHAPPAM": [
    ["Jeera Uthappam", 120.0], ["Onion Uthappam", 140.0], ["Tomato Uthappam", 140.0], ["Garlic Uthappam", 140.0], ["Jain Uthappam", 160.0], ["Mix Uthappam", 160.0], ["Masala Uthappam", 160.0], ["Paneer Uthappam", 170.0], ["Cheese Uthappam", 170.0]
  ],
  "CHATPATI PAV BHAJI": [
    ["Pav Bhaji", 140.0], ["Paneer Pav Bhaji", 170.0], ["Cheese Pav Bhaji", 170.0], ["Jain Pav Bhaji", 170.0], ["Extra Pav", 20.0]
  ],
  "CHHOLE BHATURE": [
    ["Chhole Bhature", 150.0], ["Extra Bhatura", 30.0]
  ],
  "VEG. MAIN COURSE": [
    ["Aloo Jeera", 140.0], ["Aloo Gobhi", 140.0], ["Aloo Mutter", 140.0], ["Aloo Palak", 140.0], ["Lahsuni Palak", 180.0], ["Bhindi masala", 180.0], ["Kadhai Veg", 200.0], ["Veg. Kolhapuri", 200.0], ["Mix Veg.", 200.0], ["Sev Tamatar", 180.0], ["Chana Masala", 220.0], ["Rajma Masala", 220.0], ["Methi Mutter Malai", 280.0], ["Kaju Curry", 280.0], ["Malai Kofta", 280.0], ["Navratna Korma", 280.0]
  ],
  "DAL": [
    ["Butter Dal Fry", 180.0], ["Dal Fry", 150.0], ["Green Chilli Dal Fry", 150.0], ["Dal Tadka", 170.0], ["Dal Makhani", 220.0]
  ],
  "RICE": [
    ["Steam Rice", 130.0], ["Jeera Rice", 150.0], ["Curd Rice", 170.0], ["Butter Khichdi", 220.0], ["Veg. Pulao", 150.0], ["Paneer Pulao", 170.0], ["Cheese Pulao", 170.0]
  ],
  "RAITA": [
    ["Plain Curd", 80.0], ["Boondi Raita", 110.0], ["Mix Veg. Raita", 130.0], ["Pineapple Raita", 150.0]
  ],
  "ROTI & PARATHA": [
    ["Tawa Roti", 10.0], ["Butter Roti", 15.0], ["Plain Paratha", 25.0], ["Butter Paratha", 35.0], ["Aloo/Methi/Pyaz Paratha", 50.0], ["Paneer Paratha", 80.0]
  ],
  "MINI MEALS": [
    ["Rajma Chawal", 140.0], ["Chhole Chawal", 140.0], ["Dal Makhani + Jeera Rice", 180.0], ["Paneer Butter Masala + 2 Tawa Paratha", 180.0], ["Rice with Manchurian Gravy", 290.0], ["Rice with Chilli Paneer Gravy", 310.0], ["Veg. Noodles with Manchurian Gravy", 290.0], ["Smoky Noodles with Chilli Paneer Gravy", 330.0]
  ],
  "SWEETS": [
    ["Rasgulla (02 Pieces)", 55.0], ["Gulab Jamun (02 Pieces)", 55.0], ["Shrikhand (100 gm.)", 55.0], ["Moong Ka Halwa (100 gm.)", 65.0]
  ],
  "HOME MADE MOONG KA HALWA (SEASONAL)": [
    ["250 gm.", 160.0], ["500 gm.", 320.0], ["1 kg.", 640.0]
  ],
  "HOME MADE SHRIKHAND": [
    ["250 gm.", 135.0], ["500 gm.", 270.0], ["1 kg.", 540.0]
  ],
  "MEALS": [
    ["Monthly (56 Meal)", 3800.0], ["Monthly (28 Meal)", 2400.0], ["Single Meal Week days", 120.0], ["Single Meal Sunday", 150.0]
  ]
};

const restaurantId = "00000000-0000-0000-0000-000000000001";
let sql = `-- supabase/seed.sql
-- Seed script for Family Adda Menu

INSERT INTO restaurants (id, name, slug, currency, timezone, is_accepting_orders)
VALUES ('${restaurantId}', 'Family Adda', 'family-adda', 'INR', 'Asia/Kolkata', true)
ON CONFLICT (id) DO NOTHING;

`;

let catSort = 10;
for (const [catName, items] of Object.entries(menuData)) {
  sql += `\n-- Category: ${catName}\n`;
  sql += `DO $$
DECLARE
  v_cat_id UUID := gen_random_uuid();
BEGIN
  INSERT INTO categories (id, restaurant_id, name, sort_order)
  VALUES (v_cat_id, '${restaurantId}', '${catName.replace(/'/g, "''")}', ${catSort});
  
  INSERT INTO menu_items (id, restaurant_id, category_id, name, price, availability, is_available, is_vegetarian, is_vegan, is_gluten_free, sort_order)
  VALUES\n`;
  
  const itemValues = items.map((item, idx) => {
    return `    (gen_random_uuid(), '${restaurantId}', v_cat_id, '${item[0].replace(/'/g, "''")}', ${item[1]}, 'available', true, true, false, false, ${(idx + 1) * 10})`;
  });
  
  sql += itemValues.join(",\n") + ";\nEND $$;\n";
  catSort += 10;
}

fs.writeFileSync('supabase/seed.sql', sql);
console.log("seed.sql generated!");
