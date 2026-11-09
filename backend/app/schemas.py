from typing import List, Optional, Any, Dict
from pydantic import BaseModel, EmailStr
from datetime import datetime

# --- Auth & User Management Schemas ---
class UserLogin(BaseModel):
    email: EmailStr
    password: str
    role: Optional[str] = "Customer"

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: Optional[str] = "Customer"
    phone: Optional[str] = ""
    address: Optional[str] = ""

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str # Administrator, Counter Staff, Baker, Delivery Staff, Customer
    phone: Optional[str] = ""
    address: Optional[str] = ""
    is_active: Optional[bool] = True

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    role: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    is_active: Optional[bool] = None

class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    role: str
    phone: str
    address: str
    is_active: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# --- Category Schemas ---
class CategoryCreate(BaseModel):
    id: str
    name: str
    description: Optional[str] = ""
    image: Optional[str] = ""

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    is_active: Optional[bool] = None

class CategoryResponse(BaseModel):
    id: str
    name: str
    description: str
    image: str
    is_active: bool

    class Config:
        from_attributes = True

# --- Product Schemas ---
# Each recipe item: {"item_name": "All-purpose Flour", "quantity": 0.5, "unit": "kg"}
class ProductRecipeItem(BaseModel):
    item_name: str
    quantity: float
    unit: str = "kg"

class ProductCreate(BaseModel):
    id: str
    name: str
    category_id: str
    price: float
    cost_price: Optional[float] = 0.0
    image: Optional[str] = ""
    description: Optional[str] = ""
    short_description: Optional[str] = ""
    allergens: Optional[List[str]] = []
    badge: Optional[str] = ""
    is_featured: Optional[bool] = False
    rating: Optional[float] = 5.0
    sizes: Optional[List[Dict[str, Any]]] = []
    in_stock: Optional[bool] = True
    stock_quantity: Optional[int] = 50
    recipe: Optional[List[ProductRecipeItem]] = []

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category_id: Optional[str] = None
    price: Optional[float] = None
    cost_price: Optional[float] = None
    image: Optional[str] = None
    description: Optional[str] = None
    short_description: Optional[str] = None
    allergens: Optional[List[str]] = None
    badge: Optional[str] = None
    is_featured: Optional[bool] = None
    rating: Optional[float] = None
    sizes: Optional[List[Dict[str, Any]]] = None
    in_stock: Optional[bool] = None
    stock_quantity: Optional[int] = None
    recipe: Optional[List[ProductRecipeItem]] = None

class ProductResponse(BaseModel):
    id: str
    name: str
    category: str
    category_id: str
    price: float
    cost_price: float
    image: str
    description: str
    shortDescription: str
    allergens: List[str]
    badge: Optional[str] = ""
    is_featured: bool
    rating: float
    customization: Optional[Dict[str, Any]] = None
    in_stock: bool
    stock_quantity: int
    recipe: Optional[List[Dict[str, Any]]] = []

# --- Inventory Schemas ---
class InventoryItemCreate(BaseModel):
    item_name: str
    category: str = "Baking Ingredients"
    unit: str = "kg"
    current_stock: float = 0.0
    minimum_stock: float = 10.0
    unit_cost: float = 0.0
    supplier_id: Optional[int] = None

class InventoryItemUpdate(BaseModel):
    item_name: Optional[str] = None
    category: Optional[str] = None
    unit: Optional[str] = None
    current_stock: Optional[float] = None
    minimum_stock: Optional[float] = None
    unit_cost: Optional[float] = None
    supplier_id: Optional[int] = None

class InventoryTransactionCreate(BaseModel):
    inventory_item_id: int
    transaction_type: str # IN, OUT, WASTE, PRODUCTION_USAGE
    quantity: float
    unit_price: Optional[float] = 0.0
    reference_id: Optional[str] = ""
    notes: Optional[str] = ""

class InventoryItemResponse(BaseModel):
    id: int
    item_name: str
    category: str
    unit: str
    current_stock: float
    minimum_stock: float
    unit_cost: float
    supplier_id: Optional[int] = None
    supplier_name: Optional[str] = None
    is_low_stock: bool = False
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# --- Production Schemas ---
class ProductionIngredientItem(BaseModel):
    inventory_item_id: int
    item_name: str
    required_quantity: float
    actual_used_quantity: Optional[float] = None
    unit: str = "kg"

class ProductionTaskCreate(BaseModel):
    product_id: str
    product_name: str
    target_quantity: int = 1
    assigned_baker_id: Optional[int] = None
    scheduled_date: Optional[str] = ""
    notes: Optional[str] = ""
    ingredients: Optional[List[ProductionIngredientItem]] = []

class ProductionStatusUpdate(BaseModel):
    status: str # Scheduled, Preparing, Baking, Cooling, Ready, Completed
    completed_quantity: Optional[int] = None
    notes: Optional[str] = None
    actual_ingredients_used: Optional[List[ProductionIngredientItem]] = None

class ProductionTaskResponse(BaseModel):
    id: int
    task_code: str
    product_id: str
    product_name: str
    target_quantity: int
    completed_quantity: int
    status: str
    assigned_baker_id: Optional[int] = None
    baker_name: Optional[str] = None
    scheduled_date: str
    notes: str
    ingredients: List[Dict[str, Any]]
    created_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

# --- Delivery Schemas ---
class DeliveryStatusUpdate(BaseModel):
    status: str # Assigned, Accepted, Out for Delivery, Delivered, Failed
    delivery_staff_id: Optional[int] = None
    failure_reason: Optional[str] = None
    proof_note: Optional[str] = None

class DeliveryResponse(BaseModel):
    id: int
    order_id: str
    delivery_staff_id: Optional[int] = None
    delivery_staff_name: Optional[str] = None
    status: str
    customer_name: str
    customer_phone: str
    delivery_address: str
    failure_reason: Optional[str] = None
    proof_note: Optional[str] = None
    assigned_at: Optional[datetime] = None
    delivered_at: Optional[datetime] = None

# --- Supplier & Purchase Order Schemas ---
class SupplierCreate(BaseModel):
    name: str
    contact_person: Optional[str] = ""
    email: Optional[str] = ""
    phone: Optional[str] = ""
    address: Optional[str] = ""
    lead_time_days: Optional[int] = 3

class SupplierResponse(BaseModel):
    id: int
    name: str
    contact_person: str
    email: str
    phone: str
    address: str
    lead_time_days: int
    is_active: bool

    class Config:
        from_attributes = True

class PurchaseOrderItemCreate(BaseModel):
    inventory_item_id: int
    item_name: str
    quantity_ordered: float
    unit_cost: float

class PurchaseOrderCreate(BaseModel):
    supplier_id: int
    expected_delivery_date: Optional[str] = ""
    notes: Optional[str] = ""
    items: List[PurchaseOrderItemCreate]

class PurchaseOrderResponse(BaseModel):
    id: int
    po_number: str
    supplier_id: int
    supplier_name: str
    status: str
    total_amount: float
    expected_delivery_date: str
    received_date: Optional[str] = ""
    notes: str
    items: List[Dict[str, Any]]
    created_at: Optional[datetime] = None

# --- Order Schemas ---
class OrderItemCreate(BaseModel):
    id: str
    name: str
    quantity: int
    price: float
    options: Optional[Dict[str, Any]] = {}

class OrderCreate(BaseModel):
    customerName: str
    customerEmail: EmailStr
    customerPhone: str
    fulfillmentType: str = "delivery"
    address: Optional[str] = ""
    branchName: Optional[str] = ""
    paymentMethod: str = "GCash"
    items: List[OrderItemCreate]
    subtotal: float
    discount: float = 0.0
    deliveryFee: float = 0.0
    total: float
    notes: Optional[str] = ""

class OrderResponse(BaseModel):
    id: str
    date: str
    status: str
    statusStep: int
    fulfillment: str
    customerName: str
    email: str
    phone: str
    address: str
    branchName: Optional[str] = "Mabini Main Flagship"
    paymentMethod: str
    paymentStatus: str
    items: List[Dict[str, Any]]
    subtotal: float
    discount: float
    deliveryFee: float
    total: float
    estimatedTime: str
    timeline: List[Dict[str, Any]]
    notes: Optional[str] = ""

class OrderStatusUpdate(BaseModel):
    status: str
    status_step: Optional[int] = None
    note: Optional[str] = None

# --- Payment & Sales Reports Schemas ---
class PaymentCreate(BaseModel):
    order_id: str
    payment_method: str
    amount: float
    reference_number: Optional[str] = ""
    notes: Optional[str] = ""

class PaymentResponse(BaseModel):
    id: int
    order_id: str
    payment_method: str
    amount: float
    status: str
    reference_number: str
    created_at: Optional[datetime] = None

class SalesSummaryReport(BaseModel):
    total_revenue: float
    total_orders: int
    total_customers: int
    total_products_sold: int
    net_profit: float
    daily_sales: List[Dict[str, Any]]
    top_selling_products: List[Dict[str, Any]]
    sales_by_category: List[Dict[str, Any]]
    recent_transactions: List[Dict[str, Any]]

# --- Notification & Setting Schemas ---
class NotificationCreate(BaseModel):
    user_id: Optional[int] = None
    role: Optional[str] = ""
    title: str
    message: str
    type: str = "system"
    link: Optional[str] = ""

class NotificationResponse(BaseModel):
    id: int
    title: str
    message: str
    type: str
    is_read: bool
    link: str
    created_at: Optional[datetime] = None

class SettingUpdate(BaseModel):
    key: str
    value: str
    description: Optional[str] = ""

class BranchResponse(BaseModel):
    id: int
    name: str
    address: str
    phone: str
    hours: str

    class Config:
        from_attributes = True

class PromoValidateRequest(BaseModel):
    code: str

class PromoResponse(BaseModel):
    valid: bool
    code: Optional[str] = None
    discountPercent: Optional[float] = 0.0
    freeShipping: Optional[bool] = False
    name: Optional[str] = None
    message: Optional[str] = None
