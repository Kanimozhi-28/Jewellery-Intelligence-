from database import SessionLocal
from sqlalchemy import text

def check_trigger_schema():
    db = SessionLocal()
    try:
        print("\n--- Checking 'salesman_trigger' Schema ---")
        # Query information_schema
        result = db.execute(text("SELECT column_name, data_type, character_maximum_length FROM information_schema.columns WHERE table_name = 'salesman_trigger' AND column_name = 'customer_jpg'"))
        row = result.fetchone()
        if row:
            print(f"Column: {row[0]}")
            print(f"Type: {row[1]}")
            print(f"Max Length: {row[2]}")
        else:
            print("Column not found.")

        print("\n--- Checking 'customers' Schema ---")
        result = db.execute(text("SELECT column_name, data_type, character_maximum_length FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'customer_jpg'"))
        row = result.fetchone()
        if row:
            print(f"Column: {row[0]}")
            print(f"Type: {row[1]}")
            print(f"Max Length: {row[2]}")
            
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check_trigger_schema()
