from sqlalchemy import text
from database import engine

def test_create():
    try:
        with engine.connect() as conn:
            print("Testing if jewel_user can CREATE a new table...")
            conn.execute(text("CREATE TABLE IF NOT EXISTS test_permissions (id SERIAL PRIMARY KEY);"))
            conn.commit()
            print("✅ SUCCESS: Can create tables.")
            
            print("Cleaning up...")
            conn.execute(text("DROP TABLE test_permissions;"))
            conn.commit()
            return True
    except Exception as e:
        print(f"❌ FAILED: {e}")
        return False

if __name__ == "__main__":
    test_create()
