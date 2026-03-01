from database import SessionLocal
import models
from datetime import datetime

def clear_session(customer_id):
    db = SessionLocal()
    try:
        # Find active session
        session = db.query(models.Session).filter(
            models.Session.customer_id == customer_id,
            models.Session.status == "active"
        ).first()
        
        if session:
            print(f"Found active session {session.id} for customer {customer_id}. Ending it...")
            session.status = "completed"
            session.end_time = datetime.utcnow()
            session.notes = "Force closed by admin script"
            db.commit()
            print("Session closed. Customer is now free.")
        else:
            print(f"No active session found for customer {customer_id}.")
            
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    # The ID mentioned by user
    clear_session(698143) # Note: ID might be int '698143' or if it matches the 'id' column directly.
    # In earlier logs, 274584 and 329161, 698143 were seen as IDs. 
