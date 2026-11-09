/**
 * Fredy Bills Bakery System - Mock Data & Product Catalog
 */

const BAKERY_DATA = {
  storeInfo: {
    name: "Fredy Bills Baker Management System",
    tagline: "Artisanal Bakery & Fresh Confections",
    phone: "+63 917 555 8829",
    email: "orders@fredybillsbakery.ph",
    address: "124 Mabini St, Cebu City, 6000 Philippines",
    hours: "Mon - Sun: 7:00 AM - 8:00 PM",
    branches: [
      { id: "b1", name: "Main Bakery & Cafe - Mabini St, Cebu City", address: "124 Mabini St, Cebu City" },
      { id: "b2", name: "IT Park Branch - Skyrise 4, Lahug", address: "GF Skyrise 4, IT Park, Lahug, Cebu City" },
      { id: "b3", name: "Mandaue Outlet - AS Fortuna", address: "AS Fortuna St, Mandaue City" }
    ]
  },

  roles: [
    "Customer",
    "Counter Staff",
    "Baker",
    "Delivery Staff",
    "Administrator"
  ],

  mockAccounts: [
    {
      name: "Juan Dela Cruz",
      email: "customer@fredybills.ph",
      role: "Customer",
      phone: "+63 917 123 4567",
      address: "Unit 12B, Horizon Tower, IT Park, Lahug, Cebu City"
    },
    {
      name: "Maria Santos (Counter)",
      email: "counter@fredybills.ph",
      role: "Counter Staff",
      phone: "+63 918 888 2211",
      address: "Main Branch POS Counter"
    },
    {
      name: "Chef Fredy (Baker)",
      email: "baker@fredybills.ph",
      role: "Baker",
      phone: "+63 919 777 3344",
      address: "Bakery Kitchen Division"
    },
    {
      name: "Ramon Courier (Dispatch)",
      email: "delivery@fredybills.ph",
      role: "Delivery Staff",
      phone: "+63 920 666 5544",
      address: "Cebu Logistics Hub"
    },
    {
      name: "System Administrator",
      email: "admin@fredybills.ph",
      role: "Administrator",
      phone: "+63 917 000 1122",
      address: "Headquarters Office"
    }
  ],

  categories: [
    {
      id: "cakes",
      name: "Cakes",
      description: "Handcrafted celebration cakes baked fresh daily with rich toppings.",
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
      itemCount: 4
    },
    {
      id: "breads",
      name: "Artisan Breads",
      description: "Slow-fermented sourdoughs, soft milk loaves, and savory breads.",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
      itemCount: 4
    },
    {
      id: "pastries",
      name: "Pastries",
      description: "Flaky butter croissants, tarts, and sweet breakfast pastries.",
      image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80",
      itemCount: 4
    },
    {
      id: "cookies",
      name: "Cookies & Brownies",
      description: "Chewy gourmet cookies, fudgy chocolate brownies, and bars.",
      image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80",
      itemCount: 4
    },
    {
      id: "specialty",
      name: "Specialty Confections",
      description: "Signature Filipino delicacies and seasonal premium bakery treats.",
      image: "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=800&q=80",
      itemCount: 4
    }
  ],

products: [
    {
        "id": "cake-01",
        "name": "Classic Belgian Dark Chocolate Cake",
        "category": "cakes",
        "price": 1250.0,
        "costPrice": 550.0,
        "rating": 4.9,
        "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
        "badge": "Bestseller",
        "shortDescription": "Rich 70% dark chocolate multi-layer cake",
        "description": "Three dense layers of moist dark cocoa sponge layered with 70% Belgian chocolate ganache.",
        "allergens": [
            "Dairy",
            "Gluten",
            "Eggs"
        ],
        "inStock": true,
        "stockQuantity": 40,
        "isFeatured": true,
        "sizes": [
            {
                "name": "6-inch (Feeds 6-8)",
                "priceDelta": 0
            },
            {
                "name": "8-inch (Feeds 12-16)",
                "priceDelta": 450
            }
        ]
    },
    {
        "id": "cake-02",
        "name": "Bohol Ube Halaya Velvet Cake",
        "category": "cakes",
        "price": 1150.0,
        "costPrice": 480.0,
        "rating": 5.0,
        "image": "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=800&q=80",
        "badge": "Signature",
        "shortDescription": "Pure Bohol ube chiffon with halaya cream",
        "description": "Authentic purple yam chiffon filled with slow-cooked Bohol ube halaya and fresh whipped cream.",
        "allergens": [
            "Dairy",
            "Gluten",
            "Eggs"
        ],
        "inStock": true,
        "stockQuantity": 35,
        "isFeatured": true,
        "sizes": [
            {
                "name": "6-inch",
                "priceDelta": 0
            },
            {
                "name": "8-inch",
                "priceDelta": 400
            }
        ]
    },
    {
        "id": "cake-03",
        "name": "Red Velvet Swirl Cheesecake",
        "category": "cakes",
        "price": 1350.0,
        "costPrice": 600.0,
        "rating": 4.8,
        "image": "https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?auto=format&fit=crop&w=800&q=80",
        "badge": "Popular",
        "shortDescription": "Red velvet sponge with baked NY cheesecake layer",
        "description": "Velvety crimson cocoa cake swirled with baked New York cream cheese and mascarpone frosting.",
        "allergens": [
            "Dairy",
            "Gluten",
            "Eggs"
        ],
        "inStock": true,
        "stockQuantity": 30,
        "isFeatured": true,
        "sizes": [
            {
                "name": "6-inch",
                "priceDelta": 0
            },
            {
                "name": "8-inch",
                "priceDelta": 500
            }
        ]
    },
    {
        "id": "cake-04",
        "name": "Guimaras Mango Tres Leches Cake",
        "category": "cakes",
        "price": 1050.0,
        "costPrice": 450.0,
        "rating": 4.9,
        "image": "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80",
        "badge": "Seasonal",
        "shortDescription": "Triple-milk soaked sponge with fresh mangoes",
        "description": "Light sponge cake steeped in evaporated milk, condensed milk, and heavy cream, topped with sweet Guimaras mango roses.",
        "allergens": [
            "Dairy",
            "Gluten",
            "Eggs"
        ],
        "inStock": true,
        "stockQuantity": 25,
        "isFeatured": false,
        "sizes": [
            {
                "name": "8x8 Square",
                "priceDelta": 0
            }
        ]
    },
    {
        "id": "cake-05",
        "name": "San Sebastian Burnt Basque Cheesecake",
        "category": "cakes",
        "price": 1200.0,
        "costPrice": 520.0,
        "rating": 5.0,
        "image": "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80",
        "badge": "Chef Choice",
        "shortDescription": "Caramelized crust with gooey molten center",
        "description": "Rustic caramelized crust with a custardy, oozing molten center made from premium French cream cheese.",
        "allergens": [
            "Dairy",
            "Eggs"
        ],
        "inStock": true,
        "stockQuantity": 20,
        "isFeatured": true,
        "sizes": [
            {
                "name": "7-inch",
                "priceDelta": 0
            }
        ]
    },
    {
        "id": "cake-06",
        "name": "Spiced Carrot Walnut Cream Cake",
        "category": "cakes",
        "price": 980.0,
        "costPrice": 390.0,
        "rating": 4.7,
        "image": "https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=800&q=80",
        "badge": "",
        "shortDescription": "Hearty spiced carrot cake with toasted walnuts",
        "description": "Shredded organic carrots with cinnamon, nutmeg, toasted walnuts, and tangy whipped cream cheese.",
        "allergens": [
            "Dairy",
            "Gluten",
            "Eggs",
            "Nuts"
        ],
        "inStock": true,
        "stockQuantity": 25,
        "isFeatured": false,
        "sizes": [
            {
                "name": "6-inch",
                "priceDelta": 0
            }
        ]
    },
    {
        "id": "bread-01",
        "name": "Rustic San Francisco Country Sourdough",
        "category": "breads",
        "price": 220.0,
        "costPrice": 75.0,
        "rating": 4.9,
        "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
        "badge": "Organic",
        "shortDescription": "Wild fermented 36-hr artisanal hearth loaf",
        "description": "Naturally leavened with wild yeast, cold fermented for 36 hours for maximum flavor and open aerated crumb.",
        "allergens": [
            "Gluten"
        ],
        "inStock": true,
        "stockQuantity": 50,
        "isFeatured": true,
        "sizes": [
            {
                "name": "Whole Loaf (850g)",
                "priceDelta": 0
            },
            {
                "name": "Sliced",
                "priceDelta": 0
            }
        ]
    },
    {
        "id": "bread-02",
        "name": "Crispy French Traditional Baguette",
        "category": "breads",
        "price": 120.0,
        "costPrice": 38.0,
        "rating": 4.8,
        "image": "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=800&q=80",
        "badge": "Daily Baked",
        "shortDescription": "Authentic stone-baked French baguette",
        "description": "Classic long French loaf baked in stone hearth ovens for a shatteringly crisp crust and chewy honeycomb interior.",
        "allergens": [
            "Gluten"
        ],
        "inStock": true,
        "stockQuantity": 60,
        "isFeatured": false,
        "sizes": [
            {
                "name": "Standard (300g)",
                "priceDelta": 0
            }
        ]
    },
    {
        "id": "bread-03",
        "name": "Japanese Hokkaido Shokupan Milk Bread",
        "category": "breads",
        "price": 180.0,
        "costPrice": 60.0,
        "rating": 5.0,
        "image": "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=800&q=80",
        "badge": "Must Try",
        "shortDescription": "Ultra-soft, sweet Japanese milk loaf",
        "description": "Feather-light, cloud-soft loaf crafted using the Japanese Yudane scald method with fresh whole milk.",
        "allergens": [
            "Dairy",
            "Gluten"
        ],
        "inStock": true,
        "stockQuantity": 45,
        "isFeatured": true,
        "sizes": [
            {
                "name": "Thick Sliced",
                "priceDelta": 0
            },
            {
                "name": "Uncut Loaf",
                "priceDelta": 0
            }
        ]
    },
    {
        "id": "bread-04",
        "name": "Rosemary & Sea Salt Olive Oil Focaccia",
        "category": "breads",
        "price": 190.0,
        "costPrice": 65.0,
        "rating": 4.7,
        "image": "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=800&q=80",
        "badge": "",
        "shortDescription": "Olive oil focaccia with fresh rosemary",
        "description": "Deeply dimpled Ligurian style focaccia soaked in Spanish extra virgin olive oil, fresh rosemary sprigs, and Maldon sea salt.",
        "allergens": [
            "Gluten"
        ],
        "inStock": true,
        "stockQuantity": 30,
        "isFeatured": false,
        "sizes": [
            {
                "name": "Slab (400g)",
                "priceDelta": 0
            }
        ]
    },
    {
        "id": "bread-05",
        "name": "Rustic Seeded Whole Wheat Multi-Grain",
        "category": "breads",
        "price": 240.0,
        "costPrice": 85.0,
        "rating": 4.8,
        "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
        "badge": "Healthy",
        "shortDescription": "100% whole grain loaf with toasted seeds",
        "description": "100% stoneground whole wheat enriched with toasted pumpkin seeds, sunflower seeds, golden flax, and oats.",
        "allergens": [
            "Gluten",
            "Seeds"
        ],
        "inStock": true,
        "stockQuantity": 35,
        "isFeatured": false,
        "sizes": [
            {
                "name": "Whole (750g)",
                "priceDelta": 0
            }
        ]
    },
    {
        "id": "bread-06",
        "name": "French Normandy Brioche Nanterre",
        "category": "breads",
        "price": 210.0,
        "costPrice": 80.0,
        "rating": 4.9,
        "image": "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=800&q=80",
        "badge": "",
        "shortDescription": "Golden butter brioche loaf",
        "description": "Buttery, golden braided brioche enriched with free-range eggs and 82% Normandy European churned butter.",
        "allergens": [
            "Dairy",
            "Gluten",
            "Eggs"
        ],
        "inStock": true,
        "stockQuantity": 40,
        "isFeatured": false,
        "sizes": [
            {
                "name": "Standard (450g)",
                "priceDelta": 0
            }
        ]
    },
    {
        "id": "pastry-01",
        "name": "Pure Butter Normandy Croissant",
        "category": "pastries",
        "price": 95.0,
        "costPrice": 32.0,
        "rating": 5.0,
        "image": "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80",
        "badge": "Bestseller",
        "shortDescription": "Hand-laminated 27-layer butter croissant",
        "description": "27 laminated layers of golden butter pastry, baked fresh for maximum crunch and airy honeycomb interior.",
        "allergens": [
            "Dairy",
            "Gluten",
            "Eggs"
        ],
        "inStock": true,
        "stockQuantity": 80,
        "isFeatured": true,
        "sizes": [
            {
                "name": "Piece",
                "priceDelta": 0
            }
        ]
    },
    {
        "id": "pastry-02",
        "name": "Pain au Chocolat (Chocolate Croissant)",
        "category": "pastries",
        "price": 115.0,
        "costPrice": 42.0,
        "rating": 4.9,
        "image": "https://images.unsplash.com/photo-1530610476181-d83430b64dcd?auto=format&fit=crop&w=800&q=80",
        "badge": "Favorite",
        "shortDescription": "Flaky pastry wrapped around twin chocolate batons",
        "description": "Crisp buttery layers wrapping two dark Valrhona 55% chocolate batons that melt gently on the tongue.",
        "allergens": [
            "Dairy",
            "Gluten",
            "Eggs"
        ],
        "inStock": true,
        "stockQuantity": 70,
        "isFeatured": true,
        "sizes": [
            {
                "name": "Piece",
                "priceDelta": 0
            }
        ]
    },
    {
        "id": "pastry-03",
        "name": "Twice-Baked Almond Frangipane Croissant",
        "category": "pastries",
        "price": 145.0,
        "costPrice": 55.0,
        "rating": 4.9,
        "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
        "badge": "Decadent",
        "shortDescription": "Filled with almond frangipane and flaked almonds",
        "description": "Dipped in vanilla syrup, stuffed with luscious almond cream, rebaked, and showered with toasted flaked almonds.",
        "allergens": [
            "Dairy",
            "Gluten",
            "Eggs",
            "Nuts"
        ],
        "inStock": true,
        "stockQuantity": 50,
        "isFeatured": false,
        "sizes": [
            {
                "name": "Piece",
                "priceDelta": 0
            }
        ]
    },
    {
        "id": "pastry-04",
        "name": "Portuguese Pastel de Nata (Custard Tart)",
        "category": "pastries",
        "price": 85.0,
        "costPrice": 28.0,
        "rating": 4.8,
        "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
        "badge": "",
        "shortDescription": "Crispy caramelized egg custard tart",
        "description": "Spiral laminated pastry cup with caramelized egg yolk custard and a dusting of Sri Lankan cinnamon.",
        "allergens": [
            "Dairy",
            "Gluten",
            "Eggs"
        ],
        "inStock": true,
        "stockQuantity": 60,
        "isFeatured": false,
        "sizes": [
            {
                "name": "Piece",
                "priceDelta": 0
            }
        ]
    },
    {
        "id": "pastry-05",
        "name": "Wild Berry Vanilla Cream Danish",
        "category": "pastries",
        "price": 125.0,
        "costPrice": 45.0,
        "rating": 4.7,
        "image": "https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=800&q=80",
        "badge": "",
        "shortDescription": "Flaky Danish topped with berries and pastry cream",
        "description": "Square Danish pastry filled with Madagascar vanilla bean creme patissiere, raspberries, and wild blueberries.",
        "allergens": [
            "Dairy",
            "Gluten",
            "Eggs"
        ],
        "inStock": true,
        "stockQuantity": 40,
        "isFeatured": false,
        "sizes": [
            {
                "name": "Piece",
                "priceDelta": 0
            }
        ]
    },
    {
        "id": "pastry-06",
        "name": "Caramelized Kouign-Amann Breton Pastry",
        "category": "pastries",
        "price": 130.0,
        "costPrice": 48.0,
        "rating": 4.9,
        "image": "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80",
        "badge": "Artisan",
        "shortDescription": "Caramelized Breton salted butter pastry",
        "description": "Traditional Breton butter cake made with salted butter dough, baked slow until the sugar crystallizes into amber crust.",
        "allergens": [
            "Dairy",
            "Gluten"
        ],
        "inStock": true,
        "stockQuantity": 35,
        "isFeatured": false,
        "sizes": [
            {
                "name": "Piece",
                "priceDelta": 0
            }
        ]
    },
    {
        "id": "cookie-01",
        "name": "NYC Chunky Semi-Sweet Chocolate Chip Cookie",
        "category": "cookies",
        "price": 90.0,
        "costPrice": 30.0,
        "rating": 5.0,
        "image": "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80",
        "badge": "Bestseller",
        "shortDescription": "Giant 140g bakery-style gooey chocolate cookie",
        "description": "Substantial 140g bakery cookie with a crisp golden exterior and a gooey center loaded with Belgian chocolate chunks.",
        "allergens": [
            "Dairy",
            "Gluten",
            "Eggs"
        ],
        "inStock": true,
        "stockQuantity": 90,
        "isFeatured": true,
        "sizes": [
            {
                "name": "140g Single",
                "priceDelta": 0
            }
        ]
    },
    {
        "id": "cookie-02",
        "name": "Molten Fudge Brownie Cookie",
        "category": "cookies",
        "price": 95.0,
        "costPrice": 34.0,
        "rating": 4.8,
        "image": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80",
        "badge": "Rich",
        "shortDescription": "Fudgy brownie chew in a rich cookie",
        "description": "Deep dark chocolate dough with the chew of a brownie and shiny crinkled top, packed with dark chocolate chips.",
        "allergens": [
            "Dairy",
            "Gluten",
            "Eggs"
        ],
        "inStock": true,
        "stockQuantity": 75,
        "isFeatured": false,
        "sizes": [
            {
                "name": "Single",
                "priceDelta": 0
            }
        ]
    },
    {
        "id": "cookie-03",
        "name": "Kyoto Uji Matcha White Chocolate Cookie",
        "category": "cookies",
        "price": 105.0,
        "costPrice": 40.0,
        "rating": 4.9,
        "image": "https://images.unsplash.com/photo-1548365328-8c6db3220e4c?auto=format&fit=crop&w=800&q=80",
        "badge": "Premium",
        "shortDescription": "First-harvest matcha with Swiss white chocolate",
        "description": "First-harvest Japanese matcha green tea dough balanced with sweet Swiss white chocolate chunks.",
        "allergens": [
            "Dairy",
            "Gluten",
            "Eggs"
        ],
        "inStock": true,
        "stockQuantity": 60,
        "isFeatured": false,
        "sizes": [
            {
                "name": "Single",
                "priceDelta": 0
            }
        ]
    },
    {
        "id": "cookie-04",
        "name": "Stuffed Red Velvet Cream Cheese Cookie",
        "category": "cookies",
        "price": 110.0,
        "costPrice": 42.0,
        "rating": 4.9,
        "image": "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=800&q=80",
        "badge": "Popular",
        "shortDescription": "Red velvet cookie stuffed with cream cheese",
        "description": "Bright red velvet dough filled with a thick disk of sweetened vanilla cream cheese that oozes when warmed.",
        "allergens": [
            "Dairy",
            "Gluten",
            "Eggs"
        ],
        "inStock": true,
        "stockQuantity": 65,
        "isFeatured": true,
        "sizes": [
            {
                "name": "Single",
                "priceDelta": 0
            }
        ]
    },
    {
        "id": "cookie-05",
        "name": "Parisian Almond Macarons (Box of 6)",
        "category": "cookies",
        "price": 380.0,
        "costPrice": 140.0,
        "rating": 5.0,
        "image": "https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&w=800&q=80",
        "badge": "Gift Box",
        "shortDescription": "Assorted box of 6 handcrafted French macarons",
        "description": "Six delicate French almond meringue shells filled with chocolate ganache, pistachio cream, salted caramel, and raspberry puree.",
        "allergens": [
            "Dairy",
            "Eggs",
            "Nuts"
        ],
        "inStock": true,
        "stockQuantity": 30,
        "isFeatured": true,
        "sizes": [
            {
                "name": "Box of 6",
                "priceDelta": 0
            }
        ]
    },
    {
        "id": "cookie-06",
        "name": "Brown Butter Pecan Toffee Cookie",
        "category": "cookies",
        "price": 100.0,
        "costPrice": 38.0,
        "rating": 4.8,
        "image": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80",
        "badge": "",
        "shortDescription": "Brown butter cookie with roasted pecans & toffee",
        "description": "Nutty browned European butter dough folded with roasted Georgia pecans and crunchy English toffee bits.",
        "allergens": [
            "Dairy",
            "Gluten",
            "Eggs",
            "Nuts"
        ],
        "inStock": true,
        "stockQuantity": 55,
        "isFeatured": false,
        "sizes": [
            {
                "name": "Single",
                "priceDelta": 0
            }
        ]
    },
    {
        "id": "spec-01",
        "name": "Bohol Ube Cheese Pandesal (Pack of 6)",
        "category": "specialty",
        "price": 180.0,
        "costPrice": 65.0,
        "rating": 5.0,
        "image": "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80",
        "badge": "Bestseller",
        "shortDescription": "Soft purple yam rolls with cheese & ube halaya",
        "description": "Soft purple yam rolls rolled in fine breadcrumbs, stuffed with slow-cooked ube halaya and savory quick-melt cheese.",
        "allergens": [
            "Dairy",
            "Gluten",
            "Eggs"
        ],
        "inStock": true,
        "stockQuantity": 80,
        "isFeatured": true,
        "sizes": [
            {
                "name": "Pack of 6",
                "priceDelta": 0
            }
        ]
    },
    {
        "id": "spec-02",
        "name": "Quezo de Bola Ensaymada Especial",
        "category": "specialty",
        "price": 95.0,
        "costPrice": 35.0,
        "rating": 4.9,
        "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
        "badge": "Signature",
        "shortDescription": "Buttery brioche swirl with aged Queso de Bola",
        "description": "Brioche spiral brushed generously with churned butter, sprinkled with sugar, and heaped with aged Queso de Bola shavings.",
        "allergens": [
            "Dairy",
            "Gluten",
            "Eggs"
        ],
        "inStock": true,
        "stockQuantity": 70,
        "isFeatured": true,
        "sizes": [
            {
                "name": "Single",
                "priceDelta": 0
            }
        ]
    },
    {
        "id": "spec-03",
        "name": "Artisanal Toasted Sesame Binankal (Pack of 8)",
        "category": "specialty",
        "price": 85.0,
        "costPrice": 28.0,
        "rating": 4.8,
        "image": "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=800&q=80",
        "badge": "Heritage",
        "shortDescription": "Traditional Visayan sesame fried dough balls",
        "description": "Traditional Visayan dense fried bread coated completely in fragrant toasted sesame seeds, crisp outside and sweet inside.",
        "allergens": [
            "Gluten",
            "Eggs",
            "Sesame"
        ],
        "inStock": true,
        "stockQuantity": 90,
        "isFeatured": false,
        "sizes": [
            {
                "name": "Pack of 8",
                "priceDelta": 0
            }
        ]
    },
    {
        "id": "spec-04",
        "name": "Caramelized Butter Spanish Bread (Pack of 4)",
        "category": "specialty",
        "price": 120.0,
        "costPrice": 40.0,
        "rating": 4.9,
        "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
        "badge": "Favorite",
        "shortDescription": "Soft rolled bread with sweet buttery filling",
        "description": "Rolled soft yeast bread filled with warm butter, muscovado brown sugar, and toasted breadcrumbs.",
        "allergens": [
            "Dairy",
            "Gluten"
        ],
        "inStock": true,
        "stockQuantity": 75,
        "isFeatured": false,
        "sizes": [
            {
                "name": "Pack of 4",
                "priceDelta": 0
            }
        ]
    },
    {
        "id": "spec-05",
        "name": "Traditional Filipino Egg Custard Pie (Whole 9-inch)",
        "category": "specialty",
        "price": 450.0,
        "costPrice": 180.0,
        "rating": 5.0,
        "image": "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=800&q=80",
        "badge": "Celebration",
        "shortDescription": "9-inch whole golden custard pie with toasted top",
        "description": "Classic egg pie with a dark caramelized toasted top, smooth golden custard center, and flaky buttery crust.",
        "allergens": [
            "Dairy",
            "Gluten",
            "Eggs"
        ],
        "inStock": true,
        "stockQuantity": 25,
        "isFeatured": true,
        "sizes": [
            {
                "name": "Whole 9-inch",
                "priceDelta": 0
            }
        ]
    },
    {
        "id": "spec-06",
        "name": "Manila Dulce de Leche Pianono Roll",
        "category": "specialty",
        "price": 160.0,
        "costPrice": 55.0,
        "rating": 4.7,
        "image": "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=800&q=80",
        "badge": "",
        "shortDescription": "Soft chiffon jelly roll with dulce de leche",
        "description": "Delicate vanilla chiffon cake rolled tightly with sweetened butter and creamy caramelized dulce de leche.",
        "allergens": [
            "Dairy",
            "Gluten",
            "Eggs"
        ],
        "inStock": true,
        "stockQuantity": 40,
        "isFeatured": false,
        "sizes": [
            {
                "name": "Whole Roll",
                "priceDelta": 0
            }
        ]
    }
],

  initialOrders: [
    {
      id: "FB-8942",
      date: "2026-09-02T14:30:00",
      status: "preparing",
      statusStep: 3,
      fulfillment: "delivery",
      customerName: "Juan Dela Cruz",
      phone: "+63 917 123 4567",
      address: "Unit 12B, Horizon Tower, IT Park, Lahug, Cebu City",
      paymentMethod: "GCash",
      paymentStatus: "Paid",
      items: [
        { id: "p101", name: "Signature Decadent Chocolate Cake", quantity: 1, price: 850 },
        { id: "p201", name: "Traditional French Butter Croissant", quantity: 2, price: 110 }
      ],
      subtotal: 1070,
      discount: 0,
      deliveryFee: 80,
      total: 1150,
      estimatedTime: "Today at 4:15 PM",
      timeline: [
        { step: "Order Placed", time: "2:30 PM", done: true },
        { step: "Confirmed by Bakery", time: "2:35 PM", done: true },
        { step: "Preparing in Kitchen", time: "3:00 PM (In Progress)", active: true },
        { step: "Ready for Pickup/Dispatch", time: "Estimated 3:45 PM", done: false },
        { step: "Out for Delivery", time: "Estimated 4:00 PM", done: false },
        { step: "Delivered", time: "Estimated 4:15 PM", done: false }
      ]
    },
    {
      id: "FB-8720",
      date: "2026-08-28T10:15:00",
      status: "delivered",
      statusStep: 6,
      fulfillment: "pickup",
      customerName: "Juan Dela Cruz",
      phone: "+63 917 123 4567",
      address: "Main Bakery & Cafe - Mabini St, Cebu City",
      paymentMethod: "Cash on Pickup",
      paymentStatus: "Paid",
      items: [
        { id: "p102", name: "Royal Ube Halaya Layer Cake", quantity: 1, price: 920 },
        { id: "p401", name: "Triple Chocolate Chunk Cookie", quantity: 4, price: 85 }
      ],
      subtotal: 1260,
      discount: 100,
      deliveryFee: 0,
      total: 1160,
      estimatedTime: "Completed Aug 28, 11:30 AM",
      timeline: [
        { step: "Order Placed", time: "10:15 AM", done: true },
        { step: "Confirmed by Bakery", time: "10:20 AM", done: true },
        { step: "Preparing in Kitchen", time: "10:45 AM", done: true },
        { step: "Ready for Pickup", time: "11:10 AM", done: true },
        { step: "Out for Delivery / Pickup", time: "11:25 AM", done: true },
        { step: "Delivered / Picked Up", time: "11:30 AM", done: true }
      ]
    }
  ]
};

if (typeof window !== 'undefined') {
  window.BAKERY_DATA = BAKERY_DATA;
}
