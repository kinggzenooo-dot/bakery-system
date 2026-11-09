from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app import models, schemas
from backend.app.auth import get_current_user, require_staff, require_admin

router = APIRouter(prefix="/api", tags=["Store Info, Promos, Notifications & Settings"])

# --- Branches ---
@router.get("/branches", response_model=List[schemas.BranchResponse])
def get_branches(db: Session = Depends(get_db)):
    return db.query(models.Branch).all()

# --- Promo Code Validation ---
@router.post("/promo/validate", response_model=schemas.PromoResponse)
def validate_promo(promo_req: schemas.PromoValidateRequest, db: Session = Depends(get_db)):
    code_str = promo_req.code.strip().upper()
    promo = db.query(models.PromoCode).filter(
        models.PromoCode.code == code_str, 
        models.PromoCode.is_active == True
    ).first()

    if not promo:
        return schemas.PromoResponse(
            valid=False,
            message="Invalid or expired promo code. Try 'FREDY10' or 'FREESHIP'."
        )

    return schemas.PromoResponse(
        valid=True,
        code=promo.code,
        discountPercent=promo.discount_percent,
        freeShipping=promo.free_shipping,
        name=promo.name,
        message=f"Promo code {promo.code} applied successfully!"
    )

# --- Notifications ---
@router.get("/notifications", response_model=List[schemas.NotificationResponse])
def get_notifications(
    limit: int = 20,
    db: Session = Depends(get_db),
    user: Optional[models.User] = Depends(get_current_user)
):
    query = db.query(models.Notification)
    if user:
        query = query.filter((models.Notification.user_id == user.id) | (models.Notification.user_id == None))
    notifs = query.order_by(models.Notification.created_at.desc()).limit(limit).all()
    return notifs

@router.patch("/notifications/{notif_id}/read")
def mark_notification_read(notif_id: int, db: Session = Depends(get_db)):
    notif = db.query(models.Notification).filter(models.Notification.id == notif_id).first()
    if notif:
        notif.is_read = True
        db.commit()
    return {"success": True}

# --- Customers List (for Counter Staff / Admin) ---
@router.get("/customers", response_model=List[schemas.UserResponse])
def get_customers(
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    staff: models.User = Depends(require_staff)
):
    query = db.query(models.User).filter(models.User.role == "Customer")
    if search:
        search_fmt = f"%{search.lower()}%"
        query = query.filter(
            (models.User.name.ilike(search_fmt)) |
            (models.User.email.ilike(search_fmt)) |
            (models.User.phone.ilike(search_fmt))
        )
    return query.order_by(models.User.name.asc()).all()

# --- System Settings ---
@router.get("/settings")
def get_settings(db: Session = Depends(get_db), staff: models.User = Depends(require_staff)):
    settings = db.query(models.SystemSetting).all()
    return {s.key: s.value for s in settings}

@router.post("/settings")
def update_setting(
    setting_data: schemas.SettingUpdate,
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin)
):
    setting = db.query(models.SystemSetting).filter(models.SystemSetting.key == setting_data.key).first()
    if setting:
        setting.value = setting_data.value
        if setting_data.description:
            setting.description = setting_data.description
    else:
        setting = models.SystemSetting(
            key=setting_data.key,
            value=setting_data.value,
            description=setting_data.description or ""
        )
        db.add(setting)
    db.commit()
    return {"success": True, "key": setting_data.key, "value": setting_data.value}
