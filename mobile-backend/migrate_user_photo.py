from database import engine
from sqlalchemy import text

def migrate():
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE users ADD COLUMN photo_url VARCHAR"))
            conn.commit()
            print("Successfully added photo_url column to users")
        except Exception as e:
            print(f"Error or already exists: {e}")

if __name__ == "__main__":
    migrate()
