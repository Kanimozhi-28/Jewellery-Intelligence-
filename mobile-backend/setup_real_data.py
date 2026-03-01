from database import SessionLocal
import models
from datetime import datetime, timedelta

def setup_real_data():
    db = SessionLocal()
    try:
        print("Setting up Salespersons floors...")
        floor_map = {
            10: "Entrance",
            15: "First Floor",
            13: "Second Floor",
            19: "First Floor" # EMP001
        }
        for uid, floor in floor_map.items():
            user = db.query(models.User).filter(models.User.id == uid).first()
            if user:
                user.floor = floor
                db.add(user)
        
        print("Resetting all customers to out-of-store...")
        db.query(models.Customer).update({models.Customer.is_in_store: False})
        
        print("Marking 5 real customers as In-Store...")
        # Get 5 real customers that are NOT SIM prefix (we already deleted those, but safely)
        customers = db.query(models.Customer).limit(5).all()
        
        floors = ["Entrance", "First Floor", "Second Floor", "Entrance", "First Floor"]
        
        for i, c in enumerate(customers):
            c.is_in_store = True
            c.current_floor = floors[i % len(floors)]
            # Set first_seen to 1-5 minutes ago to appear as "waiting" in CRE dash
            c.first_seen = datetime.utcnow() - timedelta(minutes=(i + 1))
            c.last_seen = datetime.utcnow()
            print(f"Marked Customer {c.id} ({c.short_id}) as In-Store on {c.current_floor}")
            db.add(c)
            
        db.commit()
        print("Setup complete.")
        
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    setup_real_data()
