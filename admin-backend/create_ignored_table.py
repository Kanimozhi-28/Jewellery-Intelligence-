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

def create_table_safe():
    print("--- CREATING IGNORED_CUSTOMERS TABLE (SAFE MODE) ---")
    try:
        with engine.connect() as connection:
            # Create the table without FK constraint to avoid "must be owner" error
            connection.execute(text("""
                CREATE TABLE IF NOT EXISTS ignored_customers (
                    id SERIAL PRIMARY KEY,
                    customer_id INTEGER UNIQUE NOT NULL,
                    reason TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            """))
            connection.commit()
            print("Successfully created 'ignored_customers' table.")
    except Exception as e:
        print(f"Error creating table: {e}")

if __name__ == "__main__":
    create_table_safe()
