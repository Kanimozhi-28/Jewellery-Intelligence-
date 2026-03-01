from sqlalchemy import text
from database import engine

def check_schema():
    try:
        with engine.connect() as connection:
            print("Checking for family_id column in customers table...")
            # Try to select the column. If it fails, it throws an error.
            result = connection.execute(text("SELECT id, family_id FROM customers LIMIT 5"))
            rows = result.fetchall()
            print(f"Success! Found {len(rows)} rows.")
            for row in rows:
                print(row)
                
            print("\nChecking specifically for family_id = 8:")
            result = connection.execute(text("SELECT id, short_id, family_id, family_relationship FROM customers WHERE family_id = 8"))
            rows = result.fetchall()
            if rows:
                print(f"Found {len(rows)} members for family 8:")
                for row in rows:
                    print(row)
            else:
                print("No members found for family_id 8.")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_schema()
