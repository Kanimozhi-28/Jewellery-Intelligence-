import psycopg2
from database import DB_HOST, DB_NAME, DB_USER, DB_PASS

def check_link():
    print("--- CHECKING SPECIFIC SESSION LINK ---")
    try:
        conn = psycopg2.connect(host=DB_HOST, database=DB_NAME, user=DB_USER, password=DB_PASS)
        cur = conn.cursor()

        # 1. Get first session ID
        cur.execute("SELECT id FROM sessions ORDER BY id LIMIT 1;")
        res = cur.fetchone()
        if not res:
            print("No sessions found.")
            return
        session_id = res[0]
        print(f"Checking Session ID: {session_id}")

        # 2. Check details for this ID
        cur.execute("SELECT id, session_id, action FROM session_details WHERE session_id = %s", (session_id,))
        rows = cur.fetchall()
        print(f"Found {len(rows)} detail records for Session {session_id}:")
        
        cur.execute("SELECT count(*) FROM session_details")
        total = cur.fetchone()[0]
        print(f"TOTAL session_details in DB: {total}")


        # 3. Check model FK definition assumption
        # models.SessionDetails.session_id should match sessions.id

        conn.close()

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_link()
