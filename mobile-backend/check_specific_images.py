from database import SessionLocal
import models

def check_specific():
    db = SessionLocal()
    try:
        ids = [367499, 758872] # Corrected typo in first ID from user prompt if needed (364799 vs 367499 in logs earlier? User said 364799, but logs had 367499). Checking both just in case.
        target_ids = [364799, 367499, 758872]
        
        customers = db.query(models.Customer).filter(models.Customer.id.in_(target_ids)).all()
        print(f"Found {len(customers)} of {len(target_ids)} requested.")
        
        for c in customers:
             print(f"\n--- Customer {c.id} ---")
             jpg = c.customer_jpg
             if not jpg:
                 print("Image Data: None/Empty")
             else:
                 print(f"Length: {len(jpg)}")
                 print(f"Start: {jpg[:50]}...")
                 if "data:image" not in jpg:
                     print("WARNING: Does not start with data:image")
    finally:
        db.close()

if __name__ == "__main__":
    check_specific()
