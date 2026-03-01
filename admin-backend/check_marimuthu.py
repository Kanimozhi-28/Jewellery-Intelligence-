from sqlalchemy import text
from database import engine

def check_marimuthu():
    try:
        with engine.connect() as connection:
            print("Checking for user 'Marimuthu'...")
            result = connection.execute(text("SELECT id, username, full_name, role, is_active FROM users WHERE full_name ILIKE '%Marimuthu%' OR username ILIKE '%Marimuthu%'"))
            users = result.fetchall()
            
            if not users:
                print("User 'Marimuthu' NOT found in users table.")
                return

            for user in users:
                print(f"Found User: {user}")
                user_id = user.id
                
                # Check sessions count
                result = connection.execute(text(f"SELECT count(*) FROM sessions WHERE salesperson_id = {user_id}"))
                count = result.scalar()
                print(f"  Total Sessions: {count}")
                
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_marimuthu()
