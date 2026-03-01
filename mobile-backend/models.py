from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Text, Float
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password_hash = Column(String)
    full_name = Column(String)
    role = Column(String, default="salesman")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    floor = Column(String) # For floor-based notifications

class MLDetection(Base):
    __tablename__ = "ml_detections"
    id = Column(Integer, primary_key=True, index=True)
    random_id = Column(String)
    photo_path = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
    floor = Column(String)


class FamilyCluster(Base):
    __tablename__ = "family_clusters"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    members = relationship("Customer", back_populates="family")

class Customer(Base):
    __tablename__ = "customers"
    id = Column(Integer, primary_key=True, index=True)
    short_id = Column(String, unique=True)
    face_embedding_id = Column(String)
    first_seen = Column(DateTime, default=datetime.utcnow)
    last_seen = Column(DateTime)
    total_visits = Column(Integer, default=1)
    current_floor = Column(String)
    is_in_store = Column(Boolean, default=False)
    customer_jpg = Column(Text) # Base64 image string
    
    family_id = Column(Integer, ForeignKey("family_clusters.id"), nullable=True)
    family_relationship = Column(String, nullable=True) # e.g. Father, Mother, Child
    
    family = relationship("FamilyCluster", back_populates="members")

    @property
    def photo_url(self):
        # If customer_jpg is a path or URL (short), returns it so frontend displays it.
        # Base64 strings are handled by the customer_jpg field in Pydantic/Frontend directly.
        if self.customer_jpg and len(self.customer_jpg) < 500:
            return self.customer_jpg
            
        # Return a placeholder or construct url from face_embedding_id if available
        if self.face_embedding_id:
            return f"http://placeholder.com/{self.face_embedding_id}.jpg"
        return "https://randomuser.me/api/portraits/lego/1.jpg"


class SalesHistory(Base):
    __tablename__ = "sales_history"
    id = Column(Integer, primary_key=True, index=True)
    salesperson_id = Column(Integer, ForeignKey("users.id"))
    customer_id = Column(Integer, ForeignKey("customers.id"))
    session_id = Column(Integer, ForeignKey("sessions.id"))
    start_time = Column(DateTime)
    end_time = Column(DateTime)
    duration_seconds = Column(Integer)
    jewels_shown = Column(Text) # JSON string of jewels
    total_price_shown = Column(Float, default=0.0)
    result = Column(String) # "purchased", "browsed", etc.
    created_at = Column(DateTime, default=datetime.utcnow)

class SalesmanTrigger(Base):
    __tablename__ = "salesman_trigger"
    id = Column(Integer, primary_key=True, index=True)
    salesperson_id = Column(Integer, ForeignKey("users.id"))
    sales_person_name = Column(String)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=True)
    customer_short_id = Column(String)
    customer_jpg = Column(String)
    time_stamp = Column(DateTime, default=datetime.utcnow)
    floor = Column(String)
    is_notified = Column(Boolean, default=False)

class Jewel(Base):
    __tablename__ = "jewels"
    id = Column(Integer, primary_key=True, index=True)
    barcode = Column(String, unique=True, index=True)
    name = Column(String)
    description = Column(Text)
    price = Column(Float)
    stock = Column(Integer)
    photo_url = Column(String)

class Session(Base):
    __tablename__ = "sessions"
    id = Column(Integer, primary_key=True, index=True)
    salesperson_id = Column(Integer, ForeignKey("users.id"))
    customer_id = Column(Integer, ForeignKey("customers.id"))
    start_time = Column(DateTime, default=datetime.utcnow)
    end_time = Column(DateTime, nullable=True)
    status = Column(String, default="active")
    notes = Column(Text)
    
    details = relationship("SessionDetail", back_populates="session")

class SessionDetail(Base):
    __tablename__ = "session_details"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("sessions.id"))
    jewel_id = Column(Integer, ForeignKey("jewels.id"))
    action = Column(String)
    comments = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    session = relationship("Session", back_populates="details")
