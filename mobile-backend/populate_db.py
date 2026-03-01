from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
from passlib.context import CryptContext
import datetime
import random

# Create tables
models.Base.metadata.create_all(bind=engine)

# Static valid bcrypt hash for "password"
FAKE_HASH = "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxwKc.6.Fhd.6.Fhd" 

def populate():
    db = SessionLocal()
    try:
        # 1. Users (Salesmen)
        if not db.query(models.User).filter_by(username="admin").first():
            admin = models.User(
                id=1,
                username="admin",
                password_hash=FAKE_HASH,
                full_name="Admin User",
                role="admin"
            )
            db.add(admin)
        
        if not db.query(models.User).filter_by(username="sales1").first():
            sales1 = models.User(
                id=2,
                username="sales1", 
                password_hash=FAKE_HASH,
                full_name="John Doe", 
                role="salesman"
            )
            db.add(sales1)

        # 2. Customers (Dummy Data)
        floors = ["Floor 1", "Floor 2", "Floor 3"]
        status_types = ["unattended", "attended", "active"]
        
        for i in range(1, 11):
            c_id = f"CUST-{random.randint(1000, 9999)}"
            # Check if exists
            if not db.query(models.Customer).filter_by(short_id=c_id).first():
                cust = models.Customer(
                    short_id=c_id,
                    current_floor=random.choice(floors),
                    # status is not in DB, determining via sessions dynamically or is_in_store
                    is_in_store=True,
                    last_seen=datetime.datetime.now() - datetime.timedelta(minutes=random.randint(5, 120))
                )
                db.add(cust)
                db.commit() # Commit to get ID
                
                # Add Visits (History)
                for j in range(random.randint(1, 3)):
                    visit_date = datetime.datetime.now() - datetime.timedelta(days=random.randint(1, 30))
                    session = models.Session(
                        customer_id=cust.id,
                        salesperson_id=1, # Assigned to Admin
                        start_time=visit_date,
                        end_time=visit_date + datetime.timedelta(minutes=30),
                        status="completed",
                        notes="Interested in gold rings."
                    )
                    db.add(session)

        # 3. Jewels (Inventory)
        jewel_names = ["Gold Ring 22k", "Diamond Necklace", "Platinum Band", "Ruby Earrings", "Emerald Pendant"]
        for i in range(20):
            j_code = f"JWL-{100+i}"
            if not db.query(models.Jewel).filter_by(barcode=j_code).first():
                jewel = models.Jewel(
                    barcode=j_code,
                    name=f"{random.choice(jewel_names)}",
                    description="Premium quality jewel.",
                    price=random.randint(200, 2000),
                    stock=random.randint(1, 5),
                    photo_url=None
                )
                db.add(jewel)

        # 4. Triggers (Notifications)
        # Clear old triggers first? No, just add new ones for demo
        triggers = [
            {"short_id": "CUST-NEW-001", "floor": "Floor 1"},
            {"short_id": "CUST-NEW-002", "floor": "Floor 2"}
        ]
        
        for t in triggers:
            # Add to salesman_trigger
            trigger = models.SalesmanTrigger(
                salesperson_id=1,
                sales_person_name="Admin User",
                customer_short_id=t["short_id"],
                floor=t["floor"],
                is_notified=False,
                time_stamp=datetime.datetime.now()
            )
            db.add(trigger)

        db.commit()
        print("Database populated successfully!")

    except Exception as e:
        print(f"Error populating DB: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    populate()
