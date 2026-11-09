from typing import List, Dict, Any
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app import models, schemas
from app.auth import require_admin, require_staff

router = APIRouter(prefix="/api", tags=["Reports & Payments"])

@router.get("/reports/sales", response_model=schemas.SalesSummaryReport)
def get_sales_report(db: Session = Depends(get_db), admin: models.User = Depends(require_admin)):
    orders = db.query(models.Order).filter(models.Order.status != "cancelled").all()
    
    total_revenue = sum(o.total for o in orders)
    total_orders = len(orders)
    total_customers = db.query(models.User).filter(models.User.role == "Customer").count()
    
    # Calculate product items sold
    order_items = db.query(models.OrderItem).all()
    total_products_sold = sum(i.quantity for i in order_items)

    # Product popularity aggregation
    prod_counts: Dict[str, Dict[str, Any]] = {}
    for item in order_items:
        if item.product_name not in prod_counts:
            prod_counts[item.product_name] = {"name": item.product_name, "units_sold": 0, "revenue": 0.0}
        prod_counts[item.product_name]["units_sold"] += item.quantity
        prod_counts[item.product_name]["revenue"] += item.quantity * item.unit_price

    top_products = sorted(list(prod_counts.values()), key=lambda x: x["units_sold"], reverse=True)[:5]

    # Category Breakdown
    cat_revenue: Dict[str, float] = {
        "Artisanal Cakes": 0.0,
        "Artisan Breads": 0.0,
        "Viennoiserie & Pastries": 0.0,
        "Cookies & Confections": 0.0,
        "Specialty & Filipino": 0.0
    }
    for item in order_items:
        prod = db.query(models.Product).filter(models.Product.id == item.product_id).first()
        if prod and prod.category:
            c_name = prod.category.name
            cat_revenue[c_name] = cat_revenue.get(c_name, 0.0) + (item.quantity * item.unit_price)

    sales_by_cat = [{"category": k, "revenue": v} for k, v in cat_revenue.items() if v > 0]

    # Daily sales timeline (last 7 days)
    daily_sales = []
    for i in range(6, -1, -1):
        target_date = datetime.utcnow().date() - timedelta(days=i)
        day_orders = [o for o in orders if o.created_at and o.created_at.date() == target_date]
        day_rev = sum(o.total for o in day_orders)
        daily_sales.append({
            "date": target_date.strftime("%b %d"),
            "revenue": day_rev,
            "orders": len(day_orders)
        })

    # Recent completed payments
    recent_transactions = [
        {
            "id": o.id,
            "customer": o.customer_name,
            "amount": o.total,
            "payment_method": o.payment_method,
            "status": o.payment_status,
            "date": o.created_at.strftime("%Y-%m-%d %I:%M %p") if o.created_at else "Today"
        } for o in orders[:10]
    ]

    net_profit = total_revenue * 0.58 # 58% estimated gross profit margin

    return schemas.SalesSummaryReport(
        total_revenue=total_revenue,
        total_orders=total_orders,
        total_customers=max(total_customers, len(set(o.customer_email for o in orders))),
        total_products_sold=total_products_sold,
        net_profit=net_profit,
        daily_sales=daily_sales,
        top_selling_products=top_products,
        sales_by_category=sales_by_cat,
        recent_transactions=recent_transactions
    )

@router.get("/payments", response_model=List[schemas.PaymentResponse])
def get_payments(db: Session = Depends(get_db), staff: models.User = Depends(require_staff)):
    payments = db.query(models.Payment).order_by(models.Payment.id.desc()).all()
    return payments
