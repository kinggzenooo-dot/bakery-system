import json
import random
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas
from app.auth import get_current_user, require_staff

router = APIRouter(prefix="/api/orders", tags=["Orders & Live Tracking"])

def build_order_response(order: models.Order) -> schemas.OrderResponse:
    try:
        timeline = json.loads(order.timeline_json) if order.timeline_json else []
    except Exception:
        timeline = []

    items = []
    for item in order.items:
        try:
            options = json.loads(item.options_json) if item.options_json else {}
        except Exception:
            options = {}
        items.append({
            "id": item.product_id,
            "name": item.product_name,
            "quantity": item.quantity,
            "price": item.unit_price,
            "options": options
        })

    return schemas.OrderResponse(
        id=order.id,
        date=order.created_at.isoformat() if order.created_at else datetime.utcnow().isoformat(),
        status=order.status,
        statusStep=order.status_step,
        fulfillment=order.fulfillment,
        customerName=order.customer_name,
        email=order.customer_email,
        phone=order.customer_phone,
        address=order.address,
        branchName=order.branch_name or "Mabini Main Flagship",
        paymentMethod=order.payment_method,
        paymentStatus=order.payment_status,
        items=items,
        subtotal=order.subtotal,
        discount=order.discount,
        deliveryFee=order.delivery_fee,
        total=order.total,
        estimatedTime=order.estimated_time,
        timeline=timeline,
        notes=order.notes or ""
    )

@router.post("", response_model=schemas.OrderResponse)
def create_order(
    order_data: schemas.OrderCreate, 
    db: Session = Depends(get_db),
    user: Optional[models.User] = Depends(get_current_user)
):
    # 1. Unique Order ID
    order_id = f"FB-{random.randint(1000, 9999)}"
    while db.query(models.Order).filter(models.Order.id == order_id).first():
        order_id = f"FB-{random.randint(1000, 9999)}"

    now = datetime.utcnow()
    now_str = now.strftime("%I:%M %p")
    est_time = "Estimated 45-60 mins" if order_data.fulfillmentType == "delivery" else "Ready in 30 mins"

    timeline = [
        {"step": "Order Placed", "time": now_str, "done": True},
        {"step": "Confirmed by Bakery", "time": "Just Now", "active": True},
        {"step": "Preparing in Kitchen", "time": "Pending", "done": False},
        {"step": "Ready for Pickup/Dispatch", "time": "Pending", "done": False},
        {"step": "Out for Delivery", "time": "Pending", "done": False},
        {"step": "Delivered", "time": "Pending", "done": False}
    ]

    addr = order_data.address if order_data.fulfillmentType == "delivery" else (order_data.branchName or "Mabini Main Flagship")
    pay_status = "Paid" if order_data.paymentMethod in ["GCash", "Credit / Debit Card"] else "Pending"

    new_order = models.Order(
        id=order_id,
        user_id=user.id if user else None,
        customer_name=order_data.customerName,
        customer_email=order_data.customerEmail.lower(),
        customer_phone=order_data.customerPhone,
        fulfillment=order_data.fulfillmentType,
        address=addr,
        branch_name=order_data.branchName or "Mabini Main Flagship",
        payment_method=order_data.paymentMethod,
        payment_status=pay_status,
        status="confirmed",
        status_step=2,
        subtotal=order_data.subtotal,
        discount=order_data.discount,
        delivery_fee=order_data.deliveryFee,
        total=order_data.total,
        estimated_time=est_time,
        timeline_json=json.dumps(timeline),
        notes=order_data.notes or "",
        created_at=now
    )
    db.add(new_order)
    db.flush()

    # 2. Add Order Items
    for item in order_data.items:
        order_item = models.OrderItem(
            order_id=order_id,
            product_id=item.id,
            product_name=item.name,
            quantity=item.quantity,
            unit_price=item.price,
            options_json=json.dumps(item.options or {})
        )
        db.add(order_item)

        # 3. Create Linked Production Task for Kitchen Queue
        baker = db.query(models.User).filter(models.User.role == "Baker").first()
        prod_task = models.ProductionTask(
            task_code=f"PRD-{random.randint(100, 999)}",
            product_id=item.id,
            product_name=item.name,
            target_quantity=item.quantity,
            completed_quantity=0,
            status="Scheduled",
            assigned_baker_id=baker.id if baker else None,
            scheduled_date=now.strftime("%Y-%m-%d"),
            notes=f"Order #{order_id} for {order_data.customerName}"
        )
        db.add(prod_task)

    # 4. Create Linked Payment Record
    payment = models.Payment(
        order_id=order_id,
        payment_method=order_data.paymentMethod,
        amount=order_data.total,
        status="Completed" if pay_status == "Paid" else "Pending",
        reference_number=f"TXN-{random.randint(100000, 999999)}" if pay_status == "Paid" else "",
        notes=f"Order payment for #{order_id}"
    )
    db.add(payment)

    # 5. Create Linked Sale Record
    sale = models.SaleRecord(
        order_id=order_id,
        total_amount=order_data.total,
        net_amount=order_data.subtotal - order_data.discount,
        tax_amount=(order_data.subtotal - order_data.discount) * 0.12, # 12% VAT
        discount_amount=order_data.discount,
        cost_amount=(order_data.subtotal * 0.42),
        profit_amount=order_data.total - (order_data.subtotal * 0.42),
        created_at=now
    )
    db.add(sale)

    # 6. If Delivery Fulfillment: Create Linked Delivery Record
    if order_data.fulfillmentType == "delivery":
        courier = db.query(models.User).filter(models.User.role == "Delivery Staff").first()
        delivery = models.DeliveryRecord(
            order_id=order_id,
            delivery_staff_id=courier.id if courier else None,
            status="Assigned" if courier else "Pending",
            customer_name=order_data.customerName,
            customer_phone=order_data.customerPhone,
            delivery_address=addr,
            assigned_at=now
        )
        db.add(delivery)

    # 7. Create Operational Notifications
    admin_notif = models.Notification(
        title=f"New Order #{order_id}",
        message=f"Received order of ₱{order_data.total:,.2f} from {order_data.customerName} ({order_data.fulfillmentType.capitalize()}).",
        type="order",
        link="/admin/orders"
    )
    db.add(admin_notif)

    db.commit()
    db.refresh(new_order)
    return build_order_response(new_order)

@router.get("", response_model=List[schemas.OrderResponse])
def get_orders(
    status: Optional[str] = Query(None),
    fulfillment: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    user: Optional[models.User] = Depends(get_current_user),
    email: Optional[str] = None
):
    query = db.query(models.Order)

    if user and user.role == models.RoleEnum.CUSTOMER.value:
        query = query.filter((models.Order.user_id == user.id) | (models.Order.customer_email == user.email.lower()))
    elif email:
        query = query.filter(models.Order.customer_email == email.lower())

    if status and status != "All":
        query = query.filter(models.Order.status == status)

    if fulfillment and fulfillment != "All":
        query = query.filter(models.Order.fulfillment == fulfillment)

    orders = query.order_by(models.Order.created_at.desc()).all()
    return [build_order_response(o) for o in orders]

@router.get("/{order_id}", response_model=schemas.OrderResponse)
def get_order_by_id(order_id: str, db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.id == order_id.upper()).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return build_order_response(order)

@router.patch("/{order_id}/status", response_model=schemas.OrderResponse)
def update_order_status(
    order_id: str,
    status_data: schemas.OrderStatusUpdate,
    db: Session = Depends(get_db),
    user: Optional[models.User] = Depends(get_current_user)
):
    order = db.query(models.Order).filter(models.Order.id == order_id.upper()).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    order.status = status_data.status
    if status_data.status_step is not None:
        order.status_step = status_data.status_step

    try:
        timeline = json.loads(order.timeline_json)
    except Exception:
        timeline = []

    now_str = datetime.utcnow().strftime("%I:%M %p")
    if status_data.status == "preparing":
        order.status_step = 3
        if len(timeline) > 2:
            timeline[2]["done"] = False
            timeline[2]["active"] = True
            timeline[2]["time"] = now_str
    elif status_data.status == "ready":
        order.status_step = 4
        if len(timeline) > 3:
            timeline[2]["done"] = True
            timeline[2]["active"] = False
            timeline[3]["done"] = True
            timeline[3]["active"] = True
            timeline[3]["time"] = now_str
        # Sync delivery record if delivery fulfillment
        if order.fulfillment == "delivery":
            del_rec = db.query(models.DeliveryRecord).filter(models.DeliveryRecord.order_id == order.id).first()
            if del_rec and del_rec.status in ["Pending", "Scheduled"]:
                del_rec.status = "Assigned"
    elif status_data.status == "out_for_delivery":
        order.status_step = 5
        if len(timeline) > 4:
            timeline[3]["done"] = True
            timeline[4]["active"] = True
            timeline[4]["time"] = now_str
        del_rec = db.query(models.DeliveryRecord).filter(models.DeliveryRecord.order_id == order.id).first()
        if del_rec:
            del_rec.status = "Out for Delivery"
    elif status_data.status == "delivered":
        order.status_step = 6
        order.payment_status = "Paid"
        for t in timeline:
            t["done"] = True
            t["active"] = False
        if len(timeline) > 5:
            timeline[5]["done"] = True
            timeline[5]["time"] = now_str
        del_rec = db.query(models.DeliveryRecord).filter(models.DeliveryRecord.order_id == order.id).first()
        if del_rec:
            del_rec.status = "Delivered"
            del_rec.delivered_at = datetime.utcnow()

    order.timeline_json = json.dumps(timeline)
    db.commit()
    db.refresh(order)
    return build_order_response(order)
