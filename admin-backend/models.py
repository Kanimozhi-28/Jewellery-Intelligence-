from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Boolean, DECIMAL, Table
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

# --- Models ---

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(100))
    role = Column(String(20)) # 'admin', 'salesman'
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Remote DB specific fields
    unique_id = Column(String(100))
    embedding = Column(Text) 
    customer_jpg = Column(String(255))
    
    # Map frontend 'zone' to backend 'floor' column
    zone = Column("floor", String(50), default="First Floor")
    # Map frontend 'status' strings to 'status' column
    status_text = Column("status", String(50), default="Active")

    @property
    def has_embedding(self):
        return bool(self.embedding)

    @property
    def status(self):
        return self.status_text
    @property
    def photo(self):
        return self.customer_jpg

    # Relationships
    sessions = relationship("Session", back_populates="salesperson")
    triggers = relationship("SalesmanTrigger", back_populates="salesperson")

class Jewel(Base):
    __tablename__ = "jewels"

    id = Column(Integer, primary_key=True, index=True)
    barcode = Column(String(50), unique=True, index=True)
    name = Column(String(100))
    description = Column(Text)
    price = Column(DECIMAL(10, 2))
    stock = Column(Integer, default=0)
    photo_url = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    comments = relationship("SessionDetails", back_populates="jewel")

class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    short_id = Column(String(50), unique=True, index=True)
    face_embedding_id = Column(String(100))
    first_seen = Column(DateTime)
    last_seen = Column(DateTime)
    total_visits = Column(Integer, default=1)
    current_floor = Column(String(50))
    is_in_store = Column(Boolean, default=False)
    embedding = Column(Text)
    customer_jpg = Column(Text)
    
    # Family logic
    family_id = Column(Integer, ForeignKey("family_clusters.id"))
    family_relationship = Column(String(50))

    @property
    def photo(self):
        return self.customer_jpg

    @property
    def visits(self):
        return self.total_visits

    # Relationships
    sessions = relationship("Session", back_populates="customer")
    family = relationship("FamilyCluster", back_populates="members")
    ignored_info = relationship("IgnoredCustomer", back_populates="customer", uselist=False)



class IgnoredCustomer(Base):
    __tablename__ = "ignored_customers"
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), unique=True)
    reason = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)

    customer = relationship("Customer", back_populates="ignored_info")

class FamilyCluster(Base):
    __tablename__ = "family_clusters"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow)

    members = relationship("Customer", back_populates="family")

class Session(Base):
    __tablename__ = "sessions"

    id = Column(Integer, primary_key=True, index=True)
    salesperson_id = Column(Integer, ForeignKey("users.id"))
    customer_id = Column(Integer, ForeignKey("customers.id"))
    start_time = Column(DateTime)
    end_time = Column(DateTime)
    status = Column(String(20))
    notes = Column(Text)

    salesperson = relationship("User", back_populates="sessions")
    customer = relationship("Customer", back_populates="sessions")
    details = relationship("SessionDetails", back_populates="session")

class SessionDetails(Base):
    __tablename__ = "session_details"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("sessions.id"))
    jewel_id = Column(Integer, ForeignKey("jewels.id"))
    action = Column(String(50))
    comments = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)

    session = relationship("Session", back_populates="details")
    jewel = relationship("Jewel", back_populates="comments")

class SalesmanTrigger(Base):
    __tablename__ = "salesman_trigger"

    id = Column(Integer, primary_key=True, index=True)
    salesperson_id = Column(Integer, ForeignKey("users.id"))
    sales_person_name = Column(String(100))
    customer_id = Column(Integer, ForeignKey("customers.id"))
    customer_short_id = Column(String(50))
    customer_jpg = Column(String(255))
    time_stamp = Column(DateTime, default=datetime.utcnow)
    floor = Column(String(50))
    is_notified = Column(Boolean, default=False)

    salesperson = relationship("User", back_populates="triggers")

class MLDetections(Base):
    __tablename__ = "ml_detections"
    
    id = Column(Integer, primary_key=True, index=True)
    random_id = Column(String(50))
    photo_path = Column(String(255))
    timestamp = Column(DateTime)
    floor = Column(String(50))

class Events(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer)
    camera_name = Column(String(100))
    timestamp = Column(DateTime)
