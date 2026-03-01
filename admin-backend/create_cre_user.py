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

def create_cre_user():
    print("--- CREATING CRE TEST USER ---")
    try:
        with engine.connect() as connection:
            # Check if cre user already exists
            check = connection.execute(text("SELECT id FROM users WHERE username = 'cre_user'")).first()
            if check:
                print("CRE user 'cre_user' already exists.")
                return
            
            # Insert CRE user
            # Note: password is 'cre123'
            connection.execute(text("""
                INSERT INTO users (username, password_hash, full_name, role, is_active)
                VALUES ('cre_user', 'cre123', 'CRE Executive', 'cre', True)
            """))
            connection.commit()
            print("Successfully created CRE user: username='cre_user', password='cre123'")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    create_cre_user()
