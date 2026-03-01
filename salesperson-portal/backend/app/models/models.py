from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Boolean, LargeBinary
from sqlalchemy.orm import relationship
from .database import Base
import datetime

class Zone(Base):
    __tablename__ = "zones"
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    floor = Column(Integer)
    color = Column(String)

class Jewellery(Base):
    __tablename__ = "jewellery"
    barcode = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    category = Column(String)
    price = Column(Float)

class Salesperson(Base):
    __tablename__ = "salespersons"
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    role = Column(String, default="salesperson")
    password = Column(String)
    zone = Column(String)

class Customer(Base):
    __tablename__ = "customers"
    id = Column(String, primary_key=True)
    zone_id = Column(String, ForeignKey("zones.id"))
    detected_at = Column(DateTime, default=datetime.datetime.utcnow)
    is_active = Column(Boolean, default=True)

class Session(Base):
    __tablename__ = "sessions"
    id = Column(Integer, primary_key=True, autoincrement=True)
    customer_id = Column(String, ForeignKey("customers.id"))
    salesperson_id = Column(String, ForeignKey("salespersons.id"))
    start_time = Column(DateTime, default=datetime.datetime.utcnow)
    end_time = Column(DateTime)
    status = Column(String, default="active")

class JewelleryScan(Base):
    __tablename__ = "jewellery_scans"
    id = Column(Integer, primary_key=True, autoincrement=True)
    session_id = Column(Integer, ForeignKey("sessions.id"))
    barcode = Column(String)
    name = Column(String)
    price = Column(Float)
    comment = Column(Text)
    scanned_at = Column(DateTime, default=datetime.datetime.utcnow)

class PersonFace(Base):
    __tablename__ = "person_faces"
    id = Column(Integer, primary_key=True)
    photo = Column(LargeBinary)  # Matches 'bytea' in DB
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

class SalesTrigger(Base):
    __tablename__ = "sales_triggers"
    id = Column(Integer, primary_key=True)
    sales_personid = Column(String)
    salesperson_name = Column(String)
    customer_id = Column(Integer)
    customer_jpg = Column(LargeBinary)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
