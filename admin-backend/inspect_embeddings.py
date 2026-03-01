from sqlalchemy import create_engine, text
import base64
import json

# Connection string
DATABASE_URL = "postgresql://postgres:root@10.100.101.152:5432/Jewel_mob?sslmode=disable"

def inspect_data():
    engine = create_engine(DATABASE_URL)
    with engine.connect() as conn:
        print("\n--- Inspecting USERS Table ---")
        # specific check for EMP2650 (EMP001) and EMP2927 (EMP002)
        query = text("SELECT id, username, full_name, customer_jpg, embedding FROM users WHERE username IN ('EMP2650', 'EMP2927') OR full_name IN ('EMP001', 'EMP002')")
        result = conn.execute(query).fetchall()
        
        for row in result:
            print(f"\nUser: {row.username} ({row.full_name})")
            print(f"customer_jpg: {row.customer_jpg}")
            
            emb = str(row.embedding) if row.embedding else ""
            print(f"Embedding Raw Type: {type(row.embedding)}")
            print(f"Embedding Length: {len(emb)}")
            
            if len(emb) > 0:
                print(f"Embedding Start (first 50): {emb[:50]}")
                # Check if it looks like a list
                if emb.strip().startswith('['):
                    print(">> Analysis: This appears to be a JSON Vector (Array of numbers). Cannot be displayed as image.")
                # Check if it looks like Base64 (alphanumeric, +, /, =)
                elif not emb.strip().startswith('['):
                    print(">> Analysis: Does NOT start with '['. checking if valid Base64...")
                    try:
                        # try decoding first 100 chars
                        base64.b64decode(emb[:100] + "===") 
                        print(">> Analysis: Valid Base64! This MIGHT be an image.")
                    except:
                         print(">> Analysis: Not standard Base64.")

        print("\n--- Inspecting CUSTOMERS Table (Just in case) ---")
        query_cust = text("SELECT id, short_id, embedding FROM customers WHERE short_id IN ('EMP001', 'EMP002')")
        result_cust = conn.execute(query_cust).fetchall()
        for row in result_cust:
             print(f"Customer Found: {row.short_id}, Embedding Len: {len(str(row.embedding))}")

if __name__ == "__main__":
    inspect_data()
