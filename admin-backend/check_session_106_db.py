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

    print("=== CHECKING SESSION 106 IN DATABASE ===\n")
    
    # Get session details for session 106
    cur.execute("""
        SELECT 
            SD.id,
            SD.session_id,
            SD.jewel_id,
            SD.action,
            SD.comments,
            J.name AS jewel_name
        FROM session_details SD
        LEFT JOIN jewels J ON SD.jewel_id = J.id
        WHERE SD.session_id = 106
    """)
    
    details = cur.fetchall()
    
    if details:
        print(f"Found {len(details)} detail(s) for Session 106:\n")
        for detail in details:
            print(f"  Detail ID: {detail[0]}")
            print(f"  Session ID: {detail[1]}")
            print(f"  Jewel ID: {detail[2]}")
            print(f"  Action: {detail[3]}")
            print(f"  Comments: '{detail[4]}'")
            print(f"  Jewel Name: {detail[5]}")
            print()
    else:
        print("No details found for Session 106")
        
        # Check if session 106 exists
        cur.execute("SELECT id, customer_id, salesperson_id FROM sessions WHERE id = 106")
        session = cur.fetchone()
        if session:
            print(f"\nSession 106 exists: Customer={session[1]}, Salesperson={session[2]}")
        else:
            print("\nSession 106 does NOT exist!")

    conn.close()

except Exception as e:
    print(f"Error: {e}")
