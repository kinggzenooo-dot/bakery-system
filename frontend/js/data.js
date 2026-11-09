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
      id: "p101",
      name: "Signature Decadent Chocolate Cake",
      category: "cakes",
      price: 850,
      rating: 4.9,
      reviewCount: 128,
      badge: "Best Seller",
      availability: "in_stock",
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
      shortDescription: "Rich multi-layered dark chocolate sponge with Belgium ganache frosting.",
      description: "Our crowning achievement. Three layers of moist, cocoa-infused chocolate sponge filled with velvety Belgium dark chocolate ganache and finished with hand-piped truffles and gold leaf accents.",
      allergens: ["Wheat", "Dairy", "Eggs"],
      customization: {
        sizes: [
          { name: "6-inch (Serves 4-6)", priceDelta: 0 },
          { name: "8-inch (Serves 8-12)", priceDelta: 350 },
          { name: "10-inch (Serves 16-20)", priceDelta: 700 }
        ]
      }
    },
    {
      id: "p102",
      name: "Royal Ube Halaya Layer Cake",
      category: "cakes",
      price: 920,
      rating: 4.95,
      reviewCount: 94,
      badge: "House Specialty",
      availability: "in_stock",
      image: "https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80",
      shortDescription: "Authentic Bohol purple yam chiffon layered with real ube halaya and macapuno strings.",
      description: "Made from scratch using 100% natural purple yam. Light chiffon sponge layered with slow-cooked sweet ube halaya, rich coconut cream buttercream, and coconut macapuno strips.",
      allergens: ["Wheat", "Dairy", "Eggs", "Coconut"],
      customization: {
        sizes: [
          { name: "6-inch Round", priceDelta: 0 },
          { name: "8-inch Round", priceDelta: 400 }
        ]
      }
    },
    {
      id: "p103",
      name: "Wild Blueberry Basque Cheesecake",
      category: "cakes",
      price: 980,
      rating: 4.8,
      reviewCount: 76,
      badge: "Chef's Special",
      availability: "in_stock",
      image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80",
      shortDescription: "Caramelized burnt top cheesecake with a creamy molten core and wild blueberry compote.",
      description: "Baked at high temperature to achieve the iconic rustic caramelized top while preserving a custardy, melting cream cheese center. Served with house-made wild blueberry compote.",
      allergens: ["Dairy", "Eggs"],
      customization: {
        sizes: [
          { name: "7-inch Whole", priceDelta: 0 },
          { name: "9-inch Whole", priceDelta: 450 }
        ]
      }
    },
    {
      id: "p104",
      name: "Classic Strawberry Shortcake",
      category: "cakes",
      price: 890,
      rating: 4.75,
      reviewCount: 62,
      badge: null,
      availability: "low_stock",
      image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80",
      shortDescription: "Fluffy vanilla sponge layered with fresh Benguet strawberries and light chantilly cream.",
      description: "Airy vanilla chiffon sponge loaded with hand-selected Benguet fresh strawberries and light vanilla bean chantilly cream. Refreshing and perfectly balanced sweetness.",
      allergens: ["Wheat", "Dairy", "Eggs"],
      customization: {
        sizes: [
          { name: "6-inch Round", priceDelta: 0 },
          { name: "8-inch Round", priceDelta: 380 }
        ]
      }
    },
    {
      id: "p201",
      name: "Traditional French Butter Croissant",
      category: "pastries",
      price: 110,
      rating: 4.9,
      reviewCount: 210,
      badge: "Best Seller",
      availability: "in_stock",
      image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80",
      shortDescription: "Hand-laminated flaky croissant crafted with imported Normandy butter.",
      description: "Baked fresh every morning at 6:00 AM. 27 delicate layers of flaky, golden pastry made with 100% French butter. Crispy shatter on the outside with a soft, honeycomb interior.",
      allergens: ["Wheat", "Dairy"],
      customization: null
    },
    {
      id: "p202",
      name: "Pain au Chocolat (Chocolate Croissant)",
      category: "pastries",
      price: 135,
      rating: 4.85,
      reviewCount: 154,
      badge: null,
      availability: "in_stock",
      image: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=800&q=80",
      shortDescription: "Flaky butter pastry folded over two batons of French Valrhona dark chocolate.",
      description: "Crispy butter croissant dough encapsulating double batons of rich Valrhona 64% dark chocolate. Served warm with a light dusting of powdered cocoa.",
      allergens: ["Wheat", "Dairy", "Soy"],
      customization: null
    },
    {
      id: "p203",
      name: "Gourmet Cinnamon Roll with Cream Cheese",
      category: "pastries",
      price: 145,
      rating: 4.92,
      reviewCount: 188,
      badge: "Customer Favorite",
      availability: "in_stock",
      image: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=800&q=80",
      shortDescription: "Soft brioche spiral packed with Saigon cinnamon brown sugar and smothered in rich cream cheese frosting.",
      description: "Soft, pillowy brioche dough swirled with aromatic Saigon cinnamon and brown sugar, generously smothered while warm with vanilla cream cheese frosting.",
      allergens: ["Wheat", "Dairy", "Eggs"],
      customization: null
    },
    {
      id: "p204",
      name: "Salted Caramel & Pecan Tart",
      category: "pastries",
      price: 165,
      rating: 4.7,
      reviewCount: 45,
      badge: null,
      availability: "in_stock",
      image: "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=800&q=80",
      shortDescription: "Butter crust tart filled with house-made salted caramel and toasted pecans.",
      description: "Crisp butter pastry shell loaded with buttery sea-salt caramel and topped with toasted whole pecans and dark chocolate drizzle.",
      allergens: ["Wheat", "Dairy", "Nuts"],
      customization: null
    },
    {
      id: "p301",
      name: "Artisan Country Sourdough Batard",
      category: "breads",
      price: 240,
      rating: 4.9,
      reviewCount: 142,
      badge: "Fresh Baked",
      availability: "in_stock",
      image: "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=800&q=80",
      shortDescription: "Naturally fermented 36-hour wild starter sourdough with a blistered golden crust.",
      description: "Crafted using our 8-year-old sourdough starter, unbleached stoneground flour, sea salt, and filtered water. Long cold fermentation yields an open airy crumb and tangy flavor.",
      allergens: ["Wheat"],
      customization: {
        options: [
          { name: "Whole Loaf (Unslicied)", priceDelta: 0 },
          { name: "Sliced (Medium Thickness)", priceDelta: 0 }
        ]
      }
    },
    {
      id: "p302",
      name: "Japanese Soft Milk Bread (Shokupan)",
      category: "breads",
      price: 180,
      rating: 4.88,
      reviewCount: 165,
      badge: "Best Seller",
      availability: "in_stock",
      image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=800&q=80",
      shortDescription: "Ultra-fluffy, feathery soft milk loaf made with the traditional Yudane method.",
      description: "Cloud-like, tender bread loaf crafted using fresh whole milk and Japanese Yudane water roux technique. Stays extraordinarily fresh and pillowy for days.",
      allergens: ["Wheat", "Dairy"],
      customization: null
    },
    {
      id: "p303",
      name: "Garlic Butter & Cheese Brioche Crown",
      category: "breads",
      price: 220,
      rating: 4.82,
      reviewCount: 98,
      badge: "Hot Out Of Oven",
      availability: "in_stock",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
      shortDescription: "Pull-apart rich brioche stuffed with garlic herb butter and melted mozzarella.",
      description: "Savory golden brioche pull-apart loaf drenched in roasted garlic butter, parsley, cream cheese filling, and toasted mozzarella crust.",
      allergens: ["Wheat", "Dairy", "Eggs"],
      customization: null
    },
    {
      id: "p304",
      name: "Multigrain Seeded Loaf",
      category: "breads",
      price: 210,
      rating: 4.65,
      reviewCount: 40,
      badge: null,
      availability: "in_stock",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
      shortDescription: "Hearty wholesome bread packed with toasted sunflower, flax, and sesame seeds.",
      description: "Nutritious whole wheat bread crust-coated and filled with toasted flaxseeds, pumpkin seeds, sunflower seeds, and rolled oats.",
      allergens: ["Wheat", "Sesame"],
      customization: null
    },
    {
      id: "p401",
      name: "Triple Chocolate Chunk Cookie",
      category: "cookies",
      price: 85,
      rating: 4.95,
      reviewCount: 310,
      badge: "Top Rated",
      availability: "in_stock",
      image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80",
      shortDescription: "Giant thick palm-sized cookie loaded with dark, milk, and white chocolate chunks.",
      description: "Crispy outer edges with a gooey, soft center. Loaded generously with dark chocolate 70%, milk chocolate, and white chocolate chips, topped with flaky Maldon sea salt.",
      allergens: ["Wheat", "Dairy", "Eggs", "Soy"],
      customization: null
    },
    {
      id: "p402",
      name: "Fudgy Belgian Dark Chocolate Brownie",
      category: "cookies",
      price: 95,
      rating: 4.9,
      reviewCount: 185,
      badge: null,
      availability: "in_stock",
      image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
      shortDescription: "Dense, chewy brownie square with shiny crinkly top and intense cocoa flavor.",
      description: "Baked with melted dark chocolate blocks and brown butter for maximum fudginess. Thin crinkle crust on top and decadent chewy chocolate center.",
      allergens: ["Wheat", "Dairy", "Eggs"],
      customization: null
    },
    {
      id: "p403",
      name: "Red Velvet Cream Cheese Sandwich Cookie",
      category: "cookies",
      price: 90,
      rating: 4.8,
      reviewCount: 112,
      badge: null,
      availability: "in_stock",
      image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80",
      shortDescription: "Two red velvet soft cookies sandwiched with tangy cream cheese frosting.",
      description: "Vibrant red cocoa cookies filled with silky vanilla cream cheese frosting. Tender, melt-in-your-mouth texture.",
      allergens: ["Wheat", "Dairy", "Eggs"],
      customization: null
    },
    {
      id: "p404",
      name: "Matcha White Chocolate Macadamia Cookie",
      category: "cookies",
      price: 105,
      rating: 4.88,
      reviewCount: 88,
      badge: "Staff Pick",
      availability: "in_stock",
      image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=800&q=80",
      shortDescription: "Premium Japanese Uji matcha dough filled with creamy white chocolate and toasted macadamias.",
      description: "Aromatic ceremonial grade Uji matcha green tea cookie dough paired with sweet Belgian white chocolate nuggets and buttery toasted macadamia nuts.",
      allergens: ["Wheat", "Dairy", "Eggs", "Nuts"],
      customization: null
    },
    {
      id: "p501",
      name: "Specialty Ensaymada Superiore",
      category: "specialty",
      price: 130,
      rating: 4.96,
      reviewCount: 245,
      badge: "Filipino Favorite",
      availability: "in_stock",
      image: "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=800&q=80",
      shortDescription: "Brioche bun brushed with creamed butter, topped with aged Queso de Bola shreddings.",
      description: "Our famous sweet brioche bread infused with egg yolks and real butter, generously smothered with sweet butter cream and topped with shredded aged Queso de Bola cheese.",
      allergens: ["Wheat", "Dairy", "Eggs"],
      customization: null
    },
    {
      id: "p502",
      name: "Dulce de Leche Spanish Roll Box (6pcs)",
      category: "specialty",
      price: 260,
      rating: 4.9,
      reviewCount: 130,
      badge: null,
      availability: "in_stock",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
      shortDescription: "Warm soft bread rolls stuffed with caramelized dulce de leche filling.",
      description: "Soft bread rolls coated in fine breadcrumbs, filled while hot with creamy caramelized milk sauce. Comes in a box of 6 individually wrapped rolls.",
      allergens: ["Wheat", "Dairy", "Eggs"],
      customization: null
    },
    {
      id: "p503",
      name: "Artisan Mango Passionfruit Tart",
      category: "specialty",
      price: 195,
      rating: 4.87,
      reviewCount: 64,
      badge: "Seasonal",
      availability: "in_stock",
      image: "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=800&q=80",
      shortDescription: "Butter crust tart filled with passionfruit curd and fresh sweet Guimaras mango roses.",
      description: "Crisp almond tart shell filled with tangy passionfruit curd, topped with fresh ripe Guimaras mango slices arranged like a rose bloom.",
      allergens: ["Wheat", "Dairy", "Eggs", "Nuts"],
      customization: null
    },
    {
      id: "p504",
      name: "Flaky Choco-Hazelnut Cruffin",
      category: "specialty",
      price: 155,
      rating: 4.82,
      reviewCount: 92,
      badge: null,
      availability: "in_stock",
      image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80",
      shortDescription: "Croissant-muffin hybrid filled with Nutella hazelnut cream and toasted hazelnut crunch.",
      description: "Laminated croissant dough baked inside a muffin mold to create tall flaky layers, injected with house-made hazelnut cocoa praline cream.",
      allergens: ["Wheat", "Dairy", "Nuts", "Soy"],
      customization: null
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
