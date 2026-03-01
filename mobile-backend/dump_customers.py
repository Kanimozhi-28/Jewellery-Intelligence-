from database import SessionLocal
import models

def dump_all_customers():
    db = SessionLocal()
    try:
        print("--- All Customers in DB ---")
        customers = db.query(models.Customer).all()
        print(f"Total Count: {len(customers)}")
        
        for c in customers:
            # Print ID and first 20 chars of photo to verify content
            photo_preview = "None"
            if c.customer_jpg:
                photo_preview = f"{c.customer_jpg[:20]}... (Len: {len(c.customer_jpg)})"
            
            print(f"ID: {c.id} | ShortID: '{c.short_id}' | Floor: '{c.current_floor}' | Photo: {photo_preview}")
            
    finally:
        db.close()

if __name__ == "__main__":
    dump_all_customers()
