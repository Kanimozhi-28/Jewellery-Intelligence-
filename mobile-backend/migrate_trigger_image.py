from database import SessionLocal, engine
from sqlalchemy import text

def fix_schema_migration():
    db = SessionLocal()
    try:
        print("Migrating schema: changing salesman_trigger.customer_jpg to TEXT...")
        
        # PostgreSQL specific alter command
        # This preserves data (though existing data might be truncated, new data will be fine)
        db.execute(text("ALTER TABLE salesman_trigger ALTER COLUMN customer_jpg TYPE TEXT;"))
        db.commit()
        
        print("Migration successful.")
        
    except Exception as e:
        print(f"Migration failed: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    fix_schema_migration()
