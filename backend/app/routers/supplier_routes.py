from typing import List, Optional
import random
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app import models, schemas
from backend.app.auth import require_admin, require_staff

router = APIRouter(prefix="/api", tags=["Suppliers & Purchase Orders"])

# --- Suppliers ---
@router.get("/suppliers", response_model=List[schemas.SupplierResponse])
def get_suppliers(db: Session = Depends(get_db), staff: models.User = Depends(require_staff)):
    return db.query(models.Supplier).filter(models.Supplier.is_active == True).all()

@router.post("/suppliers", response_model=schemas.SupplierResponse)
def create_supplier(
    sup_data: schemas.SupplierCreate,
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin)
):
    supplier = models.Supplier(
        name=sup_data.name,
        contact_person=sup_data.contact_person or "",
        email=sup_data.email or "",
        phone=sup_data.phone or "",
        address=sup_data.address or "",
        lead_time_days=sup_data.lead_time_days or 3
    )
    db.add(supplier)
    db.commit()
    db.refresh(supplier)
    return supplier

# --- Purchase Orders ---
def format_po_response(po: models.PurchaseOrder) -> schemas.PurchaseOrderResponse:
    items = [
        {
            "id": i.id,
            "inventory_item_id": i.inventory_item_id,
            "item_name": i.item_name,
            "quantity_ordered": i.quantity_ordered,
            "quantity_received": i.quantity_received,
            "unit_cost": i.unit_cost,
            "total_cost": i.total_cost
        } for i in po.items
    ]

    return schemas.PurchaseOrderResponse(
        id=po.id,
        po_number=po.po_number,
        supplier_id=po.supplier_id,
        supplier_name=po.supplier.name if po.supplier else "N/A",
        status=po.status,
        total_amount=po.total_amount,
        expected_delivery_date=po.expected_delivery_date or "",
        received_date=po.received_date or "",
        notes=po.notes or "",
        items=items,
        created_at=po.created_at
    )

@router.get("/purchase-orders", response_model=List[schemas.PurchaseOrderResponse])
def get_purchase_orders(
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin)
):
    query = db.query(models.PurchaseOrder)
    if status and status != "All":
        query = query.filter(models.PurchaseOrder.status == status)
    pos = query.order_by(models.PurchaseOrder.created_at.desc()).all()
    return [format_po_response(po) for po in pos]

@router.post("/purchase-orders", response_model=schemas.PurchaseOrderResponse)
def create_purchase_order(
    po_data: schemas.PurchaseOrderCreate,
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin)
):
    po_num = f"PO-2026-{random.randint(100, 999)}"
    while db.query(models.PurchaseOrder).filter(models.PurchaseOrder.po_number == po_num).first():
        po_num = f"PO-2026-{random.randint(100, 999)}"

    total_amount = sum(i.quantity_ordered * i.unit_cost for i in po_data.items)

    po = models.PurchaseOrder(
        po_number=po_num,
        supplier_id=po_data.supplier_id,
        status="Submitted",
        total_amount=total_amount,
        expected_delivery_date=po_data.expected_delivery_date or "",
        notes=po_data.notes or "",
        created_by_id=admin.id
    )
    db.add(po)
    db.flush()

    for item in po_data.items:
        po_item = models.PurchaseOrderItem(
            purchase_order_id=po.id,
            inventory_item_id=item.inventory_item_id,
            item_name=item.item_name,
            quantity_ordered=item.quantity_ordered,
            quantity_received=0.0,
            unit_cost=item.unit_cost,
            total_cost=item.quantity_ordered * item.unit_cost
        )
        db.add(po_item)

    db.commit()
    db.refresh(po)
    return format_po_response(po)

@router.patch("/purchase-orders/{po_id}/receive", response_model=schemas.PurchaseOrderResponse)
def receive_purchase_order(
    po_id: int,
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin)
):
    po = db.query(models.PurchaseOrder).filter(models.PurchaseOrder.id == po_id).first()
    if not po:
        raise HTTPException(status_code=404, detail="Purchase order not found")

    if po.status == "Received":
        raise HTTPException(status_code=400, detail="Purchase order has already been received")

    po.status = "Received"
    po.received_date = datetime.utcnow().strftime("%Y-%m-%d %I:%M %p")

    # Increment Inventory Stocks & Log Transactions
    for item in po.items:
        item.quantity_received = item.quantity_ordered
        inv_item = db.query(models.InventoryItem).filter(models.InventoryItem.id == item.inventory_item_id).first()
        if inv_item:
            inv_item.current_stock += item.quantity_ordered
            inv_item.unit_cost = item.unit_cost # update latest cost
            inv_item.updated_at = datetime.utcnow()

            trans = models.InventoryTransaction(
                inventory_item_id=inv_item.id,
                transaction_type="IN",
                quantity=item.quantity_ordered,
                unit_price=item.unit_cost,
                reference_id=po.po_number,
                notes=f"Received PO shipment from {po.supplier.name if po.supplier else 'Supplier'}",
                created_by_id=admin.id
            )
            db.add(trans)

    # Add notification
    notif = models.Notification(
        title=f"PO Received: {po.po_number}",
        message=f"Stock successfully restocked from {po.supplier.name if po.supplier else 'Supplier'} (Total: ₱{po.total_amount:,.2f}).",
        type="inventory",
        link="/admin/inventory"
    )
    db.add(notif)

    db.commit()
    db.refresh(po)
    return format_po_response(po)
