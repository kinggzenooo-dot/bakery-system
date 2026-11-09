import json
from datetime import datetime
from sqlalchemy.orm import Session
from app import models
from app.auth import get_password_hash

CATEGORIES_DATA = [
    {
        "id": "cakes",
        "name": "Artisanal Cakes",
        "description": "Celebration, layered, and chiffon cakes hand-crafted with European butter.",
        "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": "breads",
        "name": "Artisan Breads",
        "description": "Naturally fermented sourdoughs and rustic crusty hearth loaves.",
        "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": "pastries",
        "name": "Viennoiserie & Pastries",
        "description": "Flaky Normandy butter croissants, danishes, and savoury turnovers.",
        "image": "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": "cookies",
        "name": "Cookies & Confections",
        "description": "Gooey chocolate chunk cookies, financiers, and French macarons.",
        "image": "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": "specialty",
        "name": "Specialty & Filipino",
        "description": "Classic Filipino bakery staples elevated with premium local ingredients.",
        "image": "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80"
    }
]

PRODUCTS_30 = [
    # 1. Artisanal Cakes (6 items)
    {
        "id": "cake-01",
        "name": "Classic Belgian Dark Chocolate Cake",
        "category_id": "cakes",
        "price": 1250.0,
        "cost_price": 550.0,
        "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
        "description": "Three dense layers of moist dark cocoa sponge layered with 70% Belgian chocolate ganache.",
        "short_description": "Rich 70% dark chocolate multi-layer cake",
        "allergens_json": '["Dairy", "Gluten", "Eggs"]',
        "badge": "Bestseller",
        "is_featured": True,
        "rating": 4.9,
        "stock_quantity": 40,
        "in_stock": True,
        "sizes_json": '[{"name": "6-inch (Feeds 6-8)", "priceDelta": 0}, {"name": "8-inch (Feeds 12-16)", "priceDelta": 450}]'
    },
    {
        "id": "cake-02",
        "name": "Bohol Ube Halaya Velvet Cake",
        "category_id": "cakes",
        "price": 1150.0,
        "cost_price": 480.0,
        "image": "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=800&q=80",
        "description": "Authentic purple yam chiffon filled with slow-cooked Bohol ube halaya and fresh whipped cream.",
        "short_description": "Pure Bohol ube chiffon with halaya cream",
        "allergens_json": '["Dairy", "Gluten", "Eggs"]',
        "badge": "Signature",
        "is_featured": True,
        "rating": 5.0,
        "stock_quantity": 35,
        "in_stock": True,
        "sizes_json": '[{"name": "6-inch", "priceDelta": 0}, {"name": "8-inch", "priceDelta": 400}]'
    },
    {
        "id": "cake-03",
        "name": "Red Velvet Swirl Cheesecake",
        "category_id": "cakes",
        "price": 1350.0,
        "cost_price": 600.0,
        "image": "https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?auto=format&fit=crop&w=800&q=80",
        "description": "Velvety crimson cocoa cake swirled with baked New York cream cheese and mascarpone frosting.",
        "short_description": "Red velvet sponge with baked NY cheesecake layer",
        "allergens_json": '["Dairy", "Gluten", "Eggs"]',
        "badge": "Popular",
        "is_featured": True,
        "rating": 4.8,
        "stock_quantity": 30,
        "in_stock": True,
        "sizes_json": '[{"name": "6-inch", "priceDelta": 0}, {"name": "8-inch", "priceDelta": 500}]'
    },
    {
        "id": "cake-04",
        "name": "Guimaras Mango Tres Leches Cake",
        "category_id": "cakes",
        "price": 1050.0,
        "cost_price": 450.0,
        "image": "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80",
        "description": "Light sponge cake steeped in evaporated milk, condensed milk, and heavy cream, topped with sweet Guimaras mango roses.",
        "short_description": "Triple-milk soaked sponge with fresh mangoes",
        "allergens_json": '["Dairy", "Gluten", "Eggs"]',
        "badge": "Seasonal",
        "is_featured": False,
        "rating": 4.9,
        "stock_quantity": 25,
        "in_stock": True,
        "sizes_json": '[{"name": "8x8 Square", "priceDelta": 0}]'
    },
    {
        "id": "cake-05",
        "name": "San Sebastian Burnt Basque Cheesecake",
        "category_id": "cakes",
        "price": 1200.0,
        "cost_price": 520.0,
        "image": "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80",
        "description": "Rustic caramelized crust with a custardy, oozing molten center made from premium French cream cheese.",
        "short_description": "Caramelized crust with gooey molten center",
        "allergens_json": '["Dairy", "Eggs"]',
        "badge": "Chef Choice",
        "is_featured": True,
        "rating": 5.0,
        "stock_quantity": 20,
        "in_stock": True,
        "sizes_json": '[{"name": "7-inch", "priceDelta": 0}]'
    },
    {
        "id": "cake-06",
        "name": "Spiced Carrot Walnut Cream Cake",
        "category_id": "cakes",
        "price": 980.0,
        "cost_price": 390.0,
        "image": "https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=800&q=80",
        "description": "Shredded organic carrots with cinnamon, nutmeg, toasted walnuts, and tangy whipped cream cheese.",
        "short_description": "Hearty spiced carrot cake with toasted walnuts",
        "allergens_json": '["Dairy", "Gluten", "Eggs", "Nuts"]',
        "badge": "",
        "is_featured": False,
        "rating": 4.7,
        "stock_quantity": 25,
        "in_stock": True,
        "sizes_json": '[{"name": "6-inch", "priceDelta": 0}]'
    },

    # 2. Artisan Breads (6 items)
    {
        "id": "bread-01",
        "name": "Rustic San Francisco Country Sourdough",
        "category_id": "breads",
        "price": 220.0,
        "cost_price": 75.0,
        "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
        "description": "Naturally leavened with wild yeast, cold fermented for 36 hours for maximum flavor and open aerated crumb.",
        "short_description": "Wild fermented 36-hr artisanal hearth loaf",
        "allergens_json": '["Gluten"]',
        "badge": "Organic",
        "is_featured": True,
        "rating": 4.9,
        "stock_quantity": 50,
        "in_stock": True,
        "sizes_json": '[{"name": "Whole Loaf (850g)", "priceDelta": 0}, {"name": "Sliced", "priceDelta": 0}]'
    },
    {
        "id": "bread-02",
        "name": "Crispy French Traditional Baguette",
        "category_id": "breads",
        "price": 120.0,
        "cost_price": 38.0,
        "image": "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=800&q=80",
        "description": "Classic long French loaf baked in stone hearth ovens for a shatteringly crisp crust and chewy honeycomb interior.",
        "short_description": "Authentic stone-baked French baguette",
        "allergens_json": '["Gluten"]',
        "badge": "Daily Baked",
        "is_featured": False,
        "rating": 4.8,
        "stock_quantity": 60,
        "in_stock": True,
        "sizes_json": '[{"name": "Standard (300g)", "priceDelta": 0}]'
    },
    {
        "id": "bread-03",
        "name": "Japanese Hokkaido Shokupan Milk Bread",
        "category_id": "breads",
        "price": 180.0,
        "cost_price": 60.0,
        "image": "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=800&q=80",
        "description": "Feather-light, cloud-soft loaf crafted using the Japanese Yudane scald method with fresh whole milk.",
        "short_description": "Ultra-soft, sweet Japanese milk loaf",
        "allergens_json": '["Dairy", "Gluten"]',
        "badge": "Must Try",
        "is_featured": True,
        "rating": 5.0,
        "stock_quantity": 45,
        "in_stock": True,
        "sizes_json": '[{"name": "Thick Sliced", "priceDelta": 0}, {"name": "Uncut Loaf", "priceDelta": 0}]'
    },
    {
        "id": "bread-04",
        "name": "Rosemary & Sea Salt Olive Oil Focaccia",
        "category_id": "breads",
        "price": 190.0,
        "cost_price": 65.0,
        "image": "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=800&q=80",
        "description": "Deeply dimpled Ligurian style focaccia soaked in Spanish extra virgin olive oil, fresh rosemary sprigs, and Maldon sea salt.",
        "short_description": "Olive oil focaccia with fresh rosemary",
        "allergens_json": '["Gluten"]',
        "badge": "",
        "is_featured": False,
        "rating": 4.7,
        "stock_quantity": 30,
        "in_stock": True,
        "sizes_json": '[{"name": "Slab (400g)", "priceDelta": 0}]'
    },
    {
        "id": "bread-05",
        "name": "Rustic Seeded Whole Wheat Multi-Grain",
        "category_id": "breads",
        "price": 240.0,
        "cost_price": 85.0,
        "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
        "description": "100% stoneground whole wheat enriched with toasted pumpkin seeds, sunflower seeds, golden flax, and oats.",
        "short_description": "100% whole grain loaf with toasted seeds",
        "allergens_json": '["Gluten", "Seeds"]',
        "badge": "Healthy",
        "is_featured": False,
        "rating": 4.8,
        "stock_quantity": 35,
        "in_stock": True,
        "sizes_json": '[{"name": "Whole (750g)", "priceDelta": 0}]'
    },
    {
        "id": "bread-06",
        "name": "French Normandy Brioche Nanterre",
        "category_id": "breads",
        "price": 210.0,
        "cost_price": 80.0,
        "image": "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=800&q=80",
        "description": "Buttery, golden braided brioche enriched with free-range eggs and 82% Normandy European churned butter.",
        "short_description": "Golden butter brioche loaf",
        "allergens_json": '["Dairy", "Gluten", "Eggs"]',
        "badge": "",
        "is_featured": False,
        "rating": 4.9,
        "stock_quantity": 40,
        "in_stock": True,
        "sizes_json": '[{"name": "Standard (450g)", "priceDelta": 0}]'
    },

    # 3. Viennoiserie & Pastries (6 items)
    {
        "id": "pastry-01",
        "name": "Pure Butter Normandy Croissant",
        "category_id": "pastries",
        "price": 95.0,
        "cost_price": 32.0,
        "image": "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80",
        "description": "27 laminated layers of golden butter pastry, baked fresh for maximum crunch and airy honeycomb interior.",
        "short_description": "Hand-laminated 27-layer butter croissant",
        "allergens_json": '["Dairy", "Gluten", "Eggs"]',
        "badge": "Bestseller",
        "is_featured": True,
        "rating": 5.0,
        "stock_quantity": 80,
        "in_stock": True,
        "sizes_json": '[{"name": "Piece", "priceDelta": 0}]'
    },
    {
        "id": "pastry-02",
        "name": "Pain au Chocolat (Chocolate Croissant)",
        "category_id": "pastries",
        "price": 115.0,
        "cost_price": 42.0,
        "image": "https://images.unsplash.com/photo-1530610476181-d83430b64dcd?auto=format&fit=crop&w=800&q=80",
        "description": "Crisp buttery layers wrapping two dark Valrhona 55% chocolate batons that melt gently on the tongue.",
        "short_description": "Flaky pastry wrapped around twin chocolate batons",
        "allergens_json": '["Dairy", "Gluten", "Eggs"]',
        "badge": "Favorite",
        "is_featured": True,
        "rating": 4.9,
        "stock_quantity": 70,
        "in_stock": True,
        "sizes_json": '[{"name": "Piece", "priceDelta": 0}]'
    },
    {
        "id": "pastry-03",
        "name": "Twice-Baked Almond Frangipane Croissant",
        "category_id": "pastries",
        "price": 145.0,
        "cost_price": 55.0,
        "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
        "description": "Dipped in vanilla syrup, stuffed with luscious almond cream, rebaked, and showered with toasted flaked almonds.",
        "short_description": "Filled with almond frangipane and flaked almonds",
        "allergens_json": '["Dairy", "Gluten", "Eggs", "Nuts"]',
        "badge": "Decadent",
        "is_featured": False,
        "rating": 4.9,
        "stock_quantity": 50,
        "in_stock": True,
        "sizes_json": '[{"name": "Piece", "priceDelta": 0}]'
    },
    {
        "id": "pastry-04",
        "name": "Portuguese Pastel de Nata (Custard Tart)",
        "category_id": "pastries",
        "price": 85.0,
        "cost_price": 28.0,
        "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
        "description": "Spiral laminated pastry cup with caramelized egg yolk custard and a dusting of Sri Lankan cinnamon.",
        "short_description": "Crispy caramelized egg custard tart",
        "allergens_json": '["Dairy", "Gluten", "Eggs"]',
        "badge": "",
        "is_featured": False,
        "rating": 4.8,
        "stock_quantity": 60,
        "in_stock": True,
        "sizes_json": '[{"name": "Piece", "priceDelta": 0}]'
    },
    {
        "id": "pastry-05",
        "name": "Wild Berry Vanilla Cream Danish",
        "category_id": "pastries",
        "price": 125.0,
        "cost_price": 45.0,
        "image": "https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=800&q=80",
        "description": "Square Danish pastry filled with Madagascar vanilla bean creme patissiere, raspberries, and wild blueberries.",
        "short_description": "Flaky Danish topped with berries and pastry cream",
        "allergens_json": '["Dairy", "Gluten", "Eggs"]',
        "badge": "",
        "is_featured": False,
        "rating": 4.7,
        "stock_quantity": 40,
        "in_stock": True,
        "sizes_json": '[{"name": "Piece", "priceDelta": 0}]'
    },
    {
        "id": "pastry-06",
        "name": "Caramelized Kouign-Amann Breton Pastry",
        "category_id": "pastries",
        "price": 130.0,
        "cost_price": 48.0,
        "image": "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80",
        "description": "Traditional Breton butter cake made with salted butter dough, baked slow until the sugar crystallizes into amber crust.",
        "short_description": "Caramelized Breton salted butter pastry",
        "allergens_json": '["Dairy", "Gluten"]',
        "badge": "Artisan",
        "is_featured": False,
        "rating": 4.9,
        "stock_quantity": 35,
        "in_stock": True,
        "sizes_json": '[{"name": "Piece", "priceDelta": 0}]'
    },

    # 4. Cookies & Confections (6 items)
    {
        "id": "cookie-01",
        "name": "NYC Chunky Semi-Sweet Chocolate Chip Cookie",
        "category_id": "cookies",
        "price": 90.0,
        "cost_price": 30.0,
        "image": "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80",
        "description": "Substantial 140g bakery cookie with a crisp golden exterior and a gooey center loaded with Belgian chocolate chunks.",
        "short_description": "Giant 140g bakery-style gooey chocolate cookie",
        "allergens_json": '["Dairy", "Gluten", "Eggs"]',
        "badge": "Bestseller",
        "is_featured": True,
        "rating": 5.0,
        "stock_quantity": 90,
        "in_stock": True,
        "sizes_json": '[{"name": "140g Single", "priceDelta": 0}]'
    },
    {
        "id": "cookie-02",
        "name": "Molten Fudge Brownie Cookie",
        "category_id": "cookies",
        "price": 95.0,
        "cost_price": 34.0,
        "image": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80",
        "description": "Deep dark chocolate dough with the chew of a brownie and shiny crinkled top, packed with dark chocolate chips.",
        "short_description": "Fudgy brownie chew in a rich cookie",
        "allergens_json": '["Dairy", "Gluten", "Eggs"]',
        "badge": "Rich",
        "is_featured": False,
        "rating": 4.8,
        "stock_quantity": 75,
        "in_stock": True,
        "sizes_json": '[{"name": "Single", "priceDelta": 0}]'
    },
    {
        "id": "cookie-03",
        "name": "Kyoto Uji Matcha White Chocolate Cookie",
        "category_id": "cookies",
        "price": 105.0,
        "cost_price": 40.0,
        "image": "https://images.unsplash.com/photo-1548365328-8c6db3220e4c?auto=format&fit=crop&w=800&q=80",
        "description": "First-harvest Japanese matcha green tea dough balanced with sweet Swiss white chocolate chunks.",
        "short_description": "First-harvest matcha with Swiss white chocolate",
        "allergens_json": '["Dairy", "Gluten", "Eggs"]',
        "badge": "Premium",
        "is_featured": False,
        "rating": 4.9,
        "stock_quantity": 60,
        "in_stock": True,
        "sizes_json": '[{"name": "Single", "priceDelta": 0}]'
    },
    {
        "id": "cookie-04",
        "name": "Stuffed Red Velvet Cream Cheese Cookie",
        "category_id": "cookies",
        "price": 110.0,
        "cost_price": 42.0,
        "image": "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=800&q=80",
        "description": "Bright red velvet dough filled with a thick disk of sweetened vanilla cream cheese that oozes when warmed.",
        "short_description": "Red velvet cookie stuffed with cream cheese",
        "allergens_json": '["Dairy", "Gluten", "Eggs"]',
        "badge": "Popular",
        "is_featured": True,
        "rating": 4.9,
        "stock_quantity": 65,
        "in_stock": True,
        "sizes_json": '[{"name": "Single", "priceDelta": 0}]'
    },
    {
        "id": "cookie-05",
        "name": "Parisian Almond Macarons (Box of 6)",
        "category_id": "cookies",
        "price": 380.0,
        "cost_price": 140.0,
        "image": "https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&w=800&q=80",
        "description": "Six delicate French almond meringue shells filled with chocolate ganache, pistachio cream, salted caramel, and raspberry puree.",
        "short_description": "Assorted box of 6 handcrafted French macarons",
        "allergens_json": '["Dairy", "Eggs", "Nuts"]',
        "badge": "Gift Box",
        "is_featured": True,
        "rating": 5.0,
        "stock_quantity": 30,
        "in_stock": True,
        "sizes_json": '[{"name": "Box of 6", "priceDelta": 0}]'
    },
    {
        "id": "cookie-06",
        "name": "Brown Butter Pecan Toffee Cookie",
        "category_id": "cookies",
        "price": 100.0,
        "cost_price": 38.0,
        "image": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80",
        "description": "Nutty browned European butter dough folded with roasted Georgia pecans and crunchy English toffee bits.",
        "short_description": "Brown butter cookie with roasted pecans & toffee",
        "allergens_json": '["Dairy", "Gluten", "Eggs", "Nuts"]',
        "badge": "",
        "is_featured": False,
        "rating": 4.8,
        "stock_quantity": 55,
        "in_stock": True,
        "sizes_json": '[{"name": "Single", "priceDelta": 0}]'
    },

    # 5. Specialty & Filipino Favorites (6 items)
    {
        "id": "spec-01",
        "name": "Bohol Ube Cheese Pandesal (Pack of 6)",
        "category_id": "specialty",
        "price": 180.0,
        "cost_price": 65.0,
        "image": "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80",
        "description": "Soft purple yam rolls rolled in fine breadcrumbs, stuffed with slow-cooked ube halaya and savory quick-melt cheese.",
        "short_description": "Soft purple yam rolls with cheese & ube halaya",
        "allergens_json": '["Dairy", "Gluten", "Eggs"]',
        "badge": "Bestseller",
        "is_featured": True,
        "rating": 5.0,
        "stock_quantity": 80,
        "in_stock": True,
        "sizes_json": '[{"name": "Pack of 6", "priceDelta": 0}]'
    },
    {
        "id": "spec-02",
        "name": "Quezo de Bola Ensaymada Especial",
        "category_id": "specialty",
        "price": 95.0,
        "cost_price": 35.0,
        "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
        "description": "Brioche spiral brushed generously with churned butter, sprinkled with sugar, and heaped with aged Queso de Bola shavings.",
        "short_description": "Buttery brioche swirl with aged Queso de Bola",
        "allergens_json": '["Dairy", "Gluten", "Eggs"]',
        "badge": "Signature",
        "is_featured": True,
        "rating": 4.9,
        "stock_quantity": 70,
        "in_stock": True,
        "sizes_json": '[{"name": "Single", "priceDelta": 0}]'
    },
    {
        "id": "spec-03",
        "name": "Artisanal Toasted Sesame Binankal (Pack of 8)",
        "category_id": "specialty",
        "price": 85.0,
        "cost_price": 28.0,
        "image": "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=800&q=80",
        "description": "Traditional Visayan dense fried bread coated completely in fragrant toasted sesame seeds, crisp outside and sweet inside.",
        "short_description": "Traditional Visayan sesame fried dough balls",
        "allergens_json": '["Gluten", "Eggs", "Sesame"]',
        "badge": "Heritage",
        "is_featured": False,
        "rating": 4.8,
        "stock_quantity": 90,
        "in_stock": True,
        "sizes_json": '[{"name": "Pack of 8", "priceDelta": 0}]'
    },
    {
        "id": "spec-04",
        "name": "Caramelized Butter Spanish Bread (Pack of 4)",
        "category_id": "specialty",
        "price": 120.0,
        "cost_price": 40.0,
        "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
        "description": "Rolled soft yeast bread filled with warm butter, muscovado brown sugar, and toasted breadcrumbs.",
        "short_description": "Soft rolled bread with sweet buttery filling",
        "allergens_json": '["Dairy", "Gluten"]',
        "badge": "Favorite",
        "is_featured": False,
        "rating": 4.9,
        "stock_quantity": 75,
        "in_stock": True,
        "sizes_json": '[{"name": "Pack of 4", "priceDelta": 0}]'
    },
    {
        "id": "spec-05",
        "name": "Traditional Filipino Egg Custard Pie (Whole 9-inch)",
        "category_id": "specialty",
        "price": 450.0,
        "cost_price": 180.0,
        "image": "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=800&q=80",
        "description": "Classic egg pie with a dark caramelized toasted top, smooth golden custard center, and flaky buttery crust.",
        "short_description": "9-inch whole golden custard pie with toasted top",
        "allergens_json": '["Dairy", "Gluten", "Eggs"]',
        "badge": "Celebration",
        "is_featured": True,
        "rating": 5.0,
        "stock_quantity": 25,
        "in_stock": True,
        "sizes_json": '[{"name": "Whole 9-inch", "priceDelta": 0}]'
    },
    {
        "id": "spec-06",
        "name": "Manila Dulce de Leche Pianono Roll",
        "category_id": "specialty",
        "price": 160.0,
        "cost_price": 55.0,
        "image": "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=800&q=80",
        "description": "Delicate vanilla chiffon cake rolled tightly with sweetened butter and creamy caramelized dulce de leche.",
        "short_description": "Soft chiffon jelly roll with dulce de leche",
        "allergens_json": '["Dairy", "Gluten", "Eggs"]',
        "badge": "",
        "is_featured": False,
        "rating": 4.7,
        "stock_quantity": 40,
        "in_stock": True,
        "sizes_json": '[{"name": "Whole Roll", "priceDelta": 0}]'
    }
]

def seed_database(db: Session, force: bool = False):
    print("[SEED] Synchronizing Fredy Bills Bakery Enterprise Database...")

    # 1. Categories
    for cat in CATEGORIES_DATA:
        existing_cat = db.query(models.Category).filter(models.Category.id == cat["id"]).first()
        if not existing_cat:
            db_cat = models.Category(
                id=cat["id"],
                name=cat["name"],
                description=cat["description"],
                image=cat["image"],
                is_active=True
            )
            db.add(db_cat)
    db.commit()

    # 2. Products - Replace old menu with exactly 30 premium products
    current_count = db.query(models.Product).count()
    if force or current_count != 30:
        print(f"[SEED] Refreshing products table (found {current_count}, updating to 30 new products)...")
        # Remove old products that are not in the new set
        new_ids = {p["id"] for p in PRODUCTS_30}
        old_products = db.query(models.Product).filter(~models.Product.id.in_(new_ids)).all()
        for old_p in old_products:
            # Unlink any foreign key references before deleting
            db.query(models.ProductionTask).filter(models.ProductionTask.product_id == old_p.id).update({"product_id": "cake-01"})
            db.query(models.OrderItem).filter(models.OrderItem.product_id == old_p.id).update({"product_id": "cake-01"})
            db.delete(old_p)
        db.commit()

        for p_data in PRODUCTS_30:
            existing = db.query(models.Product).filter(models.Product.id == p_data["id"]).first()
            if existing:
                for k, v in p_data.items():
                    setattr(existing, k, v)
            else:
                db_prod = models.Product(**p_data)
                db.add(db_prod)
        db.commit()
        print(f"[SEED] Successfully updated database to exactly 30 products.")

    # 3. Users (Ensure default staff & customer accounts)
    users_data = [
        {"email": "admin@fredybills.ph", "name": "Maria Administrator", "role": "Administrator", "phone": "+63 917 111 2222"},
        {"email": "counter@fredybills.ph", "name": "Carlos Counter", "role": "Counter Staff", "phone": "+63 917 333 4444"},
        {"email": "baker@fredybills.ph", "name": "Chef Fredy", "role": "Baker", "phone": "+63 917 555 6666"},
        {"email": "delivery@fredybills.ph", "name": "Rico Rider", "role": "Delivery Staff", "phone": "+63 917 777 8888"},
        {"email": "customer@fredybills.ph", "name": "Juan Dela Cruz", "role": "Customer", "phone": "+63 917 999 0000", "address": "123 Mabini St, Cebu City"}
    ]
    for u in users_data:
        existing_user = db.query(models.User).filter(models.User.email == u["email"]).first()
        if existing_user:
            existing_user.role = u["role"]
            existing_user.name = u["name"]
            if "phone" in u:
                existing_user.phone = u["phone"]
            if "address" in u:
                existing_user.address = u["address"]
        else:
            user = models.User(
                email=u["email"],
                password_hash=get_password_hash("password123"),
                name=u["name"],
                role=u["role"],
                phone=u.get("phone", ""),
                address=u.get("address", ""),
                is_active=True
            )
            db.add(user)
    db.commit()

    # 4. Branches
    branches_data = [
        {"name": "Mabini Main Flagship", "address": "452 A. Mabini Street, Ermita, Manila", "phone": "(02) 8523-9901", "hours": "6:00 AM - 9:00 PM"},
        {"name": "Cebu IT Park Express", "address": "G/F Skyrise 4, Cebu IT Park, Apas, Cebu City", "phone": "(032) 412-8822", "hours": "7:00 AM - 10:00 PM"},
        {"name": "BGC High Street Boutique", "address": "7th Ave corner 28th St, BGC, Taguig City", "phone": "(02) 8810-4455", "hours": "8:00 AM - 10:00 PM"}
    ]
    for b in branches_data:
        if not db.query(models.Branch).filter(models.Branch.name == b["name"]).first():
            db.add(models.Branch(**b))
    db.commit()

    # 5. Inventory Items
    inventory_data = [
        {"item_name": "Premium Unbleached Bread Flour", "category": "Flour", "current_stock": 250.0, "minimum_stock": 50.0, "unit": "kg", "unit_cost": 48.0},
        {"item_name": "Normandy Churned 82% Butter", "category": "Dairy", "current_stock": 80.0, "minimum_stock": 20.0, "unit": "kg", "unit_cost": 380.0},
        {"item_name": "Belgian 70% Dark Chocolate Callets", "category": "Chocolate", "current_stock": 45.0, "minimum_stock": 15.0, "unit": "kg", "unit_cost": 650.0},
        {"item_name": "Authentic Boholano Ube Halaya", "category": "Specialty", "current_stock": 35.0, "minimum_stock": 10.0, "unit": "kg", "unit_cost": 290.0},
        {"item_name": "Instant Dry Active Yeast (SAF)", "category": "Leavening", "current_stock": 25.0, "minimum_stock": 5.0, "unit": "kg", "unit_cost": 210.0},
        {"item_name": "Pure Golden Muscovado Sugar", "category": "Sweetener", "current_stock": 120.0, "minimum_stock": 30.0, "unit": "kg", "unit_cost": 65.0}
    ]
    for inv in inventory_data:
        if not db.query(models.InventoryItem).filter(models.InventoryItem.item_name == inv["item_name"]).first():
            db.add(models.InventoryItem(**inv))
    db.commit()

    # 6. Promo Codes
    promos_data = [
        {"code": "FREDY10", "discount_percent": 10.0, "name": "10% Welcome Bakery Offer", "is_active": True},
        {"code": "BAKERY20", "discount_percent": 20.0, "name": "20% Flash Weekend Discount", "is_active": True},
        {"code": "VIPBAKER", "discount_percent": 15.0, "name": "15% Staff and VIP Privilege", "is_active": True}
    ]
    for pr in promos_data:
        if not db.query(models.PromoCode).filter(models.PromoCode.code == pr["code"]).first():
            db.add(models.PromoCode(**pr))
    db.commit()

    print("[SEED] Fredy Bills Bakery Enterprise Database Seeding Complete!")
