from database import SessionLocal
import models

def list_data():
    db = SessionLocal()
    try:
        print("--- Salespersons ---")
        salespersons = db.query(models.User).filter(models.User.role == 'salesman').all()
        for s in salespersons:
            print(f"ID: {s.id} | Username: {s.username} | Name: {s.full_name} | Floor: {s.floor}")
            
        print("\n--- Customers (showing first 20) ---")
        customers = db.query(models.Customer).limit(20).all()
        for c in customers:
            print(f"ID: {c.id} | Short ID: {c.short_id} | In Store: {c.is_in_store} | Floor: {c.current_floor}")
        
        total_customers = db.query(models.Customer).count()
        print(f"\nTotal Customers in DB: {total_customers}")

    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    list_data()
