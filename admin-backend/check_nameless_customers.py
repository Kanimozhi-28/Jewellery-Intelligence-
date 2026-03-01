
import psycopg2
from database import DB_HOST, DB_NAME, DB_USER, DB_PASS

def check_nameless():
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASS
        )
        cur = conn.cursor()

        print("--- CHECKING FOR NAMELESS CUSTOMERS ---")
        
        # Check for NULL name
        cur.execute("SELECT id, short_id, name FROM customers WHERE name IS NULL OR name = ''")
        rows = cur.fetchall()
        
        print(f"Found {len(rows)} customers with NULL or empty name:")
        for r in rows[:20]:
            print(r)
            
        conn.close()

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_nameless()
