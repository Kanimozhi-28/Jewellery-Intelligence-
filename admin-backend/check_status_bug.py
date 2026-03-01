from sqlalchemy import create_engine, text

# Connection string
DATABASE_URL = "postgresql://postgres:root@10.100.101.152:5432/Jewel_mob?sslmode=disable"

def check_michael():
    try:
        engine = create_engine(DATABASE_URL)
        with engine.connect() as conn:
            # Check columns
            print("--- Table Columns ---")
            columns = conn.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name = 'users'")).fetchall()
            print([c[0] for c in columns])
            
            # Find Michael
            print("\n--- Finding Michael ---")
            result = conn.execute(text("SELECT id, username, full_name, role, status FROM users WHERE full_name ILIKE '%Michael%' OR username ILIKE '%Michael%'"))
            rows = result.fetchall()
            if not rows:
                print("No user found with name 'Michael'. Listing all users:")
                all_users = conn.execute(text("SELECT id, username, full_name, status FROM users")).fetchall()
                for u in all_users:
                    print(u)
            else:
                for row in rows:
                    print(f"Found: {row}")
            
    except Exception as e:
        print("Error:")
        print(e)

if __name__ == "__main__":
    check_michael()
