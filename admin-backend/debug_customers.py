import psycopg2
from database import DB_HOST, DB_NAME, DB_USER, DB_PASS

IDS_TO_CHECK = ['122296', '124022', '575330', '134805', '318092', '296927', '256529']

def check_customers():
    try:
        conn = psycopg2.connect(host=DB_HOST, database=DB_NAME, user=DB_USER, password=DB_PASS)
        cur = conn.cursor()

        print("--- Checking Specific IDs ---")
        # Check if they exist as id or short_id
        for cid in IDS_TO_CHECK:
            cur.execute(f"SELECT * FROM customers WHERE short_id = '{cid}' OR CAST(id AS VARCHAR) = '{cid}'")
            res = cur.fetchone()
            if res:
                print(f"Found {cid}: {res}")
            else:
                print(f"MISSING {cid}")
        
        print("\n--- Total Count ---")
        cur.execute("SELECT COUNT(*) FROM customers")
        count = cur.fetchone()[0]
        print(f"Total customers in DB: {count}")

        print("\n--- Recent Customers (Top 10 by ID desc) ---")
        cur.execute("SELECT id, short_id, first_seen FROM customers ORDER BY id DESC LIMIT 10")
        for row in cur.fetchall():
            print(row)
            
        conn.close()

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_customers()
