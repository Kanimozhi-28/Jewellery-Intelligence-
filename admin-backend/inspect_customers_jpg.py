from sqlalchemy import create_engine, text

DATABASE_URL = "postgresql://postgres:root@10.100.101.152:5432/Jewel_mob?sslmode=disable"

def inspect_jpg():
    try:
        engine = create_engine(DATABASE_URL)
        with engine.connect() as conn:
            # Query for customer_jpg content
            result = conn.execute(text("SELECT short_id, customer_jpg FROM customers WHERE customer_jpg IS NOT NULL LIMIT 1"))
            row = result.fetchone()
            if row:
                print(f"Short ID: {row.short_id}")
                content = str(row.customer_jpg)
                print(f"Content length: {len(content)}")
                print(f"First 100 chars: {content[:100]}")
                
                # Check if it looks like base64 (not a URL)
                if not content.startswith(('http://', 'https://')):
                    print("This looks like Base64 or raw data.")
                else:
                    print("This looks like a URL.")
            else:
                print("No rows with customer_jpg found.")
                
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    inspect_jpg()
