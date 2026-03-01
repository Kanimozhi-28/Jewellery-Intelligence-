
import os
import psycopg2
from database import DB_HOST, DB_NAME, DB_USER, DB_PASS

def delete_cust_customers():
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASS
        )
        cur = conn.cursor()

        print("--- DELETING CUSTOMERS WITH 'CUST%' ---")
        
        # 1. Identify IDs
        cur.execute("SELECT id, short_id FROM customers WHERE short_id ILIKE 'cust%'")
        rows = cur.fetchall()
        
        if not rows:
            print("No customers found matching 'cust%'.")
            return

        ids_to_delete = [r[0] for r in rows]
        print(f"Found {len(ids_to_delete)} customers to delete:")
        for r in rows:
            print(f" - {r}")

        # 2. Delete dependencies first (sessions, family_members, etc)
        # Check sessions
        cur.execute("SELECT count(*) FROM sessions WHERE customer_id = ANY(%s)", (ids_to_delete,))
        session_count = cur.fetchone()[0]
        print(f"Deleting {session_count} related sessions...")
        
        # Need to delete session_details first!
        # Find session IDs
        cur.execute("SELECT id FROM sessions WHERE customer_id = ANY(%s)", (ids_to_delete,))
        session_ids = [s[0] for s in cur.fetchall()]
        
        if session_ids:
            cur.execute("DELETE FROM session_details WHERE session_id = ANY(%s)", (session_ids,))
            print(f"Deleted related session_details.")
            
            cur.execute("DELETE FROM sessions WHERE customer_id = ANY(%s)", (ids_to_delete,))
            print(f"Deleted sessions.")

        # Check family_members (if any)
        cur.execute("DELETE FROM family_members WHERE customer_id = ANY(%s)", (ids_to_delete,))
        
        # 3. Delete Customers
        cur.execute("DELETE FROM customers WHERE id = ANY(%s)", (ids_to_delete,))
        print(f"Successfully deleted {len(ids_to_delete)} customers.")
        
        conn.commit()
        conn.close()

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    delete_cust_customers()
