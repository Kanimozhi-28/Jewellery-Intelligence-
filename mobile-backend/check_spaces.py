from database import SessionLocal
import models

def check_spaces():
    db = SessionLocal()
    try:
        customers = db.query(models.Customer).limit(5).all()
        for c in customers:
            jpg = c.customer_jpg
            if jpg:
                if ' ' in jpg:
                    print(f"ID {c.id}: Found SPACES in data! Count: {jpg.count(' ')}")
                else:
                    print(f"ID {c.id}: No spaces found.")
                    
                if '\n' in jpg:
                     print(f"ID {c.id}: Found newlines.")
    finally:
        db.close()

if __name__ == "__main__":
    check_spaces()
