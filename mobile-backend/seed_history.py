from database import SessionLocal
from models import User, Customer, Session, SessionDetail, Jewel
from datetime import datetime, timedelta
import random

db = SessionLocal()

# 1. Get or Create Salesperson
salesperson = db.query(User).filter(User.username == "test_salesperson").first()
if not salesperson:
    salesperson = User(username="test_salesperson", password_hash="hash", full_name="Alice Sales", role="salesman")
    db.add(salesperson)
    db.commit()
    db.refresh(salesperson)
print(f"Salesperson: {salesperson.id}")

# 2. Get or Create Customer
customer = db.query(Customer).filter(Customer.short_id == "CUST-HISTORY-01").first()
if not customer:
    customer = Customer(short_id="CUST-HISTORY-01", current_floor="Ground", is_in_store=False)
    db.add(customer)
    db.commit()
    db.refresh(customer)
print(f"Customer: {customer.id}")

# 3. Create Completed Session
session = Session(
    salesperson_id=salesperson.id,
    customer_id=customer.id,
    start_time=datetime.utcnow() - timedelta(days=1),
    end_time=datetime.utcnow() - timedelta(days=1, hours=23),
    status="completed",
    notes="Customer was interested in gold rings."
)
db.add(session)
db.commit()
db.refresh(session)
print(f"Session: {session.id}")

# 4. Add Jewels (Details)
jewel1 = db.query(Jewel).filter(Jewel.barcode == "JWL-HIST-001").first()
if not jewel1:
    jewel1 = Jewel(barcode="JWL-HIST-001", name="Gold Ring 24k", price=500.0, stock=10)
    db.add(jewel1)

jewel2 = db.query(Jewel).filter(Jewel.barcode == "JWL-HIST-002").first()
if not jewel2:
    jewel2 = Jewel(barcode="JWL-HIST-002", name="Silver Necklace", price=150.0, stock=5)
    db.add(jewel2)
db.commit()

detail1 = SessionDetail(session_id=session.id, jewel_id=jewel1.id, action="shown", comments="Liked it")
detail2 = SessionDetail(session_id=session.id, jewel_id=jewel2.id, action="shown", comments="Too expensive")
db.add(detail1)
db.add(detail2)
db.commit()

print("Seeding Complete!")
db.close()
