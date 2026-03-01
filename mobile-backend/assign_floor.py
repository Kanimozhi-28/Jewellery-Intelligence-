from database import SessionLocal
import models

def assign_floors():
    db = SessionLocal()
    try:
        # Assign EMP2650 to Floor 1
        emp2650 = db.query(models.User).filter(models.User.username == "EMP2650").first()
        if emp2650:
            emp2650.floor = "Floor 1"
            print("EMP2650 assigned to Floor 1")

        # Assign sales1 to Floor 1
        sales1 = db.query(models.User).filter(models.User.username == "sales1").first()
        if sales1:
            sales1.floor = "Floor 1"
            print("sales1 assigned to Floor 1")
            
        db.commit()
            
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    assign_floors()
