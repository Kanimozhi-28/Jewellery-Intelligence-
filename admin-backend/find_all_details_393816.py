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

    print("=== FINDING ALL SESSION_DETAILS FOR CUSTOMER 393816 ===\n")
    
    # Get ALL session_details for this customer's sessions
    cur.execute("""
        SELECT 
            S.id AS session_id,
            SD.id AS detail_id,
            J.name AS jewel_name,
            SD.comments,
            SD.action
        FROM sessions S
        LEFT JOIN session_details SD ON S.id = SD.session_id
        LEFT JOIN jewels J ON SD.jewel_id = J.id
        WHERE S.customer_id = 393816
        ORDER BY S.id, SD.id
    """)
    
    rows = cur.fetchall()
    
    print(f"Found {len(rows)} session_detail records:\n")
    for row in rows:
        print(f"Session {row[0]}: Detail {row[1]} | Jewel: {row[2]} | Comments: '{row[3]}' | Action: {row[4]}")

    conn.close()

except Exception as e:
    print(f"Error: {e}")
