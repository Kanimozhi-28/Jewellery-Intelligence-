from sqlalchemy.orm import Session
from database import SessionLocal
from models import User
from sqlalchemy import or_

def check_user_david():
    db: Session = SessionLocal()
    try:
        print("Searching for users with 'David' in username or full_name...")
        # Case-insensitive search
        users = db.query(User).filter(
            or_(
                User.username.ilike("%David%"),
                User.full_name.ilike("%David%")
            )
        ).all()
        
        if users:
            print(f"Found {len(users)} user(s) matching 'David':")
            for user in users:
                print(f"  - ID: {user.id}")
                print(f"    Username: {user.username}")
                print(f"    Full Name: {user.full_name}")
                print(f"    Role: {user.role}")
                print(f"    Active: {user.is_active}")
                print("-" * 20)
        else:
            print("No users found matching 'David'.")

    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check_user_david()
