from database import SessionLocal
import models

def fix_data():
    db = SessionLocal()
    try:
        customers = db.query(models.Customer).filter(models.Customer.short_id == None).all()
        print(f"Found {len(customers)} customers with missing Info.")
        
        for c in customers:
            # properly casting id to string
            c.short_id = str(c.id) 
            c.current_floor = "Floor 1"
            print(f"Updating ID {c.id} -> ShortID: {c.short_id}, Floor: {c.current_floor}")
            db.add(c)
            
        db.commit()
        print("Update complete.")
        
    except Exception as e:
        print(f"Error updating DB: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    fix_data()
