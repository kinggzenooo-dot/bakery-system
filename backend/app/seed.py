import json
from datetime import datetime
from sqlalchemy.orm import Session
from backend.app import models
from backend.app.auth import get_password_hash

def seed_database(db: Session):
    # Check if database is already seeded
    if db.query(models.Category).first():
        return

    print("[SEED] Seeding Fredy Bills Enterprise Bakery database...")

    # 1. Categories
    categories_data = [
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

    for cat in categories_data:
        db_cat = models.Category(
            id=cat["id"],
            name=cat["name"],
            description=cat["description"],
            image=cat["image"],
            is_active=True
        )
        db.add(db_cat)

    # 2. Products (16 items)
    products_data = [
      {
        "id": "p101",
        "name": "Ube Halaya Layer Cake",
        "category_id": "cakes",
        "price": 1250.0,
        "cost_price": 520.0,
        "image": "https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=700&q=80",
        "description": "Four decadent tiers of sponge cake folded with real Bohol purple yam, layered with silky ube mousse and whipped macapuno cream.",
        "short_description": "Four decadent tiers folded with real Bohol purple yam & macapuno cream.",
        "allergens_json": json.dumps(["Dairy", "Eggs", "Gluten"]),
        "badge": "Signature",
        "is_featured": True,
        "rating": 4.95,
        "sizes_json": json.dumps([
          {"name": "6-inch (6-8 pax)", "priceDelta": 0},
          {"name": "8-inch (10-14 pax)", "priceDelta": 450},
          {"name": "10-inch (16-20 pax)", "priceDelta": 900}
        ]),
        "in_stock": True,
        "stock_quantity": 25
      },
      {
        "id": "p102",
        "name": "Belgian Dark Chocolate Truffle Cake",
        "category_id": "cakes",
        "price": 1450.0,
        "cost_price": 600.0,
        "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=700&q=80",
        "description": "70% single-origin Callebaut dark chocolate ganache enrobing moist flourless sponge, finished with cocoa nibs and gold dust.",
        "short_description": "70% single-origin dark chocolate ganache over moist sponge.",
        "allergens_json": json.dumps(["Dairy", "Eggs", "Soy"]),
        "badge": "Bestseller",
        "is_featured": True,
        "rating": 4.9,
        "sizes_json": json.dumps([
          {"name": "6-inch", "priceDelta": 0},
          {"name": "8-inch", "priceDelta": 500}
        ]),
        "in_stock": True,
        "stock_quantity": 18
      },
      {
        "id": "p103",
        "name": "Mango Cloud Chiffon",
        "category_id": "cakes",
        "price": 1150.0,
        "cost_price": 480.0,
        "image": "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=700&q=80",
        "description": "Featherlight vanilla chiffon crowned with fresh Guimaras mango florets and light Madagascar vanilla diplomat cream.",
        "short_description": "Featherlight vanilla chiffon crowned with sweet Guimaras mangoes.",
        "allergens_json": json.dumps(["Dairy", "Eggs", "Gluten"]),
        "badge": "Fresh",
        "is_featured": False,
        "rating": 4.85,
        "sizes_json": json.dumps([
          {"name": "7-inch", "priceDelta": 0},
          {"name": "9-inch", "priceDelta": 400}
        ]),
        "in_stock": True,
        "stock_quantity": 15
      },
      {
        "id": "p104",
        "name": "Burnt Basque Cheesecake",
        "category_id": "cakes",
        "price": 980.0,
        "cost_price": 410.0,
        "image": "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=700&q=80",
        "description": "Caramelized deeply on top with a silky molten cream cheese custard center and a hint of organic lemon zest.",
        "short_description": "Caramelized deeply on top with a silky molten cream cheese center.",
        "allergens_json": json.dumps(["Dairy", "Eggs"]),
        "badge": "Chef Choice",
        "is_featured": True,
        "rating": 4.9,
        "sizes_json": json.dumps([
          {"name": "6-inch Whole", "priceDelta": 0},
          {"name": "8-inch Whole", "priceDelta": 450}
        ]),
        "in_stock": True,
        "stock_quantity": 30
      },
      {
        "id": "p201",
        "name": "36-Hour Country Sourdough Batard",
        "category_id": "breads",
        "price": 280.0,
        "cost_price": 95.0,
        "image": "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=700&q=80",
        "description": "Slow cold-fermented for 36 hours using our 6-year-old wild starter, dark blistered crust, and open airy crumb.",
        "short_description": "Slow fermented with our 6-year wild starter, dark blistered crust.",
        "allergens_json": json.dumps(["Gluten"]),
        "badge": "Artisan",
        "is_featured": True,
        "rating": 4.95,
        "sizes_json": json.dumps([
          {"name": "Whole Loaf (750g)", "priceDelta": 0},
          {"name": "Sliced (750g)", "priceDelta": 10}
        ]),
        "in_stock": True,
        "stock_quantity": 40
      },
      {
        "id": "p202",
        "name": "Rosemary & Olive Oil Focaccia",
        "category_id": "breads",
        "price": 320.0,
        "cost_price": 110.0,
        "image": "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=700&q=80",
        "description": "Pillowy Italian focaccia steeped in cold-pressed extra virgin olive oil, fresh rosemary sprigs, and Maldon sea salt flakes.",
        "short_description": "Pillowy focaccia with EVOO, fresh garden rosemary & Maldon sea salt.",
        "allergens_json": json.dumps(["Gluten"]),
        "badge": "Fresh Baked",
        "is_featured": False,
        "rating": 4.8,
        "sizes_json": json.dumps([
          {"name": "Half Slab", "priceDelta": 0},
          {"name": "Full Slab", "priceDelta": 260}
        ]),
        "in_stock": True,
        "stock_quantity": 20
      },
      {
        "id": "p301",
        "name": "Traditional French Croissant",
        "category_id": "pastries",
        "price": 140.0,
        "cost_price": 45.0,
        "image": "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=700&q=80",
        "description": "32 delicate laminated layers of French Beurre d'Isigny AOC butter, crisp honeycomb interior, golden baked.",
        "short_description": "32 laminated layers with French Beurre d'Isigny AOC butter.",
        "allergens_json": json.dumps(["Dairy", "Gluten"]),
        "badge": "Bestseller",
        "is_featured": True,
        "rating": 4.9,
        "sizes_json": json.dumps([
          {"name": "Single Piece", "priceDelta": 0},
          {"name": "Box of 4 (-10%)", "priceDelta": 380}
        ]),
        "in_stock": True,
        "stock_quantity": 60
      },
      {
        "id": "p302",
        "name": "Pain au Chocolat",
        "category_id": "pastries",
        "price": 165.0,
        "cost_price": 55.0,
        "image": "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=700&q=80",
        "description": "Buttery laminated dough wrapped around two batons of Valrhona 55% semi-sweet dark chocolate.",
        "short_description": "Buttery croissant pastry with two bars of Valrhona 55% dark chocolate.",
        "allergens_json": json.dumps(["Dairy", "Gluten", "Soy"]),
        "badge": "Popular",
        "is_featured": True,
        "rating": 4.88,
        "sizes_json": json.dumps([
          {"name": "Single Piece", "priceDelta": 0},
          {"name": "Box of 4", "priceDelta": 460}
        ]),
        "in_stock": True,
        "stock_quantity": 45
      },
      {
        "id": "p401",
        "name": "Salted Dark Chocolate Chunk Cookie",
        "category_id": "cookies",
        "price": 110.0,
        "cost_price": 38.0,
        "image": "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=700&q=80",
        "description": "Crisp browned-butter edges, gooey center with Callebaut chocolate chunks and coarse French fleur de sel.",
        "short_description": "Browned-butter cookie with puddle chocolate & French fleur de sel.",
        "allergens_json": json.dumps(["Dairy", "Eggs", "Gluten"]),
        "badge": "Signature",
        "is_featured": True,
        "rating": 4.94,
        "sizes_json": json.dumps([
          {"name": "Single Cookie (120g)", "priceDelta": 0},
          {"name": "Box of 6", "priceDelta": 520}
        ]),
        "in_stock": True,
        "stock_quantity": 50
      },
      {
        "id": "p501",
        "name": "Artisanal Cheese Ensaymada",
        "category_id": "specialty",
        "price": 185.0,
        "cost_price": 65.0,
        "image": "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=700&q=80",
        "description": "Brioche dough coiled with whipped butter, blanketed with generous aged Queso de Bola shavings and pure butter glaze.",
        "short_description": "Ultra soft brioche crowned with generous aged Queso de Bola shavings.",
        "allergens_json": json.dumps(["Dairy", "Eggs", "Gluten"]),
        "badge": "Classic Fav",
        "is_featured": True,
        "rating": 4.96,
        "sizes_json": json.dumps([
          {"name": "Single Jumbo (150g)", "priceDelta": 0},
          {"name": "Box of 6 (-15%)", "priceDelta": 820}
        ]),
        "in_stock": True,
        "stock_quantity": 35
      }
    ]

    for prod in products_data:
        db_prod = models.Product(
            id=prod["id"],
            name=prod["name"],
            category_id=prod["category_id"],
            price=prod["price"],
            cost_price=prod["cost_price"],
            image=prod["image"],
            description=prod["description"],
            short_description=prod["short_description"],
            allergens_json=prod["allergens_json"],
            badge=prod["badge"],
            is_featured=prod["is_featured"],
            rating=prod["rating"],
            sizes_json=prod["sizes_json"],
            in_stock=prod["in_stock"],
            stock_quantity=prod["stock_quantity"]
        )
        db.add(db_prod)

    # 3. Suppliers
    suppliers_data = [
      {"name": "Normandy European Dairy Imports", "contact_person": "Pierre Dupont", "email": "orders@normandydairy.ph", "phone": "+63 2 8812 4433", "address": "Mandaue City, Cebu", "lead_time_days": 4},
      {"name": "Bohol Purple Yam & Agriculture Co-op", "contact_person": "Santos Alcala", "email": "supply@boholyam.ph", "phone": "+63 38 501 8899", "address": "Tagbilaran City, Bohol", "lead_time_days": 3},
      {"name": "Universal Organic Mills Corp", "contact_person": "Grace Tan", "email": "sales@universalflour.ph", "phone": "+63 32 345 7788", "address": "Cebu South Port, Cebu City", "lead_time_days": 2}
    ]

    for s in suppliers_data:
        db_s = models.Supplier(name=s["name"], contact_person=s["contact_person"], email=s["email"], phone=s["phone"], address=s["address"], lead_time_days=s["lead_time_days"])
        db.add(db_s)
    db.flush()

    # 4. Inventory Items
    inventory_data = [
      {"item_name": "Organic Bread Flour T65", "category": "Flour & Grains", "unit": "kg", "current_stock": 250.0, "minimum_stock": 50.0, "unit_cost": 75.0, "supplier_id": 3},
      {"item_name": "French Cultured Butter 84% AOC", "category": "Dairy & Fats", "unit": "kg", "current_stock": 85.0, "minimum_stock": 20.0, "unit_cost": 480.0, "supplier_id": 1},
      {"item_name": "Pure Bohol Purple Yam Halaya", "category": "Fillings & Fruits", "unit": "kg", "current_stock": 45.0, "minimum_stock": 15.0, "unit_cost": 320.0, "supplier_id": 2},
      {"item_name": "Callebaut 70% Dark Chocolate Callets", "category": "Chocolate & Cocoa", "unit": "kg", "current_stock": 60.0, "minimum_stock": 15.0, "unit_cost": 650.0, "supplier_id": 1},
      {"item_name": "Aged Queso de Bola Shavings", "category": "Dairy & Fats", "unit": "kg", "current_stock": 25.0, "minimum_stock": 10.0, "unit_cost": 550.0, "supplier_id": 1},
      {"item_name": "Fresh Free-Range Eggs", "category": "Eggs & Dairy", "unit": "trays", "current_stock": 40.0, "minimum_stock": 10.0, "unit_cost": 220.0, "supplier_id": 2},
      {"item_name": "Kraft Bakery Box (8x8x4)", "category": "Packaging", "unit": "pcs", "current_stock": 350.0, "minimum_stock": 100.0, "unit_cost": 18.0, "supplier_id": 3}
    ]

    for inv in inventory_data:
        db_inv = models.InventoryItem(
            item_name=inv["item_name"],
            category=inv["category"],
            unit=inv["unit"],
            current_stock=inv["current_stock"],
            minimum_stock=inv["minimum_stock"],
            unit_cost=inv["unit_cost"],
            supplier_id=inv["supplier_id"]
        )
        db.add(db_inv)

    # 5. Default 5 Role Users
    default_users = [
      {"name": "Admin Maria", "email": "admin@fredybills.ph", "role": "Administrator", "phone": "+63 917 555 6677", "address": "Executive Office, Cebu City"},
      {"name": "Elena Morales", "email": "counter@fredybills.ph", "role": "Counter Staff", "phone": "+63 918 222 3344", "address": "Mabini Branch, Cebu City"},
      {"name": "Chef Fredy", "email": "baker@fredybills.ph", "role": "Baker", "phone": "+63 917 333 4455", "address": "Central Kitchen, Cebu City"},
      {"name": "Rico Dalisay", "email": "delivery@fredybills.ph", "role": "Delivery Staff", "phone": "+63 919 444 5566", "address": "Cebu City Logistics Hub"},
      {"name": "Juan Dela Cruz", "email": "customer@fredybills.ph", "role": "Customer", "phone": "+63 917 123 4567", "address": "Unit 12B, Horizon Tower, IT Park, Lahug, Cebu City"}
    ]

    for u in default_users:
        db_user = models.User(
            name=u["name"],
            email=u["email"],
            password_hash=get_password_hash("password123"),
            role=u["role"],
            phone=u["phone"],
            address=u["address"],
            is_active=True
        )
        db.add(db_user)

    # 6. Branches & Promos
    branches_data = [
      {"name": "Mabini Main Flagship", "address": "124 Mabini St, Cebu City", "phone": "+63 32 412 8891", "hours": "7:00 AM - 8:00 PM"},
      {"name": "IT Park Bakery & Cafe", "address": "G/F Skyrise 4, Cebu IT Park, Lahug", "phone": "+63 32 231 9900", "hours": "6:30 AM - 10:00 PM"},
      {"name": "Banilad Town Kitchen", "address": "Gov. Cuenco Ave, Banilad, Cebu City", "phone": "+63 32 344 7712", "hours": "7:00 AM - 7:30 PM"}
    ]
    for b in branches_data:
        db.add(models.Branch(name=b["name"], address=b["address"], phone=b["phone"], hours=b["hours"]))

    promos_data = [
      {"code": "FREDY10", "discount_percent": 10.0, "free_shipping": False, "name": "10% Welcome Bakery Offer"},
      {"code": "FREESHIP", "discount_percent": 0.0, "free_shipping": True, "name": "Free Delivery Discount"}
    ]
    for p in promos_data:
        db.add(models.PromoCode(code=p["code"], discount_percent=p["discount_percent"], free_shipping=p["free_shipping"], name=p["name"]))

    # 7. System Settings
    settings_data = [
      {"key": "store_name", "value": "Fredy Bills Artisan Bakery", "description": "Official business name"},
      {"key": "vat_rate", "value": "12.0", "description": "Value added tax percentage"},
      {"key": "delivery_fee_base", "value": "80.0", "description": "Base courier delivery fee in PHP"},
      {"key": "free_delivery_threshold", "value": "1500.0", "description": "Minimum order total for free delivery"},
      {"key": "order_auto_confirm", "value": "true", "description": "Automatically queue production on order placement"}
    ]
    for st in settings_data:
        db.add(models.SystemSetting(key=st["key"], value=st["value"], description=st["description"]))

    # 8. Sample Production Task & Initial Order
    db.flush()
    sample_order = models.Order(
        id="FB-8942",
        customer_name="Juan Dela Cruz",
        customer_email="customer@fredybills.ph",
        customer_phone="+63 917 123 4567",
        fulfillment="delivery",
        address="Unit 12B, Horizon Tower, IT Park, Lahug, Cebu City",
        branch_name="Mabini Main Flagship",
        payment_method="GCash",
        payment_status="Paid",
        status="preparing",
        status_step=3,
        subtotal=1530.0,
        discount=153.0,
        delivery_fee=0.0,
        total=1377.0,
        estimated_time="Estimated 35-45 mins",
        timeline_json=json.dumps([
            {"step": "Order Placed", "time": "08:15 AM", "done": True},
            {"step": "Confirmed by Bakery", "time": "08:17 AM", "done": True},
            {"step": "Preparing in Kitchen", "time": "08:25 AM", "active": True},
            {"step": "Ready for Dispatch", "time": "Pending", "done": False},
            {"step": "Out for Delivery", "time": "Pending", "done": False},
            {"step": "Delivered", "time": "Pending", "done": False}
        ]),
        notes="Please slice sourdough thinly"
    )
    db.add(sample_order)
    db.flush()

    db.add(models.OrderItem(order_id="FB-8942", product_id="p101", product_name="Ube Halaya Layer Cake (6-inch)", quantity=1, unit_price=1250.0, options_json="{}"))
    db.add(models.OrderItem(order_id="FB-8942", product_id="p201", product_name="36-Hour Country Sourdough Batard", quantity=1, unit_price=280.0, options_json="{}"))
    db.add(models.Payment(order_id="FB-8942", payment_method="GCash", amount=1377.0, status="Completed", reference_number="GCASH-984210", notes="Paid via E-Wallet"))
    db.add(models.SaleRecord(order_id="FB-8942", total_amount=1377.0, net_amount=1377.0, tax_amount=147.53, discount_amount=153.0, cost_amount=578.34, profit_amount=798.66))
    db.add(models.DeliveryRecord(order_id="FB-8942", delivery_staff_id=4, status="Assigned", customer_name="Juan Dela Cruz", customer_phone="+63 917 123 4567", delivery_address="Unit 12B, Horizon Tower, IT Park, Lahug, Cebu City"))
    db.add(models.ProductionTask(task_code="PRD-101", product_id="p101", product_name="Ube Halaya Layer Cake", target_quantity=4, completed_quantity=1, status="Preparing", assigned_baker_id=3, scheduled_date="Today", notes="Morning celebration batch"))

    db.commit()
    print("[SEED] Enterprise Database Seeding Complete!")
