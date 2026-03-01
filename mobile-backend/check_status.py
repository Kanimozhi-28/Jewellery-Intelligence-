from database import SessionLocal
import models
from sqlalchemy import func

def check():
    db = SessionLocal()
    try:
        in_store = db.query(models.Customer).filter(models.Customer.is_in_store == True).count()
        print(f"Customers currently in store: {in_store}")
        
        max_detection_id = db.query(func.max(models.MLDetection.id)).scalar()
        print(f"Max detection ID in DB: {max_detection_id}")
        
        # Check if there are any cre users
        cre_users = db.query(models.User).filter(models.User.role == 'cre').all()
        print(f"CRE Users: {[u.username for u in cre_users]}")
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check()
