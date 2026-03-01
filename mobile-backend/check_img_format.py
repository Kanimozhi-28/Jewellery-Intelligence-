from database import SessionLocal
from sqlalchemy import text

def check_img():
    db = SessionLocal()
    try:
        # Check customer_jpg (singular)
        result = db.execute(text("SELECT id, substr(customer_jpg, 1, 50) FROM customers WHERE customer_jpg IS NOT NULL"))
        print("--- Image Data Snippets ---")
        rows = result.fetchall()
        if not rows:
            print("No rows with photos found.")
        for row in rows:
            print(f"ID: {row[0]}, Start: '{row[1]}...'")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check_img()
