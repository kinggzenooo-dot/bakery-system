from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app import models, schemas
from backend.app.auth import get_password_hash, require_admin

router = APIRouter(prefix="/api/users", tags=["User Management (Admin)"])

@router.get("", response_model=List[schemas.UserResponse])
def list_users(
    role: Optional[str] = Query(None, description="Filter users by role"),
    search: Optional[str] = Query(None, description="Search by name or email"),
    status: Optional[str] = Query(None, description="Filter active/inactive"),
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin)
):
    query = db.query(models.User)

    if role and role != "All":
        query = query.filter(models.User.role == role)

    if search:
        search_fmt = f"%{search.lower()}%"
        query = query.filter(
            (models.User.name.ilike(search_fmt)) |
            (models.User.email.ilike(search_fmt)) |
            (models.User.phone.ilike(search_fmt))
        )

    if status == "active":
        query = query.filter(models.User.is_active == True)
    elif status == "inactive":
        query = query.filter(models.User.is_active == False)

    return query.order_by(models.User.created_at.desc()).all()

@router.post("", response_model=schemas.UserResponse)
def create_staff_user(
    user_data: schemas.UserCreate,
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin)
):
    existing = db.query(models.User).filter(models.User.email == user_data.email.lower()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"User with email '{user_data.email}' already exists."
        )

    new_user = models.User(
        name=user_data.name,
        email=user_data.email.lower(),
        password_hash=get_password_hash(user_data.password),
        role=user_data.role,
        phone=user_data.phone or "",
        address=user_data.address or "",
        is_active=user_data.is_active if user_data.is_active is not None else True
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.get("/{user_id}", response_model=schemas.UserResponse)
def get_user_detail(
    user_id: int,
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin)
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.patch("/{user_id}", response_model=schemas.UserResponse)
def update_user(
    user_id: int,
    user_data: schemas.UserUpdate,
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin)
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user_data.name is not None:
        user.name = user_data.name
    if user_data.email is not None:
        # Check email uniqueness
        other = db.query(models.User).filter(models.User.email == user_data.email.lower(), models.User.id != user_id).first()
        if other:
            raise HTTPException(status_code=400, detail="Email already taken by another account")
        user.email = user_data.email.lower()
    if user_data.role is not None:
        user.role = user_data.role
    if user_data.phone is not None:
        user.phone = user_data.phone
    if user_data.address is not None:
        user.address = user_data.address
    if user_data.is_active is not None:
        user.is_active = user_data.is_active
    if user_data.password:
        user.password_hash = get_password_hash(user_data.password)

    db.commit()
    db.refresh(user)
    return user

@router.delete("/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin)
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.id == admin.id:
        raise HTTPException(status_code=400, detail="Cannot delete your own administrator account")

    db.delete(user)
    db.commit()
    return {"success": True, "message": f"User {user.name} deleted successfully"}
