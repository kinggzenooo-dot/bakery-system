import enum
from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, Enum
)
from sqlalchemy.orm import relationship
from backend.app.database import Base

class RoleEnum(str, enum.Enum):
    CUSTOMER = "Customer"
    COUNTER_STAFF = "Counter Staff"
    BAKER = "Baker"
    DELIVERY_STAFF = "Delivery Staff"
    ADMINISTRATOR = "Administrator"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email = Column(String(120), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    name = Column(String(120), nullable=False)
    role = Column(String(50), default=RoleEnum.CUSTOMER.value, nullable=False)
    phone = Column(String(50), default="")
    address = Column(Text, default="")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    orders = relationship("Order", back_populates="user")
    assigned_productions = relationship("ProductionTask", back_populates="assigned_baker")
    assigned_deliveries = relationship("DeliveryRecord", back_populates="delivery_staff")
    notifications = relationship("Notification", back_populates="user")

class Category(Base):
    __tablename__ = "categories"

    id = Column(String(50), primary_key=True, index=True) # e.g. "cakes", "breads"
    name = Column(String(100), nullable=False)
    description = Column(Text, default="")
    image = Column(String(500), default="")
    is_active = Column(Boolean, default=True)

    products = relationship("Product", back_populates="category")

class Product(Base):
    __tablename__ = "products"

    id = Column(String(50), primary_key=True, index=True) # e.g. "p101"
    name = Column(String(150), nullable=False, index=True)
    category_id = Column(String(50), ForeignKey("categories.id"), nullable=False)
    price = Column(Float, nullable=False)
    cost_price = Column(Float, default=0.0)
    image = Column(String(500), default="")
    description = Column(Text, default="")
    short_description = Column(String(255), default="")
    allergens_json = Column(Text, default="[]") # JSON list
    badge = Column(String(50), default="")
    is_featured = Column(Boolean, default=False)
    rating = Column(Float, default=5.0)
    sizes_json = Column(Text, default="[]") # JSON list of size options
    in_stock = Column(Boolean, default=True)
    stock_quantity = Column(Integer, default=50)
    # Recipe: JSON list of {item_name, quantity, unit} used as default for production tasks
    recipe_json = Column(Text, default="[]")

    category = relationship("Category", back_populates="products")
    production_tasks = relationship("ProductionTask", back_populates="product")

class Order(Base):
    __tablename__ = "orders"

    id = Column(String(50), primary_key=True, index=True) # e.g. "FB-8942"
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    customer_name = Column(String(120), nullable=False)
    customer_email = Column(String(120), nullable=False)
    customer_phone = Column(String(50), nullable=False)
    fulfillment = Column(String(50), default="delivery") # delivery or pickup
    address = Column(Text, default="")
    branch_name = Column(String(120), default="Mabini Main Flagship")
    payment_method = Column(String(80), default="GCash")
    payment_status = Column(String(50), default="Pending") # Paid, Pending, Refunded
    status = Column(String(50), default="confirmed") # confirmed, preparing, ready, out_for_delivery, delivered, cancelled
    status_step = Column(Integer, default=2)
    subtotal = Column(Float, default=0.0)
    discount = Column(Float, default=0.0)
    delivery_fee = Column(Float, default=0.0)
    total = Column(Float, default=0.0)
    estimated_time = Column(String(100), default="Estimated 45-60 mins")
    timeline_json = Column(Text, default="[]")
    notes = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    payments = relationship("Payment", back_populates="order", cascade="all, delete-orphan")
    delivery = relationship("DeliveryRecord", back_populates="order", uselist=False, cascade="all, delete-orphan")
    sale_record = relationship("SaleRecord", back_populates="order", uselist=False, cascade="all, delete-orphan")

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, autoincrement=True)
    order_id = Column(String(50), ForeignKey("orders.id"), nullable=False)
    product_id = Column(String(50), nullable=False)
    product_name = Column(String(150), nullable=False)
    quantity = Column(Integer, default=1)
    unit_price = Column(Float, nullable=False)
    options_json = Column(Text, default="{}")

    order = relationship("Order", back_populates="items")

class InventoryItem(Base):
    __tablename__ = "inventory_items"

    id = Column(Integer, primary_key=True, autoincrement=True)
    item_name = Column(String(150), nullable=False, index=True)
    category = Column(String(80), default="Baking Ingredients") # Flour, Butter, Sugar, Dairy, Packaging, etc.
    unit = Column(String(30), default="kg") # kg, L, pcs, boxes
    current_stock = Column(Float, default=0.0)
    minimum_stock = Column(Float, default=10.0)
    unit_cost = Column(Float, default=0.0)
    supplier_id = Column(Integer, ForeignKey("suppliers.id"), nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    supplier = relationship("Supplier", back_populates="inventory_items")
    transactions = relationship("InventoryTransaction", back_populates="inventory_item", cascade="all, delete-orphan")

class InventoryTransaction(Base):
    __tablename__ = "inventory_transactions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    inventory_item_id = Column(Integer, ForeignKey("inventory_items.id"), nullable=False)
    transaction_type = Column(String(50), nullable=False) # IN (Purchase/Restock), OUT (Sale/Deduction), WASTE, PRODUCTION_USAGE
    quantity = Column(Float, nullable=False)
    unit_price = Column(Float, default=0.0)
    reference_id = Column(String(100), default="") # PO-101, PRD-201, etc.
    notes = Column(Text, default="")
    created_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    inventory_item = relationship("InventoryItem", back_populates="transactions")

class ProductionTask(Base):
    __tablename__ = "production_tasks"

    id = Column(Integer, primary_key=True, autoincrement=True)
    task_code = Column(String(50), unique=True, index=True, nullable=False) # e.g. "PRD-101"
    product_id = Column(String(50), ForeignKey("products.id"), nullable=False)
    product_name = Column(String(150), nullable=False)
    target_quantity = Column(Integer, default=1)
    completed_quantity = Column(Integer, default=0)
    status = Column(String(50), default="Scheduled") # Scheduled, Preparing, Baking, Cooling, Ready, Completed
    assigned_baker_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    scheduled_date = Column(String(50), default="")
    notes = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    product = relationship("Product", back_populates="production_tasks")
    assigned_baker = relationship("User", back_populates="assigned_productions")
    ingredients = relationship("ProductionIngredient", back_populates="production_task", cascade="all, delete-orphan")

class ProductionIngredient(Base):
    __tablename__ = "production_ingredients"

    id = Column(Integer, primary_key=True, autoincrement=True)
    production_task_id = Column(Integer, ForeignKey("production_tasks.id"), nullable=False)
    inventory_item_id = Column(Integer, ForeignKey("inventory_items.id"), nullable=False)
    item_name = Column(String(150), nullable=False)
    required_quantity = Column(Float, default=1.0)
    actual_used_quantity = Column(Float, default=1.0)
    unit = Column(String(30), default="kg")

    production_task = relationship("ProductionTask", back_populates="ingredients")

class DeliveryRecord(Base):
    __tablename__ = "deliveries"

    id = Column(Integer, primary_key=True, autoincrement=True)
    order_id = Column(String(50), ForeignKey("orders.id"), unique=True, nullable=False)
    delivery_staff_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    status = Column(String(50), default="Pending") # Pending, Assigned, Accepted, Out for Delivery, Delivered, Failed
    customer_name = Column(String(120), nullable=False)
    customer_phone = Column(String(50), nullable=False)
    delivery_address = Column(Text, nullable=False)
    failure_reason = Column(Text, default="")
    proof_note = Column(Text, default="")
    assigned_at = Column(DateTime, nullable=True)
    delivered_at = Column(DateTime, nullable=True)

    order = relationship("Order", back_populates="delivery")
    delivery_staff = relationship("User", back_populates="assigned_deliveries")

class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(150), nullable=False, index=True)
    contact_person = Column(String(120), default="")
    email = Column(String(120), default="")
    phone = Column(String(50), default="")
    address = Column(Text, default="")
    lead_time_days = Column(Integer, default=3)
    is_active = Column(Boolean, default=True)

    inventory_items = relationship("InventoryItem", back_populates="supplier")
    purchase_orders = relationship("PurchaseOrder", back_populates="supplier")

class PurchaseOrder(Base):
    __tablename__ = "purchase_orders"

    id = Column(Integer, primary_key=True, autoincrement=True)
    po_number = Column(String(50), unique=True, index=True, nullable=False) # e.g. "PO-2026-01"
    supplier_id = Column(Integer, ForeignKey("suppliers.id"), nullable=False)
    status = Column(String(50), default="Draft") # Draft, Submitted, Received, Cancelled
    total_amount = Column(Float, default=0.0)
    expected_delivery_date = Column(String(50), default="")
    received_date = Column(String(50), default="")
    notes = Column(Text, default="")
    created_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    supplier = relationship("Supplier", back_populates="purchase_orders")
    items = relationship("PurchaseOrderItem", back_populates="purchase_order", cascade="all, delete-orphan")

class PurchaseOrderItem(Base):
    __tablename__ = "purchase_order_items"

    id = Column(Integer, primary_key=True, autoincrement=True)
    purchase_order_id = Column(Integer, ForeignKey("purchase_orders.id"), nullable=False)
    inventory_item_id = Column(Integer, ForeignKey("inventory_items.id"), nullable=False)
    item_name = Column(String(150), nullable=False)
    quantity_ordered = Column(Float, default=1.0)
    quantity_received = Column(Float, default=0.0)
    unit_cost = Column(Float, default=0.0)
    total_cost = Column(Float, default=0.0)

    purchase_order = relationship("PurchaseOrder", back_populates="items")

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, autoincrement=True)
    order_id = Column(String(50), ForeignKey("orders.id"), nullable=False)
    payment_method = Column(String(80), nullable=False) # Cash, GCash, Card
    amount = Column(Float, nullable=False)
    status = Column(String(50), default="Pending") # Pending, Completed, Refunded
    reference_number = Column(String(120), default="")
    notes = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow)

    order = relationship("Order", back_populates="payments")

class SaleRecord(Base):
    __tablename__ = "sales_records"

    id = Column(Integer, primary_key=True, autoincrement=True)
    order_id = Column(String(50), ForeignKey("orders.id"), unique=True, nullable=False)
    total_amount = Column(Float, default=0.0)
    net_amount = Column(Float, default=0.0)
    tax_amount = Column(Float, default=0.0)
    discount_amount = Column(Float, default=0.0)
    cost_amount = Column(Float, default=0.0)
    profit_amount = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    order = relationship("Order", back_populates="sale_record")

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    role = Column(String(50), default="") # Can target specific role e.g. "Baker", "Admin"
    title = Column(String(150), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(50), default="system") # order, production, delivery, inventory, system
    is_read = Column(Boolean, default=False)
    link = Column(String(200), default="")
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="notifications")

class SystemSetting(Base):
    __tablename__ = "system_settings"

    id = Column(Integer, primary_key=True, autoincrement=True)
    key = Column(String(100), unique=True, index=True, nullable=False)
    value = Column(Text, default="")
    description = Column(String(255), default="")
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Branch(Base):
    __tablename__ = "branches"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(120), nullable=False)
    address = Column(String(255), nullable=False)
    phone = Column(String(50), default="")
    hours = Column(String(100), default="7:00 AM - 8:00 PM")

class PromoCode(Base):
    __tablename__ = "promo_codes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    code = Column(String(50), unique=True, index=True, nullable=False)
    discount_percent = Column(Float, default=0.0)
    free_shipping = Column(Boolean, default=False)
    name = Column(String(120), default="")
    is_active = Column(Boolean, default=True)
