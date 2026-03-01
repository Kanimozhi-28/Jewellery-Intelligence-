from sqlalchemy import create_engine, text
import sys

DATABASE_URL = "postgresql://postgres:root@10.100.101.152:5432/Jewel_mob?sslmode=disable"

def inspect_db():
    try:
        engine = create_engine(DATABASE_URL)
        with engine.connect() as conn:
            print("--- Users Details ---")
            users = conn.execute(text("SELECT id, username, role, full_name, status FROM users")).fetchall()
            for u in users:
                print(f"User: {u.username}, Role: {u.role}, Status: {u.status}")

            print("\n--- Table Counts ---")
            for t in ['customers', 'jewels', 'sessions']:
                try:
                    count = conn.execute(text(f"SELECT COUNT(*) FROM {t}")).scalar()
                    print(f"{t}: {count}")
                except Exception as e:
                    print(f"{t}: Error {e}")
            
    except Exception as e:
        print("DB Error:", e)

if __name__ == "__main__":
    inspect_db()
