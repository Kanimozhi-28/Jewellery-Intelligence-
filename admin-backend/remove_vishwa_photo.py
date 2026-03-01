import psycopg2
from database import DB_HOST, DB_NAME, DB_USER, DB_PASS

USER_ID = 10
USERNAME = "vishwa"

def remove_photo():
    print(f"--- Removing photo for User '{USERNAME}' (ID: {USER_ID}) ---")
    try:
        conn = psycopg2.connect(host=DB_HOST, database=DB_NAME, user=DB_USER, password=DB_PASS)
        cur = conn.cursor()

        # Update query
        query = "UPDATE users SET customer_jpg = NULL WHERE id = %s;"
        cur.execute(query, (USER_ID,))
        conn.commit()
        
        print(f"Update executed. Rows affected: {cur.rowcount}")

        # Verify
        cur.execute("SELECT id, username, customer_jpg FROM users WHERE id = %s", (USER_ID,))
        updated_row = cur.fetchone()
        print(f"Updated User Record: {updated_row}")
            
        conn.close()

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    remove_photo()
