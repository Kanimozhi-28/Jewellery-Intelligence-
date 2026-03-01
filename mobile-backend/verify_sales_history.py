
import requests
import time

API_URL = "http://localhost:8000"

def verify_sales_history():
    print("1. Starting Session...")
    # Start session for Customer ID 269103 (from repro script)
    r = requests.post(f"{API_URL}/sessions/start", json={"customer_id": 269103})
    if r.status_code != 200:
        print(f"Failed to start session: {r.json()}")
        return
    
    session_id = r.json()["session_id"]
    print(f"Session started: {session_id}")
    
    time.sleep(1)
    
    print("2. Adding Item...")
    r = requests.post(f"{API_URL}/sessions/{session_id}/items", json={
        "barcode": "TEST-JWL-100",
        "comments": "Customer accepted"
    })
    print(f"Add Item Response: {r.json()}")
    
    time.sleep(1)
    
    print("3. Ending Session...")
    r = requests.post(f"{API_URL}/sessions/{session_id}/end", json={
        "status": "purchased",
        "notes": "Good sale"
    })
    print(f"End Session Response: {r.json()}")
    
    print("4. Checking DB...")
    # We don't have a direct API to check SalesHistory yet (as per plan), so we check via SQL or just trust logs?
    # Actually, let's just inspect the DB directly using python script logic since we have access.
    
    from database import engine
    from models import SalesHistory
    from sqlalchemy.orm import Session
    
    with Session(bind=engine) as db:
        history = db.query(SalesHistory).filter(SalesHistory.session_id == session_id).first()
        if history:
            print(f"SUCCESS: Found SalesHistory record!")
            print(f"  Salesperson: {history.salesperson_id}")
            print(f"  Duration: {history.duration_seconds}s")
            print(f"  Total: {history.total_price_shown}")
            print(f"  Result: {history.result}")
            print(f"  Jewels: {history.jewels_shown}")
        else:
            print("FAILURE: No SalesHistory record found.")

if __name__ == "__main__":
    verify_sales_history()
