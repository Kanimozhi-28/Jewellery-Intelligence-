"""
Script to fetch all users (username and password) from the remote database
"""
from database import SessionLocal
from models import User

def get_all_users():
    """Fetch all users from remote database and display their credentials"""
    db = SessionLocal()
    try:
        users = db.query(User).all()
        
        if not users:
            print("No users found in the remote database.")
            return
        
        print("\n" + "="*80)
        print("USERS FROM REMOTE DATABASE")
        print("="*80)
        print(f"{'ID':<5} {'Username':<20} {'Password':<20} {'Role':<15} {'Full Name':<20} {'Active':<10}")
        print("-"*80)
        
        for user in users:
            print(f"{user.id:<5} {user.username:<20} {user.password_hash:<20} {str(user.role or 'N/A'):<15} {str(user.full_name or 'N/A'):<20} {str(user.is_active):<10}")
        
        print("="*80)
        print(f"\nTotal users found: {len(users)}")
        print("\nYou can use these credentials to login to the admin portal.")
        
    except Exception as e:
        print(f"Error fetching users from remote database: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    get_all_users()
