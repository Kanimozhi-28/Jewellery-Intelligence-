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

    print("--- CHECKING ALL SESSION DETAILS WITH COMMENTS ---\n")
    
    # Get all session details that have comments
    cur.execute("""
        SELECT 
            SD.session_id,
            S.customer_id,
            J.name AS jewel_name,
            SD.comments,
            SD.action
        FROM session_details SD
        JOIN sessions S ON SD.session_id = S.id
        JOIN jewels J ON SD.jewel_id = J.id
        WHERE SD.comments IS NOT NULL AND SD.comments != ''
        ORDER BY SD.session_id
        LIMIT 20
    """)
    
    details = cur.fetchall()
    
    if details:
        print(f"Found {len(details)} session detail(s) with comments:\n")
        for detail in details:
            print(f"  Session ID: {detail[0]} | Customer: {detail[1]}")
            print(f"  Jewel: {detail[2]}")
            print(f"  Comment: '{detail[3]}'")
            print(f"  Action: {detail[4]}")
            print()
    else:
        print("❌ NO session details with comments found in database!")
        print("\nThis means:")
        print("  - Either all session_details were deleted")
        print("  - Or comments field is NULL/empty for all records")
    
    # Count total session_details
    cur.execute("SELECT COUNT(*) FROM session_details")
    total = cur.fetchone()[0]
    print(f"\nTotal session_details records: {total}")

    conn.close()

except Exception as e:
    print(f"Error: {e}")
