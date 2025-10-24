from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

class NotificationBase(BaseModel):
    title: str
    message: Optional[str] = None
    type: str = "info"  # info, success, warning, error
    data: Optional[Dict[str, Any]] = {}

class NotificationCreate(NotificationBase):
    user_id: int
    created_by_id: Optional[int] = None

class Notification(NotificationBase):
    id: int
    user_id: int
    created_by_id: Optional[int] = None
    is_read: bool
    created_at: datetime

    model_config = {"from_attributes": True}