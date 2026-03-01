import psycopg2
from database import DB_HOST, DB_NAME, DB_USER, DB_PASS

NAME_TO_CHECK = "Vishwa"

def check_user():
    print(f"--- Checking for User '{NAME_TO_CHECK}' ---")
    try:
        conn = psycopg2.connect(host=DB_HOST, database=DB_NAME, user=DB_USER, password=DB_PASS)
        cur = conn.cursor()

        # Check username or full_name case-insensitive
        query = f"""
            SELECT * FROM users 
            WHERE LOWER(username) LIKE LOWER('%{NAME_TO_CHECK}%') 
            OR LOWER(full_name) LIKE LOWER('%{NAME_TO_CHECK}%');
        """
        cur.execute(query)
        rows = cur.fetchall()
        
        if rows:
            print(f"Found {len(rows)} matching user(s):")
            for row in rows:
                print(row)
        else:
            print(f"No user found with name '{NAME_TO_CHECK}'.")
            
        print("\n--- All Users ---")
        cur.execute("SELECT id, username, full_name, role FROM users")
        for u in cur.fetchall():
            print(u)
            
        conn.close()

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_user()
