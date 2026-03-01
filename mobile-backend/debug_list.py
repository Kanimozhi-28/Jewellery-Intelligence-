from database import SessionLocal
import models
from sqlalchemy import text

def check_data_integrity():
    db = SessionLocal()
    try:
        print("--- Latest 5 ML Detections ---")
        detections = db.query(models.MLDetection).order_by(models.MLDetection.id.desc()).limit(5).all()
        for d in detections:
            print(f"ML ID: {d.id}, RandomID: '{d.random_id}', Floor: '{d.floor}'")
            
            # Check for matching customer
            cust = db.query(models.Customer).filter(models.Customer.short_id == d.random_id).first()
            if cust:
                print(f"   -> FOUND Customer: ID {cust.id}, ShortID: '{cust.short_id}'")
            else:
                print(f"   -> MISSING Customer for '{d.random_id}'")

        print("\n--- Salesmen Floors ---")
        users = db.query(models.User).filter(models.User.role == "salesman").all()
        for u in users:
            print(f"User: {u.username}, Floor: '{u.floor}'")

    finally:
        db.close()

if __name__ == "__main__":
    check_data_integrity()
