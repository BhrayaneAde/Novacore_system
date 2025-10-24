from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from app.db.models import RoleEnum # Importe l'Enum du modèle

# --- User Schemas ---
class UserBase(BaseModel):
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    role: RoleEnum
    avatar: Optional[str] = None
    is_active: bool = True

class UserCreate(UserBase):
    password: str
    company_id: int
    employee_id: Optional[int] = None

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    role: Optional[RoleEnum] = None
    avatar: Optional[str] = None
    is_active: Optional[bool] = None

class User(UserBase):
    id: int
    company_id: int
    employee_id: Optional[int] = None
    created_date: datetime
    last_login: Optional[datetime] = None

    model_config = {"from_attributes": True}

# Pour usage interne (contient le mdp haché)
class UserInDB(User):
    hashed_password: str