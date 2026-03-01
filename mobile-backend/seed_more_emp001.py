from database import SessionLocal
from models import User, Customer, Session, SessionDetail, Jewel
from datetime import datetime, timedelta
import random

db = SessionLocal()

# 1. Get EMP001 (user_3)
user = db.query(User).filter(User.full_name == "EMP001").first()
if not user:
    print("EMP001 not found!")
    exit()

print(f"Seeding MORE data for {user.full_name} (ID: {user.id})...")

# Defining 3 new sessions
new_sessions_data = [
    {
        "cust_id": "CUST5673",
        "notes": "Liked simple designs.",
        "time_offset_hours": 26, # Yesterday
        "jewels": [
            {"barcode": "JWL-5673-A", "name": "Silver Ring", "price": 200.0, "action": "purchased", "comment": "Perfect fit"},
            {"barcode": "JWL-5673-B", "name": "Silver Chain", "price": 350.0, "action": "shown", "comment": "Maybe next time"}
        ]
    },
    {
        "cust_id": "CUST8842",
        "notes": "Looking for birthday gift.",
        "time_offset_hours": 50, # 2 days ago
        "jewels": [
            {"barcode": "JWL-8842-A", "name": "Ruby Earrings", "price": 1200.0, "action": "interested", "comment": "Likes the color"},
            {"barcode": "JWL-8842-B", "name": "Diamond Studs", "price": 900.0, "action": "shown", "comment": "Too small"}
        ]
    },
    {
        "cust_id": "CUST9910",
        "notes": "Just browsing.",
        "time_offset_hours": 5, # Today
        "jewels": [
            {"barcode": "JWL-9910-A", "name": "Gold Bangle", "price": 1500.0, "action": "shown", "comment": "Checking weight"}
        ]
    }
]

for s_data in new_sessions_data:
    # Create Customer
    customer = db.query(Customer).filter(Customer.short_id == s_data["cust_id"]).first()
    if not customer:
        customer = Customer(
            short_id=s_data["cust_id"], 
            current_floor="Ground", 
            is_in_store=False
        )
        db.add(customer)
        db.commit()
        db.refresh(customer)
    
    # Create Session
    start_time = datetime.utcnow() - timedelta(hours=s_data["time_offset_hours"])
    session = Session(
        salesperson_id=user.id,
        customer_id=customer.id,
        start_time=start_time,
        end_time=start_time + timedelta(minutes=30),
        status="completed",
        notes=s_data["notes"]
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    
    # Add Jewels & Details
    for j_data in s_data["jewels"]:
        jewel = db.query(Jewel).filter(Jewel.barcode == j_data["barcode"]).first()
        if not jewel:
            jewel = Jewel(barcode=j_data["barcode"], name=j_data["name"], price=j_data["price"], stock=5)
            db.add(jewel)
            db.commit()
            db.refresh(jewel)
            
        detail = SessionDetail(
            session_id=session.id, 
            jewel_id=jewel.id, 
            action=j_data["action"], 
            comments=j_data["comment"]
        )
        db.add(detail)
    
    db.commit()
    print(f"Seeded session for {s_data['cust_id']}")

print("Done!")
db.close()
