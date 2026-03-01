import requests
import psycopg2
from database import DB_HOST, DB_NAME, DB_USER, DB_PASS

def check_db():
    print("--- Database Check ---")
    try:
        conn = psycopg2.connect(host=DB_HOST, database=DB_NAME, user=DB_USER, password=DB_PASS)
        cur = conn.cursor()
        
        tables = ['users', 'customers', 'sessions']
        for table in tables:
            try:
                cur.execute(f"SELECT COUNT(*) FROM {table}")
                count = cur.fetchone()[0]
                print(f"Table '{table}': {count} rows")
            except Exception as e:
                print(f"Table '{table}': Error - {e}")
                conn.rollback()
        
        conn.close()
    except Exception as e:
        print(f"DB Connection Error: {e}")

def check_api():
    print("\n--- API Check ---")
    endpoints = {
        'users_query': 'http://localhost:8000/users/?role=salesman',
        'customers': 'http://localhost:8000/customers/',
        'sessions': 'http://localhost:8000/sessions/'
    }
    
    for name, url in endpoints.items():
        try:
            resp = requests.get(url)
            if resp.status_code == 200:
                data = resp.json()
                print(f"API '/{name}/': Returned {len(data)} items")
                if len(data) > 0:
                    item_str = str(data[0])
                    print(f"Sample {name} size: {len(item_str)} chars")
                    print(f"Sample {name} start: {item_str[:100]}")
            else:
                print(f"API '/{name}/': Failed with {resp.status_code} - {resp.text}")
        except Exception as e:
             print(f"API '/{name}/': Error - {e}")

if __name__ == "__main__":
    check_db()
    check_api()
