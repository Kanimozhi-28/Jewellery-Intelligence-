from database import SessionLocal
from models import User, Customer, Session, SessionDetail, Jewel
from datetime import datetime, timedelta
import random

db = SessionLocal()

# 1. Get EMP001 (user_3)
user = db.query(User).filter(User.full_name == "EMP001").first()
if not user:
    print("EMP001 not found! Please check check_emp001.py first.")
    exit()

print(f"Seeding data for {user.full_name} (ID: {user.id})...")

# 2. Get or Create Customer
customer = db.query(Customer).filter(Customer.short_id == "CUST-EMP-01").first()
if not customer:
    customer = Customer(
        short_id="CUST-EMP-01", 
        current_floor="Ground", 
        is_in_store=False,
        customer_jpg="https://randomuser.me/api/portraits/women/68.jpg"
    )
    db.add(customer)
    db.commit()
    db.refresh(customer)

# 3. Create Completed Session (Yesterday)
session = Session(
    salesperson_id=user.id,
    customer_id=customer.id,
    start_time=datetime.utcnow() - timedelta(days=1, hours=4),
    end_time=datetime.utcnow() - timedelta(days=1, hours=3),
    status="completed",
    notes="Looking for a anniversary gift."
)
db.add(session)
db.commit()
db.refresh(session)

# 4. Add Jewels
jewels = [
    {"barcode": "JWL-EMP-001", "name": "Diamond Earstuds", "price": 1200.0, "stock": 2},
    {"barcode": "JWL-EMP-002", "name": "Gold Pendant", "price": 800.0, "stock": 5},
    {"barcode": "JWL-EMP-003", "name": "Tennis Bracelet", "price": 2500.0, "stock": 1}
]

created_jewels = []
for j_data in jewels:
    jewel = db.query(Jewel).filter(Jewel.barcode == j_data["barcode"]).first()
    if not jewel:
        jewel = Jewel(**j_data)
        db.add(jewel)
        db.commit()
        db.refresh(jewel)
    created_jewels.append(jewel)

# 5. Add Session Details
details = [
    SessionDetail(session_id=session.id, jewel_id=created_jewels[0].id, action="shown", comments="Liked the style"),
    SessionDetail(session_id=session.id, jewel_id=created_jewels[1].id, action="interested", comments="Considering for price"),
    SessionDetail(session_id=session.id, jewel_id=created_jewels[2].id, action="shown", comments="Too much blink")
]

for d in details:
    db.add(d)

db.commit()
print(f"Successfully seeded session {session.id} with {len(details)} interactions for EMP001.")
db.close()
