from database import SessionLocal, engine
import models
from sqlalchemy import text

# Add column if not exists (Hack for sqlite/postgres if migration tool missing)
# But since we use SQLA create_all, it only creates if table missing. 
# We might need to manually alter table or just rely on the user knowing their DB schema state.
# Assuming I need to ALTER table for existing DB.
def migrate_and_seed():
    db = SessionLocal()
    try:
        # 1. Attempt add column (Postgres specific syntax usually, but works for general SQL)
        try:
           db.execute(text("ALTER TABLE customers ADD COLUMN customers_jpg TEXT"))
           db.commit()
           print("Column added.")
        except Exception as e:
           print("Column might already exist or error:", e)
           db.rollback()

        # 2. Add dummy base64 to existing users
        customers = db.query(models.Customer).all()
        # Use a tiny 1x1 pixel base64 or a small icon for test
        # Red Dot 
        dummy_b64 = "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA="
        
        for c in customers:
            if not c.customers_jpg:
                c.customers_jpg = dummy_b64
                print(f"Added dummy base64 to {c.id}")
        
        db.commit()
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    migrate_and_seed()
