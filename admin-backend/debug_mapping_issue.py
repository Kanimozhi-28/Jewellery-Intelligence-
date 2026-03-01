
import psycopg2
from database import DB_HOST, DB_NAME, DB_USER, DB_PASS

def debug_mapping():
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASS
        )
        cur = conn.cursor()

        print("--- DEBUGGING MAPPING ISSUE ---")
        
        # 1. Check specific customer
        print("\n1. Checking Customer 201526:")
        cur.execute("SELECT id, short_id FROM customers WHERE short_id = '201526' OR id::text = '201526'")
        cust = cur.fetchone()
        if cust:
            print(f"   Found Customer: {cust}")
            cust_id = cust[0]
            
            # 2. Check sessions for this customer
            print(f"\n2. Checking Sessions for Customer ID {cust_id}:")
            query = """
                SELECT s.id, s.salesperson_id, u.full_name, u.username 
                FROM sessions s 
                JOIN users u ON s.salesperson_id = u.id 
                WHERE s.customer_id = %s
            """
            cur.execute(query, (cust_id,))
            sessions = cur.fetchall()
            for s in sessions:
                print(f"   Session {s[0]} -> Salesperson ID: {s[1]} | Name: {s[2]} | Username: {s[3]}")
        else:
            print("   Customer 201526 NOT FOUND in DB.")

        # 3. Check Users 'Vishwa' and 'Michael'
        print("\n3. Checking Users Table:")
        cur.execute("SELECT id, username, full_name, role FROM users WHERE full_name ILIKE '%Vishwa%' OR username ILIKE '%Vishwa%' OR full_name ILIKE '%Michael%' OR username ILIKE '%Michael%'")
        users = cur.fetchall()
        for u in users:
            print(f"   User: {u}")

        conn.close()

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    debug_mapping()
