from sqlalchemy import create_engine, text

# Connection string
DATABASE_URL = "postgresql://postgres:root@10.100.101.152:5432/Jewel_mob?sslmode=disable"

def get_users():
    try:
        engine = create_engine(DATABASE_URL)
        with engine.connect() as conn:
            result = conn.execute(text("SELECT id, username, password_hash, role, full_name FROM users"))
            print(f"{'ID':<5} {'Username':<15} {'Password/Hash':<20} {'Role':<10} {'Name'}")
            print("-" * 65)
            for row in result:
                print(f"{row.id:<5} {row.username:<15} {row.password_hash:<20} {row.role:<10} {row.full_name}")
            
    except Exception as e:
        print("Error fetching users:")
        print(e)

if __name__ == "__main__":
    get_users()
