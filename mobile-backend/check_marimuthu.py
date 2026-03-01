from sqlalchemy.orm import Session
from database import SessionLocal
from models import User

def check_marimuthu():
    db: Session = SessionLocal()
    try:
        user = db.query(User).filter(User.username.ilike("marimuthu")).first()
        if user:
            print(f"User: {user.username}")
            print(f"Full Name: {user.full_name}")
            print(f"Role in DB: '{user.role}'")
        else:
            print("User 'marimuthu' not found.")
    finally:
        db.close()

if __name__ == "__main__":
    check_marimuthu()
