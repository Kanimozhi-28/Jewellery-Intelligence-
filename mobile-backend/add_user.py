from database import SessionLocal
import models
from passlib.context import CryptContext

FAKE_HASH = "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxwKc.6.Fhd.6.Fhd" 

def add_emp001():
    db = SessionLocal()
    try:
        # Check if exists
        if not db.query(models.User).filter(models.User.username == "EMP001").first():
            print("Adding EMP001...")
            new_user = models.User(
                username="EMP001",
                full_name="EMP001 Name", # Setting name same as ID if they try to login by name
                password_hash=FAKE_HASH,
                role="salesman"
            )
            db.add(new_user)
            db.commit()
            print("EMP001 added.")
        else:
            print("EMP001 already exists.")
            
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    add_emp001()
