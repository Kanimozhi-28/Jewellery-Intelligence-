from pydantic import BaseModel, Field, AliasChoices
from typing import List, Optional
from datetime import datetime

# --- User Schemas ---
class UserBase(BaseModel):
    username: str
    password_hash: Optional[str] = None
    full_name: Optional[str] = None
    role: Optional[str] = "salesman"
    is_active: Optional[bool] = True
    zone: Optional[str] = "First Floor" 
    sales: int = Field(default=0) 
    status: str = Field(default="Active", validation_alias=AliasChoices('status_text', 'status'))
    photo: Optional[str] = Field(default=None) 

class UserCreate(UserBase):
    password: str 

class User(UserBase):
    id: int
    created_at: Optional[datetime] = None
    customer_jpg: Optional[str] = None
    password: Optional[str] = Field(default=None, validation_alias=AliasChoices('password_hash', 'password'))
    has_embedding: bool = False

    class Config:
        from_attributes = True

# --- Session Details Schemas ---
class SessionDetailsBase(BaseModel):
    action: Optional[str] = None
    comments: Optional[str] = None
    timestamp: Optional[datetime] = None

class SessionDetails(SessionDetailsBase):
    id: int
    session_id: Optional[int] = None
    jewel_id: Optional[int] = None
    
    class Config:
        from_attributes = True

class SessionDetailsWithJewel(SessionDetails):
    jewel: Optional['Jewel'] = None
    
    class Config:
        from_attributes = True

# --- Jewel Schemas ---
class JewelBase(BaseModel):
    barcode: Optional[str] = None
    name: str
    description: Optional[str] = None
    price: Optional[float] = None
    stock: Optional[int] = 0
    photo_url: Optional[str] = None
    views: int = 0
    sales: int = 0
    category: str = "General"

class JewelCreate(JewelBase):
    pass

class Jewel(JewelBase):
    id: int
    created_at: Optional[datetime] = None
    comments: List[SessionDetails] = []
    class Config:
        from_attributes = True

# --- Customer Schemas ---
class CustomerBase(BaseModel):
    short_id: Optional[str] = None
    photo_url: Optional[str] = None
    visits: int = Field(default=1)
    first_seen: Optional[datetime] = None
    last_seen: Optional[datetime] = None
    current_floor: Optional[str] = None
    is_in_store: Optional[bool] = False
    photo: Optional[str] = Field(default=None, validation_alias=AliasChoices('customer_jpg', 'photo'))
    family_id: Optional[int] = None
    family_relationship: Optional[str] = None

class CustomerCreate(CustomerBase):
    pass

class Customer(CustomerBase):
    id: int

    class Config:
        from_attributes = True
        populate_by_name = True

# --- Session Schemas ---
class SessionBase(BaseModel):
    salesperson_id: Optional[int] = None
    customer_id: Optional[int] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    status: Optional[str] = None
    notes: Optional[str] = None

class SessionCreate(SessionBase):
    pass

class Session(SessionBase):
    id: int
    salesperson: Optional[User] = None
    customer: Optional[Customer] = None
    details: List[SessionDetailsWithJewel] = []
    class Config:
        from_attributes = True

# --- Trigger Schemas ---
class TriggerBase(BaseModel):
    salesperson_id: int
    customer_short_id: str
    floor: Optional[str] = None
    is_notified: bool = False
    sales_person_name: Optional[str] = None
    customer_jpg: Optional[str] = None
    time_stamp: Optional[datetime] = None

class TriggerCreate(TriggerBase):
    pass

class Trigger(TriggerBase):
    id: int
    class Config:
        from_attributes = True

# --- Family Cluster Schemas ---
class FamilyClusterBase(BaseModel):
    name: str
    created_at: Optional[datetime] = None

class FamilyCluster(FamilyClusterBase):
    id: int
    members: List[Customer] = []
    class Config:
        from_attributes = True

# --- Analytics Schemas ---
class ActivityHeatmapEntry(BaseModel):
    floor: str
    hour: int
    count: int

# Rebuild forward references
SessionDetailsWithJewel.model_rebuild()