from database import SessionLocal
import models

def list_users():
    db = SessionLocal()
    try:
        users = db.query(models.User).all()
        print(f"{'ID':<5} | {'Username':<15} | {'Role':<10} | {'Full Name':<20}")
        print("-" * 60)
        for u in users:
            print(f"{u.id:<5} | {u.username:<15} | {u.role:<10} | {u.full_name or '':<20}")
    finally:
        db.close()

if __name__ == "__main__":
    list_users()
