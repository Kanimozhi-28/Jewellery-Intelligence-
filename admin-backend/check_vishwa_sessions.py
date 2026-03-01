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

    print("--- CHECKING VISHWA'S ACTUAL SESSIONS ---\n")
    
    # Find Vishwa's user ID
    cur.execute("SELECT id, username, full_name FROM users WHERE full_name ILIKE '%Vishwa%' OR username ILIKE '%Vishwa%'")
    vishwa = cur.fetchone()
    if vishwa:
        print(f"Vishwa User: ID={vishwa[0]}, Username={vishwa[1]}, Name={vishwa[2]}")
        vishwa_id = vishwa[0]
    else:
        print("Vishwa not found!")
        vishwa_id = None
    
    # Find sessions with "Emerald Pendant"
    print("\n--- SESSIONS WITH 'EMERALD PENDANT' ---")
    cur.execute("""
        SELECT 
            S.id, S.customer_id, S.salesperson_id, S.start_time,
            U.full_name AS salesperson_name,
            J.name AS jewel_name,
            SD.comments
        FROM sessions S
        JOIN users U ON S.salesperson_id = U.id
        JOIN session_details SD ON S.id = SD.session_id
        JOIN jewels J ON SD.jewel_id = J.id
        WHERE J.name ILIKE '%emerald%' OR J.name ILIKE '%pendant%'
        ORDER BY S.start_time DESC
    """)
    
    emerald_sessions = cur.fetchall()
    for sess in emerald_sessions:
        print(f"\nSession ID: {sess[0]}")
        print(f"  Customer ID: {sess[1]}")
        print(f"  Salesperson ID: {sess[2]} ({sess[4]})")
        print(f"  Jewel: {sess[5]}")
        print(f"  Comment: {sess[6]}")
        print(f"  Time: {sess[3]}")
    
    if not emerald_sessions:
        print("No sessions found with Emerald Pendant")
    
    # Check if any sessions have wrong salesperson_id
    if emerald_sessions and vishwa_id:
        for sess in emerald_sessions:
            if sess[2] != vishwa_id:
                print(f"\n⚠️ MISMATCH FOUND!")
                print(f"   Session {sess[0]} shows salesperson_id={sess[2]} ({sess[4]})")
                print(f"   But should be salesperson_id={vishwa_id} (Vishwa)")

    conn.close()

except Exception as e:
    print(f"Error: {e}")
