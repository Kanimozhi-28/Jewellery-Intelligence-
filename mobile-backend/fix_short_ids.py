from database import SessionLocal
import models

def fix_short_ids():
    db = SessionLocal()
    try:
        print("Scaning for customers with missing short_id...")
        
        # Find customers with null short_id
        customers = db.query(models.Customer).filter(models.Customer.short_id == None).all()
        
        if not customers:
            print("All customers have short_ids. Looking for 'None' string just in case.")
            customers = db.query(models.Customer).filter(models.Customer.short_id == 'None').all()

        count = 0
        for c in customers:
            c.short_id = str(c.id)
            print(f"Fixed Customer {c.id}: short_id set to '{c.short_id}'")
            count += 1
            
        if count > 0:
            db.commit()
            print(f"Successfully fixed {count} records.")
        else:
            print("No records needed fixing.")
            
    finally:
        db.close()

if __name__ == "__main__":
    fix_short_ids()
