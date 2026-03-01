from database import SessionLocal
from sqlalchemy import text

def inspect_customer_images():
    db = SessionLocal()
    try:
        print("\n--- Checking 'customer_jpg' Content ---")
        # Added limit to avoid flooding if many rows
        result = db.execute(text("SELECT id, short_id, substring(customer_jpg, 1, 50) as snippet, length(customer_jpg) as len FROM customers LIMIT 10"))
        
        rows = list(result)
        if not rows:
            print("No customers found.")
            
        for row in rows:
            # row is tuple: (id, short_id, snippet, len)
            print(f"ID: {row[0]}, ShortID: {row[1]}")
            print(f"  - Length: {row[3]}")
            print(f"  - Snippet: '{row[2]}'")
            
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    inspect_customer_images()
