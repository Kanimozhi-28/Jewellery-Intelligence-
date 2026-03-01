from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()

DB_HOST = "10.100.21.222"
DB_NAME = "jewel_mob"
DB_USER = "jewel_user"
DB_PASS = "jewel123"
DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}/{DB_NAME}"

engine = create_engine(DATABASE_URL)

def add_missing_column():
    print("--- UPDATING REMOTE DB SCHEMA ---")
    try:
        with engine.connect() as connection:
            # Check if column exists first to avoid error if already present
            check_query = text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name='customers' AND column_name='is_ignored';
            """)
            result = connection.execute(check_query).first()
            
            if result:
                print("Column 'is_ignored' already exists in 'customers' table.")
            else:
                print("Adding 'is_ignored' column to 'customers' table...")
                connection.execute(text("ALTER TABLE customers ADD COLUMN is_ignored BOOLEAN DEFAULT FALSE"))
                connection.commit()
                print("Successfully added 'is_ignored' column.")
    except Exception as e:
        print(f"Error updating database: {e}")

if __name__ == "__main__":
    add_missing_column()
