from database import SessionLocal
import models

def check_data():
    db = SessionLocal()
    try:
        customers = db.query(models.Customer).all()
        print(f"Total Customers: {len(customers)}")
        for c in customers:
            print(f" - ID: {c.id}, ShortID: {c.short_id}, Name/Info: {c.current_floor}")
            
        users = db.query(models.User).all()
        print(f"\nTotal Users: {len(users)}")
        for u in users:
            print(f" - ID: {u.id}, Username: {u.username}")

        sessions = db.query(models.Session).all()
        print(f"\nTotal Sessions: {len(sessions)}")
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check_data()
