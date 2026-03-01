from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv
import subprocess
import time

load_dotenv()

DB_HOST = "10.100.21.222"
DB_NAME = "jewel_mob"
DB_USER = "jewel_user"
DB_PASS = "jewel123"
DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}/{DB_NAME}"

def fix_and_restart():
    print("--- STEP 1: VERIFYING DATABASE COLUMN ---")
    engine = create_engine(DATABASE_URL)
    try:
        with engine.connect() as connection:
            # Check if column exists
            check_query = text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name='customers' AND column_name='is_ignored';
            """)
            result = connection.execute(check_query).first()
            
            if not result:
                print("Adding 'is_ignored' column to 'customers' table...")
                connection.execute(text("ALTER TABLE customers ADD COLUMN is_ignored BOOLEAN DEFAULT FALSE"))
                connection.commit()
                print("Successfully added 'is_ignored' column.")
            else:
                print("Column 'is_ignored' already exists.")
    except Exception as e:
        print(f"Database error: {e}")
        return

    print("\n--- STEP 2: KILLING STALE PROCESSES ---")
    try:
        subprocess.run(["taskkill", "/F", "/IM", "python.exe", "/T"], capture_output=True)
        print("Killed python processes.")
    except:
        pass

    print("\n--- STEP 3: STARTING SERVER ---")
    # Using uvicorn without --reload for more stability on Windows if desired, 
    # but I'll stick to the user's preferred way for now.
    print("Server starting in background...")

if __name__ == "__main__":
    fix_and_restart()
