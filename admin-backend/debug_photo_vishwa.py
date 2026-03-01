import requests
import psycopg2
from database import DB_HOST, DB_NAME, DB_USER, DB_PASS

def check_debug():
    # 1. Check Database directly
    print("--- CHECKING DATABASE DIRECTLY ---")
    try:
        conn = psycopg2.connect(host=DB_HOST, database=DB_NAME, user=DB_USER, password=DB_PASS)
        cur = conn.cursor()
        cur.execute("SELECT id, username, customer_jpg FROM users WHERE id = 10")
        row = cur.fetchone()
        print(f"DB Record for ID 10: {row}")
        conn.close()
    except Exception as e:
        print(f"DB Error: {e}")

    # 2. Check API Response
    print("\n--- CHECKING API RESPONSE ---")
    try:
        response = requests.get("http://127.0.0.1:8000/users/?role=salesman")
        if response.status_code == 200:
            users = response.json()
            found = False
            for u in users:
                if u.get('id') == 10:
                    print(f"API User ID 10: photo='{u.get('photo')}'")
                    found = True
                    break
            if not found:
                print("User ID 10 not found in API response")
        else:
            print(f"API Error: Status {response.status_code}")
    except Exception as e:
        print(f"API Connection Error: {e}")

if __name__ == "__main__":
    check_debug()
