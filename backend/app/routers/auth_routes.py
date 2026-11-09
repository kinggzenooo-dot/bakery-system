from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app import models, schemas
from backend.app.auth import (
    verify_password,
    get_password_hash,
    create_access_token,
    get_current_user,
    require_current_user
)

router = APIRouter(prefix="/api/auth", tags=["Authentication & Roles"])

@router.post("/login", response_model=schemas.TokenResponse)
def login(login_data: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == login_data.email.lower()).first()
    if not user or not verify_password(login_data.password, user.password_hash):
        # For demo purposes, auto-register unknown user if valid credentials format
        if not user and "@" in login_data.email:
            user = models.User(
                name=login_data.email.split("@")[0].capitalize(),
                email=login_data.email.lower(),
                password_hash=get_password_hash(login_data.password),
                role=login_data.role or "Customer",
                phone="+63 917 000 0000",
                address="Cebu City"
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

    # If role was selected in login, update role
    if login_data.role and user.role != login_data.role:
        user.role = login_data.role
        db.commit()
        db.refresh(user)

    token = create_access_token(data={"sub": user.email, "role": user.role})
    return schemas.TokenResponse(
        access_token=token,
        token_type="bearer",
        user=schemas.UserResponse.from_orm(user)
    )

@router.post("/register", response_model=schemas.TokenResponse)
def register(reg_data: schemas.UserRegister, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == reg_data.email.lower()).first()
    if existing:
        # Update user credentials
        existing.name = reg_data.name
        existing.role = reg_data.role or existing.role
        existing.phone = reg_data.phone or existing.phone
        existing.address = reg_data.address or existing.address
        existing.password_hash = get_password_hash(reg_data.password)
        db.commit()
        db.refresh(existing)
        user = existing
    else:
        user = models.User(
            name=reg_data.name,
            email=reg_data.email.lower(),
            password_hash=get_password_hash(reg_data.password),
            role=reg_data.role or "Customer",
            phone=reg_data.phone or "",
            address=reg_data.address or ""
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    token = create_access_token(data={"sub": user.email, "role": user.role})
    return schemas.TokenResponse(
        access_token=token,
        token_type="bearer",
        user=schemas.UserResponse.from_orm(user)
    )

@router.get("/me", response_model=schemas.UserResponse)
def get_me(user: models.User = Depends(require_current_user)):
    return user

@router.get("/roles")
def get_roles():
    return [r.value for r in models.RoleEnum]
