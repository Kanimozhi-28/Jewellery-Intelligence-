import os
import psycopg2
from database import DB_HOST, DB_NAME, DB_USER, DB_PASS

try:
    conn = psycopg2.connect(
        host=DB_HOST,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASS
    )
    cur = conn.cursor()

    # Inspect columns
    cur.execute("SELECT column_name FROM information_schema.columns WHERE table_name = 'customers'")
    columns = [col[0] for col in cur.fetchall()]
    print(f"Columns in 'customers' table: {columns}")

    print("\n--- CHECKING FOR NON-NUMERIC SHORT_IDs ---")
    # Using regex to find short_ids that contain non-digits
    cur.execute("SELECT id, short_id FROM customers WHERE short_id !~ '^[0-9]+$' LIMIT 50")
    rows = cur.fetchall()
    print(f"Found {len(rows)} non-numeric short_ids:")
    for r in rows:
        print(r)

    print("\n--- CHECKING FOR 'Micael' ---")
    cur.execute("SELECT id, short_id FROM customers WHERE short_id ILIKE '%Micael%'")
    rows = cur.fetchall()
    print(f"Found {len(rows)} matching 'Micael':")
    for r in rows:
        print(r)

except Exception as e:
    print(f"Error: {e}")
