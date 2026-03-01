from database import SessionLocal
import models
from sqlalchemy import or_

def check_login(username_input):
    db = SessionLocal()
    try:
        print(f"Checking login for: '{username_input}'")
        
        # 1. Direct fetch
        user_direct = db.query(models.User).filter(models.User.username == username_input).first()
        print(f"Direct Username match: {user_direct.username if user_direct else 'Not Found'}")

        # 2. Logic from main.py
        user_or = db.query(models.User).filter(
            or_(
                models.User.username == username_input,
                models.User.full_name == username_input
            )
        ).first()
        print(f"OR Logic match: {'Success' if user_or else 'Fail'}")
        
        if user_or:
            print(f"User Details: ID={user_or.id}, Username='{user_or.username}', FullName='{user_or.full_name}'")

    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check_login("EMP2650")
