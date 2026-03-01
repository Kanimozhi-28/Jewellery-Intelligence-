from database import SessionLocal
import models

def cleanup():
    db = SessionLocal()
    try:
        print("Finding customers starting with SIM...")
        to_delete = db.query(models.Customer).filter(models.Customer.short_id.like('SIM%')).all()
        count = len(to_delete)
        
        if count == 0:
            print("No simulation customers found.")
            return

        # Delete related records in correct order to avoid FK violations
        for c in to_delete:
            print(f"Cleaning up dependencies for customer {c.id} ({c.short_id})...")
            # 1. SalesHistory (FK to Session and Customer)
            db.query(models.SalesHistory).filter(models.SalesHistory.customer_id == c.id).delete()
            
            # 2. SessionDetail (FK to Session)
            sessions = db.query(models.Session).filter(models.Session.customer_id == c.id).all()
            for s in sessions:
                db.query(models.SessionDetail).filter(models.SessionDetail.session_id == s.id).delete()
            
            # 3. Sessions
            db.query(models.Session).filter(models.Session.customer_id == c.id).delete()
            
            # 4. SalesmanTrigger
            db.query(models.SalesmanTrigger).filter(models.SalesmanTrigger.customer_id == c.id).delete()
            
        print(f"Deleting {count} customers...")
        # Since we've cleared dependencies, we can delete the customers
        customer_ids = [c.id for c in to_delete]
        db.query(models.Customer).filter(models.Customer.id.in_(customer_ids)).delete(synchronize_session=False)
        db.commit()
        print("Cleanup complete.")
    except Exception as e:
        print(f"Error during cleanup: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    cleanup()
