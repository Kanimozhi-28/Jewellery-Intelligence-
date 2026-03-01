import psycopg2
from database import DB_HOST, DB_NAME, DB_USER, DB_PASS

def check_jewel_data():
    print("--- CHECKING JEWEL & SESSION DATA ---")
    try:
        conn = psycopg2.connect(host=DB_HOST, database=DB_NAME, user=DB_USER, password=DB_PASS)
        cur = conn.cursor()

        # Check Jewels
        cur.execute("SELECT COUNT(*) FROM jewels;")
        jewel_count = cur.fetchone()[0]
        print(f"Total Jewels: {jewel_count}")
        if jewel_count > 0:
            cur.execute("SELECT id, name, barcode, price FROM jewels LIMIT 5;")
            print("Sample Jewels:", cur.fetchall())

        # Check Session Details
        cur.execute("SELECT COUNT(*) FROM session_details;")
        detail_count = cur.fetchone()[0]
        print(f"\nTotal Session Details: {detail_count}")
        if detail_count > 0:
            cur.execute("SELECT id, session_id, jewel_id, action, comments FROM session_details LIMIT 5;")
            print("Sample Session Details:", cur.fetchall())

        # Check Actions distribution
        if detail_count > 0:
            cur.execute("SELECT action, COUNT(*) FROM session_details GROUP BY action;")
            print("\nAction Distribution:", cur.fetchall())

        conn.close()

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_jewel_data()
