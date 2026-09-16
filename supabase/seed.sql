-- supabase/seed.sql
-- Seed script for Family Adda Menu

INSERT INTO restaurants (id, name, slug, currency, timezone, is_accepting_orders)
VALUES ('00000000-0000-0000-0000-000000000001', 'Family Adda', 'family-adda', 'INR', 'Asia/Kolkata', true)
ON CONFLICT (id) DO NOTHING;


-- Category: FRESH SOUP
DO $$
DECLARE
  v_cat_id UUID := gen_random_uuid();
BEGIN
  INSERT INTO categories (id, restaurant_id, name, sort_order)
  VALUES (v_cat_id, '00000000-0000-0000-0000-000000000001', 'FRESH SOUP', 10);
  
  INSERT INTO menu_items (id, restaurant_id, category_id, name, price, availability, is_available, is_vegetarian, is_vegan, is_gluten_free, sort_order)
  VALUES
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Veg. Clear Soup', 140, 'available', true, true, false, false, 10),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Tomato Soup', 140, 'available', true, true, false, false, 20),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Sweet Corn Soup', 160, 'available', true, true, false, false, 30),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Hot & Sour Soup', 160, 'available', true, true, false, false, 40),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Manchow Soup', 180, 'available', true, true, false, false, 50),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Vegetable Noodles Soup', 160, 'available', true, true, false, false, 60),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Lemon Coriander Soup', 160, 'available', true, true, false, false, 70),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Cream of Mushroom Soup', 180, 'available', true, true, false, false, 80),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Cream of Vegetable Soup', 170, 'available', true, true, false, false, 90);
END $$;

-- Category: SALAD
DO $$
DECLARE
  v_cat_id UUID := gen_random_uuid();
BEGIN
  INSERT INTO categories (id, restaurant_id, name, sort_order)
  VALUES (v_cat_id, '00000000-0000-0000-0000-000000000001', 'SALAD', 20);
  
  INSERT INTO menu_items (id, restaurant_id, category_id, name, price, availability, is_available, is_vegetarian, is_vegan, is_gluten_free, sort_order)
  VALUES
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Onion Salad', 60, 'available', true, true, false, false, 10),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Green Salad', 70, 'available', true, true, false, false, 20),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Kachumber Salad', 70, 'available', true, true, false, false, 30);
END $$;

-- Category: STARTERS
DO $$
DECLARE
  v_cat_id UUID := gen_random_uuid();
BEGIN
  INSERT INTO categories (id, restaurant_id, name, sort_order)
  VALUES (v_cat_id, '00000000-0000-0000-0000-000000000001', 'STARTERS', 30);
  
  INSERT INTO menu_items (id, restaurant_id, category_id, name, price, availability, is_available, is_vegetarian, is_vegan, is_gluten_free, sort_order)
  VALUES
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Papad Roasted', 30, 'available', true, true, false, false, 10),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Papad Fried', 40, 'available', true, true, false, false, 20),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Masala Papad Roasted', 40, 'available', true, true, false, false, 30),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Masala Papad Fried', 50, 'available', true, true, false, false, 40),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Peanut Chaat', 110, 'available', true, true, false, false, 50),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Corn Chaat', 110, 'available', true, true, false, false, 60),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Onion Pakoda', 140, 'available', true, true, false, false, 70),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Veg. Pakoda', 140, 'available', true, true, false, false, 80),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Paneer Pakoda', 180, 'available', true, true, false, false, 90),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Kalali Pakoda', 180, 'available', true, true, false, false, 100),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Finger Chips', 130, 'available', true, true, false, false, 110),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Peri-Peri Finger Chips', 150, 'available', true, true, false, false, 120),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Crispy Honey Potato', 170, 'available', true, true, false, false, 130),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Chinese Bhel', 170, 'available', true, true, false, false, 140),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Crispy Veg.', 190, 'available', true, true, false, false, 150),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Crispy Corn', 180, 'available', true, true, false, false, 160),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Veg. Kothe', 170, 'available', true, true, false, false, 170),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Chilli Potato', 190, 'available', true, true, false, false, 180),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Soya Chilli', 200, 'available', true, true, false, false, 190),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Veg. Lollipop', 190, 'available', true, true, false, false, 200),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Salt n Pepper', 240, 'available', true, true, false, false, 210),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Mix Bhel', 270, 'available', true, true, false, false, 220),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Paneer Black Pepper', 270, 'available', true, true, false, false, 230),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Crispy Chilli Baby Corn', 270, 'available', true, true, false, false, 240),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Mushroom Chilli', 250, 'available', true, true, false, false, 250),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Mushroom Garlic', 250, 'available', true, true, false, false, 260),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Stir Fried Vegetables', 270, 'available', true, true, false, false, 270),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Schezwan Cheese Potato', 300, 'available', true, true, false, false, 280),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Cheese Balls in Hot Garlic Sauce', 280, 'available', true, true, false, false, 290);
END $$;

-- Category: CHINESE MAIN COURSE
DO $$
DECLARE
  v_cat_id UUID := gen_random_uuid();
BEGIN
  INSERT INTO categories (id, restaurant_id, name, sort_order)
  VALUES (v_cat_id, '00000000-0000-0000-0000-000000000001', 'CHINESE MAIN COURSE', 40);
  
  INSERT INTO menu_items (id, restaurant_id, category_id, name, price, availability, is_available, is_vegetarian, is_vegan, is_gluten_free, sort_order)
  VALUES
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Veg. Manchurian', 180, 'available', true, true, false, false, 10),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Chilli Manchurian', 190, 'available', true, true, false, false, 20),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Paneer Manchurian', 230, 'available', true, true, false, false, 30),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Chilli Paneer', 240, 'available', true, true, false, false, 40),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Paneer in Hot Garlic Sauce', 260, 'available', true, true, false, false, 50),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Paneer Schezwan', 260, 'available', true, true, false, false, 60),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Paneer Crispy', 240, 'available', true, true, false, false, 70),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Paneer 65', 270, 'available', true, true, false, false, 80),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Paneer Camlin', 370, 'available', true, true, false, false, 90),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Garlic Paneer', 260, 'available', true, true, false, false, 100),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Vegetable Sweet n Sour', 250, 'available', true, true, false, false, 110),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Chinese Platter', 360, 'available', true, true, false, false, 120);
END $$;

-- Category: NOODLES
DO $$
DECLARE
  v_cat_id UUID := gen_random_uuid();
BEGIN
  INSERT INTO categories (id, restaurant_id, name, sort_order)
  VALUES (v_cat_id, '00000000-0000-0000-0000-000000000001', 'NOODLES', 50);
  
  INSERT INTO menu_items (id, restaurant_id, category_id, name, price, availability, is_available, is_vegetarian, is_vegan, is_gluten_free, sort_order)
  VALUES
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Veg. Noodles / Veg. Chowmein', 180, 'available', true, true, false, false, 10),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Veg. Hakka Noodles', 180, 'available', true, true, false, false, 20),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Chatpata Noodles', 220, 'available', true, true, false, false, 30),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Chilli Garlic Noodles', 220, 'available', true, true, false, false, 40),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Burnt Garlic Noodles', 230, 'available', true, true, false, false, 50),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Schezwan Noodles', 230, 'available', true, true, false, false, 60),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Smoky Noodles', 220, 'available', true, true, false, false, 70),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Noodles with Manchurian Balls', 220, 'available', true, true, false, false, 80),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'American Chopsuey', 270, 'available', true, true, false, false, 90),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Noodles with Mushroom', 270, 'available', true, true, false, false, 100),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Malaysian Noodles', 280, 'available', true, true, false, false, 110),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Singapori Noodles', 280, 'available', true, true, false, false, 120);
END $$;

-- Category: MAGGI
DO $$
DECLARE
  v_cat_id UUID := gen_random_uuid();
BEGIN
  INSERT INTO categories (id, restaurant_id, name, sort_order)
  VALUES (v_cat_id, '00000000-0000-0000-0000-000000000001', 'MAGGI', 60);
  
  INSERT INTO menu_items (id, restaurant_id, category_id, name, price, availability, is_available, is_vegetarian, is_vegan, is_gluten_free, sort_order)
  VALUES
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Simple Maggi', 120, 'available', true, true, false, false, 10),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Chilli Garlic Maggi', 140, 'available', true, true, false, false, 20),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Maggi in Punjabi Tadka', 150, 'available', true, true, false, false, 30),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Cheese Maggi', 170, 'available', true, true, false, false, 40),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Schezwan Maggi', 160, 'available', true, true, false, false, 50),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Manchurian Maggi', 170, 'available', true, true, false, false, 60);
END $$;

-- Category: CHINESE RICE
DO $$
DECLARE
  v_cat_id UUID := gen_random_uuid();
BEGIN
  INSERT INTO categories (id, restaurant_id, name, sort_order)
  VALUES (v_cat_id, '00000000-0000-0000-0000-000000000001', 'CHINESE RICE', 70);
  
  INSERT INTO menu_items (id, restaurant_id, category_id, name, price, availability, is_available, is_vegetarian, is_vegan, is_gluten_free, sort_order)
  VALUES
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Veg. Fried Rice', 190, 'available', true, true, false, false, 10),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Schezwan Fried Rice', 220, 'available', true, true, false, false, 20),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Rice with Manchurian Balls', 230, 'available', true, true, false, false, 30),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Burnt Garlic Rice', 220, 'available', true, true, false, false, 40),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Mix Fried Rice', 270, 'available', true, true, false, false, 50),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Mushroom Fried Rice', 240, 'available', true, true, false, false, 60),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Triple Schezwan Fried Rice', 260, 'available', true, true, false, false, 70),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Paneer Fried Rice', 240, 'available', true, true, false, false, 80);
END $$;

-- Category: ROLLS
DO $$
DECLARE
  v_cat_id UUID := gen_random_uuid();
BEGIN
  INSERT INTO categories (id, restaurant_id, name, sort_order)
  VALUES (v_cat_id, '00000000-0000-0000-0000-000000000001', 'ROLLS', 80);
  
  INSERT INTO menu_items (id, restaurant_id, category_id, name, price, availability, is_available, is_vegetarian, is_vegan, is_gluten_free, sort_order)
  VALUES
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Veg. Spring Roll', 170, 'available', true, true, false, false, 10),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Spider Roll', 170, 'available', true, true, false, false, 20),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Paneer Mexican Roll', 300, 'available', true, true, false, false, 30);
END $$;

-- Category: MOMOS (8 PCS.)
DO $$
DECLARE
  v_cat_id UUID := gen_random_uuid();
BEGIN
  INSERT INTO categories (id, restaurant_id, name, sort_order)
  VALUES (v_cat_id, '00000000-0000-0000-0000-000000000001', 'MOMOS (8 PCS.)', 90);
  
  INSERT INTO menu_items (id, restaurant_id, category_id, name, price, availability, is_available, is_vegetarian, is_vegan, is_gluten_free, sort_order)
  VALUES
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Steamed Momos', 130, 'available', true, true, false, false, 10),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Fried Momos', 150, 'available', true, true, false, false, 20),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Cheese Corn Momos', 200, 'available', true, true, false, false, 30),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Paneer Momos', 180, 'available', true, true, false, false, 40);
END $$;

-- Category: PASTA
DO $$
DECLARE
  v_cat_id UUID := gen_random_uuid();
BEGIN
  INSERT INTO categories (id, restaurant_id, name, sort_order)
  VALUES (v_cat_id, '00000000-0000-0000-0000-000000000001', 'PASTA', 100);
  
  INSERT INTO menu_items (id, restaurant_id, category_id, name, price, availability, is_available, is_vegetarian, is_vegan, is_gluten_free, sort_order)
  VALUES
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Macaroni Hot n Pot', 220, 'available', true, true, false, false, 10),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Macaroni in Red Sauce', 260, 'available', true, true, false, false, 20),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Pasta in White / Red Sauce', 280, 'available', true, true, false, false, 30),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Vegetable in Pasta White Sauce', 330, 'available', true, true, false, false, 40),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Corn White Pasta', 350, 'available', true, true, false, false, 50),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Pasta Cheese Creamy Sauce', 320, 'available', true, true, false, false, 60),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Pink Pasta', 300, 'available', true, true, false, false, 70),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Mushroom Broccoli Pasta', 350, 'available', true, true, false, false, 80);
END $$;

-- Category: PANEER MAIN COURSE
DO $$
DECLARE
  v_cat_id UUID := gen_random_uuid();
BEGIN
  INSERT INTO categories (id, restaurant_id, name, sort_order)
  VALUES (v_cat_id, '00000000-0000-0000-0000-000000000001', 'PANEER MAIN COURSE', 110);
  
  INSERT INTO menu_items (id, restaurant_id, category_id, name, price, availability, is_available, is_vegetarian, is_vegan, is_gluten_free, sort_order)
  VALUES
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Butter Paneer Masala', 250, 'available', true, true, false, false, 10),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Mutter Paneer', 220, 'available', true, true, false, false, 20),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Kadhai Paneer', 250, 'available', true, true, false, false, 30),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Shahi Paneer', 280, 'available', true, true, false, false, 40),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Paneer Bhurji', 280, 'available', true, true, false, false, 50),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Palak Paneer', 250, 'available', true, true, false, false, 60),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Paneer Kolhapuri', 250, 'available', true, true, false, false, 70);
END $$;

-- Category: BEVERAGES
DO $$
DECLARE
  v_cat_id UUID := gen_random_uuid();
BEGIN
  INSERT INTO categories (id, restaurant_id, name, sort_order)
  VALUES (v_cat_id, '00000000-0000-0000-0000-000000000001', 'BEVERAGES', 120);
  
  INSERT INTO menu_items (id, restaurant_id, category_id, name, price, availability, is_available, is_vegetarian, is_vegan, is_gluten_free, sort_order)
  VALUES
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Hot Coffee', 50, 'available', true, true, false, false, 10),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Hot Coffee with Ginger', 60, 'available', true, true, false, false, 20),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Hot Chocolate', 70, 'available', true, true, false, false, 30),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Cold Coffee', 140, 'available', true, true, false, false, 40),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Cold Coffee with Ice Cream', 160, 'available', true, true, false, false, 50),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Kit Kat Shake', 180, 'available', true, true, false, false, 60),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Oreo Shake', 180, 'available', true, true, false, false, 70),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Butter Milk', 30, 'available', true, true, false, false, 80),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Fresh Lime Water', 30, 'available', true, true, false, false, 90),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Fresh Lime Soda', 40, 'available', true, true, false, false, 100);
END $$;

-- Category: CRISPY DOSA
DO $$
DECLARE
  v_cat_id UUID := gen_random_uuid();
BEGIN
  INSERT INTO categories (id, restaurant_id, name, sort_order)
  VALUES (v_cat_id, '00000000-0000-0000-0000-000000000001', 'CRISPY DOSA', 130);
  
  INSERT INTO menu_items (id, restaurant_id, category_id, name, price, availability, is_available, is_vegetarian, is_vegan, is_gluten_free, sort_order)
  VALUES
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Masala Dosa', 130, 'available', true, true, false, false, 10),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Sada Dosa', 100, 'available', true, true, false, false, 20),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Mysore Masala Dosa', 150, 'available', true, true, false, false, 30),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Mysore Sada Dosa', 120, 'available', true, true, false, false, 40),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Paneer Masala Dosa', 160, 'available', true, true, false, false, 50),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Paneer Punjabi Dosa', 170, 'available', true, true, false, false, 60),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Cheese Masala Dosa', 170, 'available', true, true, false, false, 70),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Cheese Sada Dosa', 150, 'available', true, true, false, false, 80),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Rawa Masala Dosa', 160, 'available', true, true, false, false, 90),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Rawa Onion Dosa', 150, 'available', true, true, false, false, 100),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Rawa Onion Masala Dosa', 170, 'available', true, true, false, false, 110),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Spring Masala Dosa', 160, 'available', true, true, false, false, 120),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Paper Masala Dosa', 180, 'available', true, true, false, false, 130),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Paper Sada Dosa', 160, 'available', true, true, false, false, 140);
END $$;

-- Category: SPONGY IDLI
DO $$
DECLARE
  v_cat_id UUID := gen_random_uuid();
BEGIN
  INSERT INTO categories (id, restaurant_id, name, sort_order)
  VALUES (v_cat_id, '00000000-0000-0000-0000-000000000001', 'SPONGY IDLI', 140);
  
  INSERT INTO menu_items (id, restaurant_id, category_id, name, price, availability, is_available, is_vegetarian, is_vegan, is_gluten_free, sort_order)
  VALUES
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Idli Sambar', 90, 'available', true, true, false, false, 10),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Masala Idli', 130, 'available', true, true, false, false, 20),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Fried Idli', 110, 'available', true, true, false, false, 30),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Vada Sambar', 140, 'available', true, true, false, false, 40),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Idli / Vada Combo', 120, 'available', true, true, false, false, 50);
END $$;

-- Category: FLUFFY UTHAPPAM
DO $$
DECLARE
  v_cat_id UUID := gen_random_uuid();
BEGIN
  INSERT INTO categories (id, restaurant_id, name, sort_order)
  VALUES (v_cat_id, '00000000-0000-0000-0000-000000000001', 'FLUFFY UTHAPPAM', 150);
  
  INSERT INTO menu_items (id, restaurant_id, category_id, name, price, availability, is_available, is_vegetarian, is_vegan, is_gluten_free, sort_order)
  VALUES
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Jeera Uthappam', 120, 'available', true, true, false, false, 10),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Onion Uthappam', 140, 'available', true, true, false, false, 20),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Tomato Uthappam', 140, 'available', true, true, false, false, 30),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Garlic Uthappam', 140, 'available', true, true, false, false, 40),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Jain Uthappam', 160, 'available', true, true, false, false, 50),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Mix Uthappam', 160, 'available', true, true, false, false, 60),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Masala Uthappam', 160, 'available', true, true, false, false, 70),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Paneer Uthappam', 170, 'available', true, true, false, false, 80),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Cheese Uthappam', 170, 'available', true, true, false, false, 90);
END $$;

-- Category: CHATPATI PAV BHAJI
DO $$
DECLARE
  v_cat_id UUID := gen_random_uuid();
BEGIN
  INSERT INTO categories (id, restaurant_id, name, sort_order)
  VALUES (v_cat_id, '00000000-0000-0000-0000-000000000001', 'CHATPATI PAV BHAJI', 160);
  
  INSERT INTO menu_items (id, restaurant_id, category_id, name, price, availability, is_available, is_vegetarian, is_vegan, is_gluten_free, sort_order)
  VALUES
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Pav Bhaji', 140, 'available', true, true, false, false, 10),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Paneer Pav Bhaji', 170, 'available', true, true, false, false, 20),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Cheese Pav Bhaji', 170, 'available', true, true, false, false, 30),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Jain Pav Bhaji', 170, 'available', true, true, false, false, 40),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Extra Pav', 20, 'available', true, true, false, false, 50);
END $$;

-- Category: CHHOLE BHATURE
DO $$
DECLARE
  v_cat_id UUID := gen_random_uuid();
BEGIN
  INSERT INTO categories (id, restaurant_id, name, sort_order)
  VALUES (v_cat_id, '00000000-0000-0000-0000-000000000001', 'CHHOLE BHATURE', 170);
  
  INSERT INTO menu_items (id, restaurant_id, category_id, name, price, availability, is_available, is_vegetarian, is_vegan, is_gluten_free, sort_order)
  VALUES
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Chhole Bhature', 150, 'available', true, true, false, false, 10),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Extra Bhatura', 30, 'available', true, true, false, false, 20);
END $$;

-- Category: VEG. MAIN COURSE
DO $$
DECLARE
  v_cat_id UUID := gen_random_uuid();
BEGIN
  INSERT INTO categories (id, restaurant_id, name, sort_order)
  VALUES (v_cat_id, '00000000-0000-0000-0000-000000000001', 'VEG. MAIN COURSE', 180);
  
  INSERT INTO menu_items (id, restaurant_id, category_id, name, price, availability, is_available, is_vegetarian, is_vegan, is_gluten_free, sort_order)
  VALUES
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Aloo Jeera', 140, 'available', true, true, false, false, 10),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Aloo Gobhi', 140, 'available', true, true, false, false, 20),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Aloo Mutter', 140, 'available', true, true, false, false, 30),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Aloo Palak', 140, 'available', true, true, false, false, 40),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Lahsuni Palak', 180, 'available', true, true, false, false, 50),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Bhindi masala', 180, 'available', true, true, false, false, 60),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Kadhai Veg', 200, 'available', true, true, false, false, 70),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Veg. Kolhapuri', 200, 'available', true, true, false, false, 80),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Mix Veg.', 200, 'available', true, true, false, false, 90),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Sev Tamatar', 180, 'available', true, true, false, false, 100),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Chana Masala', 220, 'available', true, true, false, false, 110),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Rajma Masala', 220, 'available', true, true, false, false, 120),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Methi Mutter Malai', 280, 'available', true, true, false, false, 130),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Kaju Curry', 280, 'available', true, true, false, false, 140),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Malai Kofta', 280, 'available', true, true, false, false, 150),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Navratna Korma', 280, 'available', true, true, false, false, 160);
END $$;

-- Category: DAL
DO $$
DECLARE
  v_cat_id UUID := gen_random_uuid();
BEGIN
  INSERT INTO categories (id, restaurant_id, name, sort_order)
  VALUES (v_cat_id, '00000000-0000-0000-0000-000000000001', 'DAL', 190);
  
  INSERT INTO menu_items (id, restaurant_id, category_id, name, price, availability, is_available, is_vegetarian, is_vegan, is_gluten_free, sort_order)
  VALUES
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Butter Dal Fry', 180, 'available', true, true, false, false, 10),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Dal Fry', 150, 'available', true, true, false, false, 20),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Green Chilli Dal Fry', 150, 'available', true, true, false, false, 30),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Dal Tadka', 170, 'available', true, true, false, false, 40),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Dal Makhani', 220, 'available', true, true, false, false, 50);
END $$;

-- Category: RICE
DO $$
DECLARE
  v_cat_id UUID := gen_random_uuid();
BEGIN
  INSERT INTO categories (id, restaurant_id, name, sort_order)
  VALUES (v_cat_id, '00000000-0000-0000-0000-000000000001', 'RICE', 200);
  
  INSERT INTO menu_items (id, restaurant_id, category_id, name, price, availability, is_available, is_vegetarian, is_vegan, is_gluten_free, sort_order)
  VALUES
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Steam Rice', 130, 'available', true, true, false, false, 10),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Jeera Rice', 150, 'available', true, true, false, false, 20),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Curd Rice', 170, 'available', true, true, false, false, 30),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Butter Khichdi', 220, 'available', true, true, false, false, 40),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Veg. Pulao', 150, 'available', true, true, false, false, 50),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Paneer Pulao', 170, 'available', true, true, false, false, 60),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Cheese Pulao', 170, 'available', true, true, false, false, 70);
END $$;

-- Category: RAITA
DO $$
DECLARE
  v_cat_id UUID := gen_random_uuid();
BEGIN
  INSERT INTO categories (id, restaurant_id, name, sort_order)
  VALUES (v_cat_id, '00000000-0000-0000-0000-000000000001', 'RAITA', 210);
  
  INSERT INTO menu_items (id, restaurant_id, category_id, name, price, availability, is_available, is_vegetarian, is_vegan, is_gluten_free, sort_order)
  VALUES
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Plain Curd', 80, 'available', true, true, false, false, 10),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Boondi Raita', 110, 'available', true, true, false, false, 20),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Mix Veg. Raita', 130, 'available', true, true, false, false, 30),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Pineapple Raita', 150, 'available', true, true, false, false, 40);
END $$;

-- Category: ROTI & PARATHA
DO $$
DECLARE
  v_cat_id UUID := gen_random_uuid();
BEGIN
  INSERT INTO categories (id, restaurant_id, name, sort_order)
  VALUES (v_cat_id, '00000000-0000-0000-0000-000000000001', 'ROTI & PARATHA', 220);
  
  INSERT INTO menu_items (id, restaurant_id, category_id, name, price, availability, is_available, is_vegetarian, is_vegan, is_gluten_free, sort_order)
  VALUES
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Tawa Roti', 10, 'available', true, true, false, false, 10),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Butter Roti', 15, 'available', true, true, false, false, 20),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Plain Paratha', 25, 'available', true, true, false, false, 30),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Butter Paratha', 35, 'available', true, true, false, false, 40),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Aloo/Methi/Pyaz Paratha', 50, 'available', true, true, false, false, 50),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Paneer Paratha', 80, 'available', true, true, false, false, 60);
END $$;

-- Category: MINI MEALS
DO $$
DECLARE
  v_cat_id UUID := gen_random_uuid();
BEGIN
  INSERT INTO categories (id, restaurant_id, name, sort_order)
  VALUES (v_cat_id, '00000000-0000-0000-0000-000000000001', 'MINI MEALS', 230);
  
  INSERT INTO menu_items (id, restaurant_id, category_id, name, price, availability, is_available, is_vegetarian, is_vegan, is_gluten_free, sort_order)
  VALUES
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Rajma Chawal', 140, 'available', true, true, false, false, 10),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Chhole Chawal', 140, 'available', true, true, false, false, 20),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Dal Makhani + Jeera Rice', 180, 'available', true, true, false, false, 30),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Paneer Butter Masala + 2 Tawa Paratha', 180, 'available', true, true, false, false, 40),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Rice with Manchurian Gravy', 290, 'available', true, true, false, false, 50),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Rice with Chilli Paneer Gravy', 310, 'available', true, true, false, false, 60),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Veg. Noodles with Manchurian Gravy', 290, 'available', true, true, false, false, 70),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Smoky Noodles with Chilli Paneer Gravy', 330, 'available', true, true, false, false, 80);
END $$;

-- Category: SWEETS
DO $$
DECLARE
  v_cat_id UUID := gen_random_uuid();
BEGIN
  INSERT INTO categories (id, restaurant_id, name, sort_order)
  VALUES (v_cat_id, '00000000-0000-0000-0000-000000000001', 'SWEETS', 240);
  
  INSERT INTO menu_items (id, restaurant_id, category_id, name, price, availability, is_available, is_vegetarian, is_vegan, is_gluten_free, sort_order)
  VALUES
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Rasgulla (02 Pieces)', 55, 'available', true, true, false, false, 10),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Gulab Jamun (02 Pieces)', 55, 'available', true, true, false, false, 20),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Shrikhand (100 gm.)', 55, 'available', true, true, false, false, 30),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Moong Ka Halwa (100 gm.)', 65, 'available', true, true, false, false, 40);
END $$;

-- Category: HOME MADE MOONG KA HALWA (SEASONAL)
DO $$
DECLARE
  v_cat_id UUID := gen_random_uuid();
BEGIN
  INSERT INTO categories (id, restaurant_id, name, sort_order)
  VALUES (v_cat_id, '00000000-0000-0000-0000-000000000001', 'HOME MADE MOONG KA HALWA (SEASONAL)', 250);
  
  INSERT INTO menu_items (id, restaurant_id, category_id, name, price, availability, is_available, is_vegetarian, is_vegan, is_gluten_free, sort_order)
  VALUES
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, '250 gm.', 160, 'available', true, true, false, false, 10),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, '500 gm.', 320, 'available', true, true, false, false, 20),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, '1 kg.', 640, 'available', true, true, false, false, 30);
END $$;

-- Category: HOME MADE SHRIKHAND
DO $$
DECLARE
  v_cat_id UUID := gen_random_uuid();
BEGIN
  INSERT INTO categories (id, restaurant_id, name, sort_order)
  VALUES (v_cat_id, '00000000-0000-0000-0000-000000000001', 'HOME MADE SHRIKHAND', 260);
  
  INSERT INTO menu_items (id, restaurant_id, category_id, name, price, availability, is_available, is_vegetarian, is_vegan, is_gluten_free, sort_order)
  VALUES
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, '250 gm.', 135, 'available', true, true, false, false, 10),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, '500 gm.', 270, 'available', true, true, false, false, 20),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, '1 kg.', 540, 'available', true, true, false, false, 30);
END $$;

-- Category: MEALS
DO $$
DECLARE
  v_cat_id UUID := gen_random_uuid();
BEGIN
  INSERT INTO categories (id, restaurant_id, name, sort_order)
  VALUES (v_cat_id, '00000000-0000-0000-0000-000000000001', 'MEALS', 270);
  
  INSERT INTO menu_items (id, restaurant_id, category_id, name, price, availability, is_available, is_vegetarian, is_vegan, is_gluten_free, sort_order)
  VALUES
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Monthly (56 Meal)', 3800, 'available', true, true, false, false, 10),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Monthly (28 Meal)', 2400, 'available', true, true, false, false, 20),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Single Meal Week days', 120, 'available', true, true, false, false, 30),
    (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', v_cat_id, 'Single Meal Sunday', 150, 'available', true, true, false, false, 40);
END $$;
