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

    print("--- CHECKING DATABASE STATE ---")
    
    # Count sessions
    cur.execute("SELECT COUNT(*) FROM sessions")
    session_count = cur.fetchone()[0]
    print(f"Total Sessions: {session_count}")
    
    # Count session_details
    cur.execute("SELECT COUNT(*) FROM session_details")
    details_count = cur.fetchone()[0]
    print(f"Total Session Details: {details_count}")
    
    # Count customers
    cur.execute("SELECT COUNT(*) FROM customers")
    customer_count = cur.fetchone()[0]
    print(f"Total Customers: {customer_count}")
    
    # Sample one session if exists
    if session_count > 0:
        print("\n--- SAMPLE SESSION ---")
        cur.execute("""
            SELECT s.id, s.salesperson_id, s.customer_id, s.start_time, u.full_name
            FROM sessions s
            LEFT JOIN users u ON s.salesperson_id = u.id
            LIMIT 1
        """)
        session = cur.fetchone()
        print(f"Session: {session}")

    conn.close()

except Exception as e:
    print(f"Error: {e}")
