from database import SessionLocal
import models
from sqlalchemy import func

def list_customers():
    db = SessionLocal()
    try:
        total = db.query(models.Customer).count()
        in_store = db.query(models.Customer).filter(models.Customer.is_in_store == True).all()
        
        print(f"Total Customers in Database: {total}\n")
        print("--- Customers Currently In Store ---")
        if not in_store:
            print("None")
        for c in in_store:
            print(f"ID: {c.id} | Short ID: {c.short_id} | Floor: {c.current_floor}")
            
        print("\n--- Recent Customers (Showing 10) ---")
        recent = db.query(models.Customer).order_by(models.Customer.id.desc()).limit(10).all()
        for c in recent:
            print(f"ID: {c.id} | Short ID: {c.short_id} | In Store: {c.is_in_store}")
            
    finally:
        db.close()

if __name__ == "__main__":
    list_customers()
