from datetime import datetime, timedelta
from typing import Optional, List
import jwt
import bcrypt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from backend.app.config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
from backend.app.database import get_db
from backend.app import models

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token", auto_error=False)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        if hashed_password.startswith("$2b$") or hashed_password.startswith("$2a$"):
            return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
        return plain_password == hashed_password
    except Exception:
        return plain_password == hashed_password

def get_password_hash(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: Optional[str] = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> Optional[models.User]:
    if not token:
        return None
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            return None
    except jwt.PyJWTError:
        return None
    
    user = db.query(models.User).filter(models.User.email == email).first()
    return user

def require_current_user(user: Optional[models.User] = Depends(get_current_user)) -> models.User:
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

def require_admin(user: models.User = Depends(require_current_user)) -> models.User:
    if user.role != models.RoleEnum.ADMINISTRATOR.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Administrator permissions required"
        )
    return user

def require_counter_staff(user: models.User = Depends(require_current_user)) -> models.User:
    if user.role not in [models.RoleEnum.ADMINISTRATOR.value, models.RoleEnum.COUNTER_STAFF.value]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Counter Staff or Administrator permissions required"
        )
    return user

def require_baker(user: models.User = Depends(require_current_user)) -> models.User:
    if user.role not in [models.RoleEnum.ADMINISTRATOR.value, models.RoleEnum.BAKER.value]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Baker or Administrator permissions required"
        )
    return user

def require_delivery_staff(user: models.User = Depends(require_current_user)) -> models.User:
    if user.role not in [models.RoleEnum.ADMINISTRATOR.value, models.RoleEnum.DELIVERY_STAFF.value]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Delivery Staff or Administrator permissions required"
        )
    return user

def require_staff(user: models.User = Depends(require_current_user)) -> models.User:
    if user.role == models.RoleEnum.CUSTOMER.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Staff permissions required"
        )
    return user
