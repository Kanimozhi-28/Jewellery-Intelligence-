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

def delete_cre_user():
    print("--- DELETING CRE USER ---")
    try:
        with engine.connect() as connection:
            # Delete CRE user
            result = connection.execute(text("DELETE FROM users WHERE role = 'cre'"))
            connection.commit()
            print(f"Successfully deleted {result.rowcount} CRE user(s)")
            
            # Also drop the ignored_customers table if it exists
            connection.execute(text("DROP TABLE IF EXISTS ignored_customers"))
            connection.commit()
            print("Dropped ignored_customers table")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    delete_cre_user()
