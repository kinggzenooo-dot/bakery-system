from typing import List, Optional
import random
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas
from app.auth import require_baker, require_staff

router = APIRouter(prefix="/api/production", tags=["Baker & Production Tasks"])

def format_task_response(task: models.ProductionTask) -> schemas.ProductionTaskResponse:
    ingredients = [
        {
            "id": ing.id,
            "inventory_item_id": ing.inventory_item_id,
            "item_name": ing.item_name,
            "required_quantity": ing.required_quantity,
            "actual_used_quantity": ing.actual_used_quantity,
            "unit": ing.unit
        } for ing in task.ingredients
    ]

    return schemas.ProductionTaskResponse(
        id=task.id,
        task_code=task.task_code,
        product_id=task.product_id,
        product_name=task.product_name,
        target_quantity=task.target_quantity,
        completed_quantity=task.completed_quantity,
        status=task.status,
        assigned_baker_id=task.assigned_baker_id,
        baker_name=task.assigned_baker.name if task.assigned_baker else "Unassigned",
        scheduled_date=task.scheduled_date or "Today",
        notes=task.notes or "",
        ingredients=ingredients,
        created_at=task.created_at,
        completed_at=task.completed_at
    )

@router.get("", response_model=List[schemas.ProductionTaskResponse])
def get_production_tasks(
    status: Optional[str] = Query(None),
    baker_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    user: models.User = Depends(require_staff)
):
    query = db.query(models.ProductionTask)

    if user.role == models.RoleEnum.BAKER.value:
        # Bakers see assigned or unassigned tasks
        query = query.filter((models.ProductionTask.assigned_baker_id == user.id) | (models.ProductionTask.assigned_baker_id == None))
    elif baker_id:
        query = query.filter(models.ProductionTask.assigned_baker_id == baker_id)

    if status and status != "All":
        query = query.filter(models.ProductionTask.status == status)

    tasks = query.order_by(models.ProductionTask.created_at.desc()).all()
    return [format_task_response(t) for t in tasks]

@router.post("", response_model=schemas.ProductionTaskResponse)
def create_production_task(
    task_data: schemas.ProductionTaskCreate,
    db: Session = Depends(get_db),
    user: models.User = Depends(require_staff)
):
    code = f"PRD-{random.randint(100, 999)}"
    while db.query(models.ProductionTask).filter(models.ProductionTask.task_code == code).first():
        code = f"PRD-{random.randint(100, 999)}"

    task = models.ProductionTask(
        task_code=code,
        product_id=task_data.product_id,
        product_name=task_data.product_name,
        target_quantity=task_data.target_quantity,
        completed_quantity=0,
        status="Scheduled",
        assigned_baker_id=task_data.assigned_baker_id or user.id,
        scheduled_date=task_data.scheduled_date or datetime.utcnow().strftime("%Y-%m-%d"),
        notes=task_data.notes or ""
    )
    db.add(task)
    db.flush()

    # Add required ingredients if provided, else load from product's recipe
    if task_data.ingredients:
        for ing in task_data.ingredients:
            db_ing = models.ProductionIngredient(
                production_task_id=task.id,
                inventory_item_id=ing.inventory_item_id,
                item_name=ing.item_name,
                required_quantity=ing.required_quantity,
                actual_used_quantity=ing.required_quantity,
                unit=ing.unit
            )
            db.add(db_ing)
    else:
        # Auto-load ingredients from the product's saved recipe
        import json as _json
        product = db.query(models.Product).filter(models.Product.id == task_data.product_id).first()
        recipe = []
        if product and product.recipe_json:
            try:
                recipe = _json.loads(product.recipe_json)
            except Exception:
                recipe = []

        if recipe:
            for item in recipe:
                # Try to match inventory item by name (case-insensitive)
                inv_item = db.query(models.InventoryItem).filter(
                    models.InventoryItem.item_name.ilike(f"%{item.get('item_name','').split()[0]}%")
                ).first()
                qty = float(item.get('quantity', 1.0)) * task.target_quantity
                db.add(models.ProductionIngredient(
                    production_task_id=task.id,
                    inventory_item_id=inv_item.id if inv_item else 1,
                    item_name=item.get('item_name', 'Unknown'),
                    required_quantity=qty,
                    actual_used_quantity=qty,
                    unit=item.get('unit', 'kg')
                ))
        else:
            # Last resort fallback: flour + butter
            flour  = db.query(models.InventoryItem).filter(models.InventoryItem.item_name.ilike("%flour%")).first()
            butter = db.query(models.InventoryItem).filter(models.InventoryItem.item_name.ilike("%butter%")).first()
            if flour:
                db.add(models.ProductionIngredient(
                    production_task_id=task.id,
                    inventory_item_id=flour.id,
                    item_name=flour.item_name,
                    required_quantity=float(task.target_quantity * 0.5),
                    actual_used_quantity=float(task.target_quantity * 0.5),
                    unit=flour.unit
                ))
            if butter:
                db.add(models.ProductionIngredient(
                    production_task_id=task.id,
                    inventory_item_id=butter.id,
                    item_name=butter.item_name,
                    required_quantity=float(task.target_quantity * 0.25),
                    actual_used_quantity=float(task.target_quantity * 0.25),
                    unit=butter.unit
                ))

    db.commit()
    db.refresh(task)
    return format_task_response(task)

@router.patch("/{task_id}/status", response_model=schemas.ProductionTaskResponse)
def update_task_status(
    task_id: int,
    status_data: schemas.ProductionStatusUpdate,
    db: Session = Depends(get_db),
    user: models.User = Depends(require_staff)
):
    task = db.query(models.ProductionTask).filter(models.ProductionTask.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Production task not found")

    old_status = task.status
    task.status = status_data.status

    if status_data.completed_quantity is not None:
        task.completed_quantity = status_data.completed_quantity
    elif status_data.status == "Completed" and task.completed_quantity == 0:
        task.completed_quantity = task.target_quantity

    if status_data.notes:
        task.notes = status_data.notes

    # When transitioning to Completed:
    if status_data.status == "Completed" and old_status != "Completed":
        task.completed_at = datetime.utcnow()

        # 1. Update Product Finished Stock
        product = db.query(models.Product).filter(models.Product.id == task.product_id).first()
        if product:
            product.stock_quantity = (product.stock_quantity or 0) + task.completed_quantity
            product.in_stock = True

        # 2. Deduct raw ingredients from inventory
        for ing in task.ingredients:
            item = db.query(models.InventoryItem).filter(models.InventoryItem.id == ing.inventory_item_id).first()
            if item:
                used_qty = ing.actual_used_quantity or ing.required_quantity
                item.current_stock = max(0.0, item.current_stock - used_qty)
                
                # Record transaction
                trans = models.InventoryTransaction(
                    inventory_item_id=item.id,
                    transaction_type="PRODUCTION_USAGE",
                    quantity=used_qty,
                    unit_price=item.unit_cost,
                    reference_id=task.task_code,
                    notes=f"Used in production of {task.completed_quantity}x {task.product_name}",
                    created_by_id=user.id
                )
                db.add(trans)

        # 3. Create Notification for Admin & Counter Staff
        notif = models.Notification(
            title=f"Production Completed: {task.product_name}",
            message=f"{task.completed_quantity} units of {task.product_name} freshly baked and added to inventory stock by {user.name}.",
            type="production",
            link="/admin/products"
        )
        db.add(notif)

    db.commit()
    db.refresh(task)
    return format_task_response(task)
