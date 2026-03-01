from database import SessionLocal
from sqlalchemy import text

def inspect_db():
    db = SessionLocal()
    try:
        # 1. Check Columns in 'customers' table using SQL (DB agnostic-ish)
        print("--- Checking Columns ---")
        try:
            # PostgreSQL
            result = db.execute(text("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'customers';"))
            for row in result:
                print(f"Col: {row[0]} ({row[1]})")
        except Exception as e:
            print(f"Could not query info schema (might be sqlite?): {e}")

        # 2. Check Content of customers_jpg
        print("\n--- Checking Content ---")
        result = db.execute(text("SELECT id, substring(customers_jpg, 1, 30) as snippet, length(customers_jpg) as len FROM customers"))
        for row in result:
            # row: (id, snippet, length)
            print(f"ID: {row[0]}, JPGLen: {row[2]}, Snippet: {row[1]}...")
            
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    inspect_db()
