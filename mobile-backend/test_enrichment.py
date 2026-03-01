from main import enrich_customer, load_assignments
import models
import schemas
from database import SessionLocal

def test_enrich():
    db = SessionLocal()
    try:
        # Get one customer
        cust = db.query(models.Customer).first()
        if not cust:
            print("No customers in DB to test.")
            return
            
        assignments = load_assignments()
        enriched = enrich_customer(cust, assignments)
        print(f"Customer {cust.id} enriched successfully.")
        print(f"Assigned Salesperson ID: {enriched.assigned_salesperson_id}")
        print(f"Is Floating: {enriched.is_floating}")
        print(f"Assigned Salesperson Name: {enriched.assigned_salesperson_name}")
    except Exception as e:
        print(f"Error during test: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    test_enrich()
