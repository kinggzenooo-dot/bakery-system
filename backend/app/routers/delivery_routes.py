import json
from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app import models, schemas
from backend.app.auth import require_delivery_staff, require_staff

router = APIRouter(prefix="/api/deliveries", tags=["Delivery Staff & Dispatch"])

def format_delivery_response(d: models.DeliveryRecord) -> schemas.DeliveryResponse:
    return schemas.DeliveryResponse(
        id=d.id,
        order_id=d.order_id,
        delivery_staff_id=d.delivery_staff_id,
        delivery_staff_name=d.delivery_staff.name if d.delivery_staff else "Unassigned Courier",
        status=d.status,
        customer_name=d.customer_name,
        customer_phone=d.customer_phone,
        delivery_address=d.delivery_address,
        failure_reason=d.failure_reason,
        proof_note=d.proof_note,
        assigned_at=d.assigned_at,
        delivered_at=d.delivered_at
    )

@router.get("", response_model=List[schemas.DeliveryResponse])
def get_deliveries(
    status: Optional[str] = Query(None),
    staff_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    user: models.User = Depends(require_staff)
):
    query = db.query(models.DeliveryRecord)

    if user.role == models.RoleEnum.DELIVERY_STAFF.value:
        query = query.filter((models.DeliveryRecord.delivery_staff_id == user.id) | (models.DeliveryRecord.delivery_staff_id == None))
    elif staff_id:
        query = query.filter(models.DeliveryRecord.delivery_staff_id == staff_id)

    if status and status != "All":
        query = query.filter(models.DeliveryRecord.status == status)

    deliveries = query.order_by(models.DeliveryRecord.id.desc()).all()
    return [format_delivery_response(d) for d in deliveries]

@router.patch("/{delivery_id}/status", response_model=schemas.DeliveryResponse)
def update_delivery_status(
    delivery_id: int,
    status_data: schemas.DeliveryStatusUpdate,
    db: Session = Depends(get_db),
    user: models.User = Depends(require_staff)
):
    delivery = db.query(models.DeliveryRecord).filter(models.DeliveryRecord.id == delivery_id).first()
    if not delivery:
        raise HTTPException(status_code=404, detail="Delivery record not found")

    delivery.status = status_data.status
    if status_data.delivery_staff_id:
        delivery.delivery_staff_id = status_data.delivery_staff_id
    elif not delivery.delivery_staff_id and user.role == models.RoleEnum.DELIVERY_STAFF.value:
        delivery.delivery_staff_id = user.id

    if status_data.failure_reason:
        delivery.failure_reason = status_data.failure_reason
    if status_data.proof_note:
        delivery.proof_note = status_data.proof_note

    now = datetime.utcnow()
    now_str = now.strftime("%I:%M %p")

    # Sync with parent Order
    order = db.query(models.Order).filter(models.Order.id == delivery.order_id).first()
    if order:
        try:
            timeline = json.loads(order.timeline_json) if order.timeline_json else []
        except Exception:
            timeline = []

        if status_data.status == "Accepted":
            delivery.assigned_at = now
        elif status_data.status == "Out for Delivery":
            order.status = "out_for_delivery"
            order.status_step = 5
            if len(timeline) > 4:
                timeline[3]["done"] = True
                timeline[4]["active"] = True
                timeline[4]["time"] = now_str
        elif status_data.status == "Delivered":
            order.status = "delivered"
            order.status_step = 6
            order.payment_status = "Paid"
            delivery.delivered_at = now
            for t in timeline:
                t["done"] = True
                t["active"] = False
            if len(timeline) > 5:
                timeline[5]["time"] = now_str

            # Create notification
            notif = models.Notification(
                title=f"Order #{order.id} Delivered",
                message=f"Order #{order.id} successfully delivered to {order.customer_name} by {user.name}.",
                type="delivery",
                link=f"/admin/orders"
            )
            db.add(notif)
        elif status_data.status == "Failed":
            # Alert Admin
            notif = models.Notification(
                title=f"Delivery Failed: Order #{order.id}",
                message=f"Delivery failed for {order.customer_name}. Reason: {status_data.failure_reason or 'Customer unavailable'}.",
                type="delivery",
                link=f"/admin/orders"
            )
            db.add(notif)

        order.timeline_json = json.dumps(timeline)

    db.commit()
    db.refresh(delivery)
    return format_delivery_response(delivery)
