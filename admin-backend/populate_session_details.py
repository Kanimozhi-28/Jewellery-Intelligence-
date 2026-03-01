import psycopg2
import random
from datetime import datetime, timedelta
from database import DB_HOST, DB_NAME, DB_USER, DB_PASS

def populate_details():
    print("--- POPULATING SESSION DETAILS ---")
    try:
        conn = psycopg2.connect(host=DB_HOST, database=DB_NAME, user=DB_USER, password=DB_PASS)
        cur = conn.cursor()

        # 1. Get all Session IDs
        cur.execute("SELECT id, start_time FROM sessions;")
        sessions = cur.fetchall()
        print(f"Found {len(sessions)} sessions.")

        if not sessions:
            print("No sessions found to populate.")
            return

        # 2. Get all Jewel IDs
        cur.execute("SELECT id FROM jewels;")
        jewels = [row[0] for row in cur.fetchall()]
        print(f"Found {len(jewels)} jewels.")

        if not jewels:
            print("No jewels found to populate.")
            return

        # 3. Generate Data
        actions = ['Shown', 'Shown', 'Shown', 'Shown', 'Sold'] # 20% chance of Sold/Purchased
        
        inserted_count = 0
        
        for session_id, start_time in sessions:
            # 50% chance to have details for a session
            # Actually user wants data so maybe higher chance? Let's say 80%
            if random.random() < 0.2: 
                continue

            num_details = random.randint(1, 3)
            
            for _ in range(num_details):
                jewel_id = random.choice(jewels)
                action = random.choice(actions)
                
                # Timestamp slightly after start_time
                if start_time:
                    action_time = start_time + timedelta(minutes=random.randint(1, 30))
                else:
                    action_time = datetime.now()

                query = """
                    INSERT INTO session_details (session_id, jewel_id, action, comments, timestamp)
                    VALUES (%s, %s, %s, %s, %s);
                """
                cur.execute(query, (session_id, jewel_id, action, f"Customer interest: {random.choice(['High', 'Medium', 'Low'])}", action_time))
                inserted_count += 1

        conn.commit()
        print(f"Successfully inserted {inserted_count} session detail records.")
        conn.close()

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    populate_details()
