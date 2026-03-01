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

    print("--- CHECKING SESSION 103 COMMENTS ---\n")
    
    # Get all session details with comments for Session 103
    cur.execute("""
        SELECT 
            SD.id,
            J.name AS jewel_name,
            SD.comments,
            SD.action
        FROM session_details SD
        JOIN jewels J ON SD.jewel_id = J.id
        WHERE SD.session_id = 103
    """)
    
    details = cur.fetchall()
    
    if details:
        print(f"Found {len(details)} session detail(s) for Session 103:\n")
        for detail in details:
            print(f"  Detail ID: {detail[0]}")
            print(f"  Jewel: {detail[1]}")
            print(f"  Comment: '{detail[2]}'")
            print(f"  Action: {detail[3]}")
            print()
    else:
        print("No session details found for Session 103")
    
    # Also check session.notes field
    cur.execute("SELECT notes FROM sessions WHERE id = 103")
    session_notes = cur.fetchone()
    print(f"Session-level notes: '{session_notes[0] if session_notes and session_notes[0] else 'NULL'}'")

    conn.close()

except Exception as e:
    print(f"Error: {e}")
