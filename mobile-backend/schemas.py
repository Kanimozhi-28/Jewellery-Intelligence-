from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    username: str
    full_name: Optional[str] = None
    role: str = "salesman"

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    role: str
    created_at: datetime
    class Config:
        from_attributes = True


class FamilyCreate(BaseModel):
    name: str
    initial_customer_id: Optional[int] = None
    initial_relationship: Optional[str] = None

class FamilyMemberAdd(BaseModel):
    family_name: str
    relationship: str

class CustomerDisplay(BaseModel):
    id: int
    short_id: Optional[str]
    current_floor: Optional[str]
    is_in_store: Optional[bool] = False
    customer_jpg: Optional[str] = None
    photo_url: Optional[str] = None
    last_seen: Optional[datetime]
    family_id: Optional[int] = None
    family_relationship: Optional[str] = None
    assigned_salesperson_id: Optional[int] = None
    is_floating: Optional[bool] = False
    assigned_salesperson_name: Optional[str] = None
    class Config:
        from_attributes = True

class FamilyResponse(BaseModel):
    id: int
    name: str
    created_at: datetime
    members_count: Optional[int] = 0
    members: Optional[List[CustomerDisplay]] = []
    
    # Representative info for UI
    representative_short_id: Optional[str] = None
    representative_photo_url: Optional[str] = None
    
    class Config:
        from_attributes = True

class TriggerResponse(BaseModel):
    id: int
    sales_person_name: str
    customer_short_id: Optional[str]
    customer_jpg: Optional[str]
    floor: Optional[str]
    time_stamp: datetime
    class Config:
        from_attributes = True

class JewelResponse(BaseModel):
    id: int
    barcode: str
    name: str
    description: Optional[str]
    price: float
    stock: int
    photo_url: Optional[str]
    class Config:
        from_attributes = True

class SessionEndRequest(BaseModel):
    status: str = "completed"
    notes: Optional[str] = None

class SessionStartRequest(BaseModel):
    customer_id: int

class SessionAddItemRequest(BaseModel):
    barcode: str
    comments: Optional[str] = None

class SessionDetailResponse(BaseModel):
    jewel_name: str
    jewel_barcode: str
    action: str
    comments: Optional[str]
    timestamp: datetime
    salesperson_name: str 
    class Config:
        from_attributes = True

class SessionHistoryResponse(BaseModel):
    session_id: int
    start_time: datetime
    end_time: Optional[datetime]
    salesperson_name: str
    details: List[SessionDetailResponse]
    class Config:
        from_attributes = True

class SalespersonSessionHistoryResponse(BaseModel):
    session_id: int
    start_time: datetime
    end_time: Optional[datetime]
    customer_short_id: Optional[str]
    customer_jpg: Optional[str]
    total_items: int
    total_price: Optional[float]
    details: List[SessionDetailResponse]
    class Config:
        from_attributes = True

class SalespersonAssignment(BaseModel):
    customer_id: int
    salesperson_id: int

class SalespersonStatus(BaseModel):
    id: int
    username: str
    full_name: Optional[str]
    is_busy: bool # True if currently in a session
    current_session_id: Optional[int]
    photo_url: Optional[str] = None
