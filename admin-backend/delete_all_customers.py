
import os
import psycopg2
from database import DB_HOST, DB_NAME, DB_USER, DB_PASS

def delete_all_customers():
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASS
        )
        cur = conn.cursor()

        print("!!! WARNING: DELETING ALL CUSTOMERS AND RELATED DATA !!!")
        
        # 1. Session Details (FK to Sessions)
        cur.execute("DELETE FROM session_details")
        print(f"Deleted {cur.rowcount} session_details.")

        # 1.5. Sales History (FK to Sessions - Found via error)
        # Check if exists first
        cur.execute("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'sales_history')")
        if cur.fetchone()[0]:
            cur.execute("DELETE FROM sales_history")
            print(f"Deleted {cur.rowcount} sales_history.")
        
        # 2. Sessions (FK to Customers)
        cur.execute("DELETE FROM sessions")
        print(f"Deleted {cur.rowcount} sessions.")
        
        # 3. Salesman Triggers (FK to Customers)
        cur.execute("DELETE FROM salesman_trigger")
        print(f"Deleted {cur.rowcount} salesman_triggers.")
        
        # 4. Family Members (FK to Customers)
        # Check if table exists first just in case
        cur.execute("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'family_members')")
        if cur.fetchone()[0]:
            cur.execute("DELETE FROM family_members")
            print(f"Deleted {cur.rowcount} family_members.")

        # 5. Customers
        cur.execute("DELETE FROM customers")
        print(f"Deleted {cur.rowcount} customers.")
        
        conn.commit()
        conn.close()
        print("--- ALL CUSTOMER DATA DELETED ---")

    except Exception as e:
        print(f"Error: {e}")
        conn.rollback()

if __name__ == "__main__":
    delete_all_customers()
