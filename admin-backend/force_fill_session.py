import psycopg2
from database import DB_HOST, DB_NAME, DB_USER, DB_PASS
from datetime import datetime

SESSION_ID = 44

def force_insert():
    print(f"--- FORCING INSERT FOR SESSION {SESSION_ID} ---")
    conn = psycopg2.connect(host=DB_HOST, database=DB_NAME, user=DB_USER, password=DB_PASS)
    cur = conn.cursor()

    # 1. Check if exists (should be 0 based on prev)
    cur.execute("SELECT count(*) FROM session_details WHERE session_id = %s", (SESSION_ID,))
    print(f"Before: {cur.fetchone()[0]}")

    # 2. Insert
    cur.execute("SELECT id FROM jewels LIMIT 1")
    jewel_id = cur.fetchone()[0]
    
    query = """
        INSERT INTO session_details (session_id, jewel_id, action, comments, timestamp)
        VALUES (%s, %s, 'Shown', 'Forced Insert', %s);
    """
    cur.execute(query, (SESSION_ID, jewel_id, datetime.now()))
    conn.commit()
    print("Inserted and Committed.")

    # 3. Check again
    cur.execute("SELECT count(*) FROM session_details WHERE session_id = %s", (SESSION_ID,))
    print(f"After: {cur.fetchone()[0]}")
    
    conn.close()

if __name__ == "__main__":
    force_insert()
