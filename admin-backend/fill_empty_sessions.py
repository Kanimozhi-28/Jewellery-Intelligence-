import psycopg2
import random
from datetime import datetime, timedelta
from database import DB_HOST, DB_NAME, DB_USER, DB_PASS

def fill_empty_sessions():
    print("--- FILLING EMPTY SESSIONS ---")
    try:
        conn = psycopg2.connect(host=DB_HOST, database=DB_NAME, user=DB_USER, password=DB_PASS)
        cur = conn.cursor()

        # 1. Find sessions with NO details
        query_empty = """
            SELECT s.id, s.start_time 
            FROM sessions s
            LEFT JOIN session_details sd ON s.id = sd.session_id
            WHERE sd.id IS NULL;
        """
        cur.execute(query_empty)
        empty_sessions = cur.fetchall()
        print(f"Found {len(empty_sessions)} sessions with NO details.")

        if not empty_sessions:
            print("All sessions already have data!")
            return

        # 2. Get Jewels
        cur.execute("SELECT id FROM jewels;")
        jewels = [row[0] for row in cur.fetchall()]
        
        if not jewels:
            print("No jewels found.")
            return

        # 3. Generate Data
        actions = ['Shown', 'Shown', 'Shown', 'Sold']
        inserted_count = 0
        
        for session_id, start_time in empty_sessions:
            # Guarantee at least 1 item for every empty session
            num_details = random.randint(1, 4)
            
            for _ in range(num_details):
                jewel_id = random.choice(jewels)
                action = random.choice(actions)
                
                if start_time:
                    action_time = start_time + timedelta(minutes=random.randint(1, 45))
                else:
                    action_time = datetime.now()

                insert_q = """
                    INSERT INTO session_details (session_id, jewel_id, action, comments, timestamp)
                    VALUES (%s, %s, %s, %s, %s);
                """
                cur.execute(insert_q, (session_id, jewel_id, action, "Auto-filled data", action_time))
                inserted_count += 1

        conn.commit()
        print(f"Successfully filled gaps with {inserted_count} new records.")
        conn.close()

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    fill_empty_sessions()
