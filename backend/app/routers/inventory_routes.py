from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas
from app.auth import require_admin, require_staff

router = APIRouter(prefix="/api/inventory", tags=["Inventory Management"])

@router.get("", response_model=List[schemas.InventoryItemResponse])
def get_inventory_items(
    category: Optional[str] = Query(None),
    low_stock_only: Optional[bool] = Query(False),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    staff: models.User = Depends(require_staff)
):
    query = db.query(models.InventoryItem)

    if category and category != "All":
        query = query.filter(models.InventoryItem.category == category)

    if search:
        search_fmt = f"%{search.lower()}%"
        query = query.filter(models.InventoryItem.item_name.ilike(search_fmt))

    if low_stock_only:
        query = query.filter(models.InventoryItem.current_stock <= models.InventoryItem.minimum_stock)

    items = query.order_by(models.InventoryItem.item_name.asc()).all()

    result = []
    for item in items:
        result.append(schemas.InventoryItemResponse(
            id=item.id,
            item_name=item.item_name,
            category=item.category,
            unit=item.unit,
            current_stock=item.current_stock,
            minimum_stock=item.minimum_stock,
            unit_cost=item.unit_cost,
            supplier_id=item.supplier_id,
            supplier_name=item.supplier.name if item.supplier else "N/A",
            is_low_stock=(item.current_stock <= item.minimum_stock),
            updated_at=item.updated_at
        ))
    return result

@router.post("", response_model=schemas.InventoryItemResponse)
def create_inventory_item(
    item_data: schemas.InventoryItemCreate,
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin)
):
    new_item = models.InventoryItem(
        item_name=item_data.item_name,
        category=item_data.category,
        unit=item_data.unit,
        current_stock=item_data.current_stock,
        minimum_stock=item_data.minimum_stock,
        unit_cost=item_data.unit_cost,
        supplier_id=item_data.supplier_id
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)

    # Record initial stock transaction
    if new_item.current_stock > 0:
        trans = models.InventoryTransaction(
            inventory_item_id=new_item.id,
            transaction_type="IN",
            quantity=new_item.current_stock,
            unit_price=new_item.unit_cost,
            notes="Initial stock setup",
            created_by_id=admin.id
        )
        db.add(trans)
        db.commit()

    return schemas.InventoryItemResponse(
        id=new_item.id,
        item_name=new_item.item_name,
        category=new_item.category,
        unit=new_item.unit,
        current_stock=new_item.current_stock,
        minimum_stock=new_item.minimum_stock,
        unit_cost=new_item.unit_cost,
        supplier_id=new_item.supplier_id,
        supplier_name=new_item.supplier.name if new_item.supplier else "N/A",
        is_low_stock=(new_item.current_stock <= new_item.minimum_stock),
        updated_at=new_item.updated_at
    )

@router.patch("/{item_id}", response_model=schemas.InventoryItemResponse)
def update_inventory_item(
    item_id: int,
    item_data: schemas.InventoryItemUpdate,
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin)
):
    item = db.query(models.InventoryItem).filter(models.InventoryItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Inventory item not found")

    if item_data.item_name is not None:
        item.item_name = item_data.item_name
    if item_data.category is not None:
        item.category = item_data.category
    if item_data.unit is not None:
        item.unit = item_data.unit
    if item_data.minimum_stock is not None:
        item.minimum_stock = item_data.minimum_stock
    if item_data.unit_cost is not None:
        item.unit_cost = item_data.unit_cost
    if item_data.supplier_id is not None:
        item.supplier_id = item_data.supplier_id

    # If current_stock was explicitly changed
    if item_data.current_stock is not None and item_data.current_stock != item.current_stock:
        delta = item_data.current_stock - item.current_stock
        trans = models.InventoryTransaction(
            inventory_item_id=item.id,
            transaction_type="IN" if delta > 0 else "OUT",
            quantity=abs(delta),
            unit_price=item.unit_cost,
            notes="Manual inventory stock adjustment",
            created_by_id=admin.id
        )
        db.add(trans)
        item.current_stock = item_data.current_stock

    item.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(item)

    return schemas.InventoryItemResponse(
        id=item.id,
        item_name=item.item_name,
        category=item.category,
        unit=item.unit,
        current_stock=item.current_stock,
        minimum_stock=item.minimum_stock,
        unit_cost=item.unit_cost,
        supplier_id=item.supplier_id,
        supplier_name=item.supplier.name if item.supplier else "N/A",
        is_low_stock=(item.current_stock <= item.minimum_stock),
        updated_at=item.updated_at
    )

@router.post("/transaction")
def record_transaction(
    trans_data: schemas.InventoryTransactionCreate,
    db: Session = Depends(get_db),
    user: models.User = Depends(require_staff)
):
    item = db.query(models.InventoryItem).filter(models.InventoryItem.id == trans_data.inventory_item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Inventory item not found")

    if trans_data.transaction_type in ["OUT", "WASTE", "PRODUCTION_USAGE"]:
        if item.current_stock < trans_data.quantity:
            raise HTTPException(status_code=400, detail=f"Insufficient stock for {item.item_name}. Available: {item.current_stock} {item.unit}")
        item.current_stock -= trans_data.quantity
    elif trans_data.transaction_type == "IN":
        item.current_stock += trans_data.quantity

    trans = models.InventoryTransaction(
        inventory_item_id=item.id,
        transaction_type=trans_data.transaction_type,
        quantity=trans_data.quantity,
        unit_price=trans_data.unit_price or item.unit_cost,
        reference_id=trans_data.reference_id or "",
        notes=trans_data.notes or "",
        created_by_id=user.id,
        created_at=datetime.utcnow()
    )
    db.add(trans)
    db.commit()

    return {
        "success": True,
        "message": f"Recorded {trans_data.transaction_type} of {trans_data.quantity} {item.unit} for {item.item_name}",
        "current_stock": item.current_stock
    }

@router.get("/transactions")
def get_transactions(
    limit: int = 50,
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin)
):
    trans = db.query(models.InventoryTransaction).order_by(models.InventoryTransaction.created_at.desc()).limit(limit).all()
    return [
        {
            "id": t.id,
            "item_name": t.inventory_item.item_name if t.inventory_item else "N/A",
            "transaction_type": t.transaction_type,
            "quantity": t.quantity,
            "unit_price": t.unit_price,
            "reference_id": t.reference_id,
            "notes": t.notes,
            "created_at": t.created_at.isoformat() if t.created_at else None
        } for t in trans
    ]
