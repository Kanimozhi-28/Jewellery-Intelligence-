import requests
from database import SessionLocal
import models
import time

API_URL = "http://localhost:8000"

def test_visibility_v2():
    print("--- Testing Visibility Rules (V2) ---")
    
    # 1. Setup Data: Ensure User_3 (First Floor) and Customer 274584 exist
    db = SessionLocal()
    try:
        # Create/Get Customer
        cust = db.query(models.Customer).filter(models.Customer.short_id == '274584').first()
        if not cust:
            print("Creating Customer 274584...")
            cust = models.Customer(short_id='274584', current_floor='First Floor')
            db.add(cust)
        else:
            cust.current_floor = 'First Floor' # Ensure sync
            
        # Create ML Detection
        det = models.MLDetection(random_id="274584", floor="First Floor", photo_path="test_v2")
        db.add(det)
        
        db.commit()
    finally:
        db.close()

    # 2. Test: User_3 (First Floor)
    # We saw ID 3 is user_3 in debug log
    print("\nQuerying as user_3 (ID 3, First Floor)...")
    try:
        r = requests.get(f"{API_URL}/customers?salesperson_id=3")
        data = r.json()
        ids = [c['short_id'] for c in data]
        print(f"IDs seen: {ids}")
        
        if '274584' in ids:
            print("PASS: First Floor user sees customer.")
        else:
            print("FAIL: First Floor user missed customer.")
            
    except Exception as e:
        print(f"Error: {e}")

    # 3. Test: User_1 (ID 1, Second Floor)
    print("\nQuerying as user_1 (ID 1, Second Floor)...")
    try:
        r = requests.get(f"{API_URL}/customers?salesperson_id=1")
        data = r.json()
        ids = [c['short_id'] for c in data]
        print(f"IDs seen: {ids}")
        
        if '274584' not in ids:
            print("PASS: Second Floor user does NOT see First Floor customer.")
        else:
            print("FAIL: Second Floor user SAW First Floor customer!")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_visibility_v2()
