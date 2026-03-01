from database import SessionLocal
import models
from sqlalchemy import text

def debug_db():
    db = SessionLocal()
    try:
        print("--- Users ---")
        users = db.query(models.User).all()
        for u in users:
            print(f"ID: {u.id}, User: {u.username}, Floor: {u.floor}")

        print("\n--- ML Detections (Last 5) ---")
        dets = db.query(models.MLDetection).order_by(models.MLDetection.id.desc()).limit(5).all()
        for d in dets:
            print(f"ID: {d.id}, RandomID: {d.random_id}, Floor: {d.floor}")

        print("\n--- Customers (Matching 274584) ---")
        c = db.query(models.Customer).filter(models.Customer.short_id == '274584').first()
        if c:
            print(f"Found Customer: ID {c.id}, Short: {c.short_id}")
        else:
            print("Customer 274584 NOT FOUND")
            
    finally:
        db.close()

if __name__ == "__main__":
    debug_db()
