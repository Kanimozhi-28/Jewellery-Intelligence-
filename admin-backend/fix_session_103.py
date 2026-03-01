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

    print("--- FIXING SESSION 103 ---\n")
    
    # Update session 103 to point to Vishwa (ID 10)
    cur.execute("""
        UPDATE sessions 
        SET salesperson_id = 10 
        WHERE id = 103
    """)
    
    print(f"Updated {cur.rowcount} session(s)")
    
    # Verify the fix
    cur.execute("""
        SELECT 
            S.id, S.customer_id, S.salesperson_id,
            U.full_name AS salesperson_name,
            J.name AS jewel_name,
            SD.comments
        FROM sessions S
        JOIN users U ON S.salesperson_id = U.id
        JOIN session_details SD ON S.id = SD.session_id
        JOIN jewels J ON SD.jewel_id = J.id
        WHERE S.id = 103
    """)
    
    result = cur.fetchone()
    print("\n✅ VERIFIED - Session 103 now shows:")
    print(f"   Salesperson: {result[3]} (ID: {result[2]})")
    print(f"   Jewel: {result[4]}")
    print(f"   Comment: {result[5]}")
    
    conn.commit()
    conn.close()
    
    print("\n✅ Fix applied successfully!")

except Exception as e:
    print(f"Error: {e}")
    conn.rollback()
