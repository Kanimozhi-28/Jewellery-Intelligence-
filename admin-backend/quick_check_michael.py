from database import SessionLocal
from models import User
from sqlalchemy import or_

def quick_check():
    db = SessionLocal()
    try:
        # Find all users named Michael
        michaels = db.query(User).filter(
            or_(
                User.full_name.ilike('%michael%'),
                User.username.ilike('%michael%')
            )
        ).all()
        
        print("=" * 80)
        print("CHECKING FOR MICHAEL IN DATABASE")
        print("=" * 80)
        
        if not michaels:
            print("\nSUCCESS: No users named 'Michael' found!")
        else:
            print(f"\nFound {len(michaels)} user(s) named Michael:")
            for user in michaels:
                print(f"\n  ID: {user.id}")
                print(f"  Username: {user.username}")
                print(f"  Full Name: {user.full_name}")
                print(f"  Role: {user.role}")
        
        print("\n" + "=" * 80)
        print("ALL USERS IN DATABASE:")
        print("=" * 80)
        
        all_users = db.query(User).order_by(User.id).all()
        print(f"\nTotal users: {len(all_users)}\n")
        
        for user in all_users:
            print(f"ID: {user.id:<3} | Username: {user.username:<20} | Name: {user.full_name or 'N/A':<25} | Role: {user.role or 'N/A'}")
        
    finally:
        db.close()

if __name__ == "__main__":
    quick_check()
