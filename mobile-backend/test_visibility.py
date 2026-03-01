import requests

API_URL = "http://localhost:8000"

def test_visibility():
    # 1. Get IDs for EMP2650 (ID 3, First Floor) and user_2 (ID 4, Second Floor - Assuming ID 4, will resolve if needed)
    # Check User IDs first
    
    print("--- Testing Visibility Rules ---")
    
    # Simulating EMP2650 (First Floor)
    # We know simulation added a detection on "First Floor" mapped to specific customer? 
    # Actually simulation added random_id "ML-..." which might not match existing Customer short_id "274584" etc.
    # To test properly, I need to ensure an ML detection exists for a KNOWN customer ID.
    
    print("Injecting detection for known customer '274584' on First Floor...")
    # I'll rely on my previous simulate script logic or do it via DB here if needed, 
    # but the API code queries DB. Let's just create a quick detection entry first.
    from database import SessionLocal
    import models
    db = SessionLocal()
    
    try:
        det = models.MLDetection(random_id="274584", floor="First Floor", photo_path="test")
        db.add(det)
        db.commit()
    except Exception as e:
        print(e)
    finally:
        db.close()

    # Now Query as EMP2650 (ID 3 - First Floor)
    print("\nQuerying is EMP2650 (First Floor)...")
    try:
        r = requests.get(f"{API_URL}/customers?salesperson_id=3")
        customers = r.json()
        ids = [c['short_id'] for c in customers]
        print(f"Result: {ids}")
        if "274584" in ids:
            print("PASS: EMP2650 sees 274584")
        else:
            print("FAIL: EMP2650 does not see 274584")
    except Exception as e:
        print(f"Req Error: {e}")

    # Now Query as Sales1 (ID 2 - Second Floor) - I assigned Sales1 to First Floor earlier? 
    # Let's use ID 99 (Non-existent) or find a Second Floor user.
    # I'll assume user_2 is on Second Floor (as per chat). I need to find their ID.
    # I'll query without ID (fallback) or pick an ID I know isn't on First Floor.
    
    print("\nQuerying as user_2 (Second Floor)...")
    # First, make sure user with ID 2 (sales1) is on Second Floor? 
    # I assigned sales1 to First Floor in 'assign_floor.py'.
    # So I need to set sales1 to 'Second Floor' to test the negative case.
    
    db = SessionLocal()
    sales1 = db.query(models.User).filter(models.User.username == "sales1").first()
    if sales1:
        sales1.floor = "Second Floor"
        db.commit()
        print("Moved sales1 to Second Floor for testing.")
    db.close()
    
    try:
        r = requests.get(f"{API_URL}/customers?salesperson_id=2") # sales1
        customers = r.json()
        ids = [c['short_id'] for c in customers]
        print(f"Result: {ids}")
        if "274584" not in ids:
            print("PASS: sales1 (Second Floor) does NOT see 274584 (First Floor)")
        else:
            print("FAIL: sales1 sees 274584")
    except Exception as e:
        print(f"Req Error: {e}")

if __name__ == "__main__":
    test_visibility()
