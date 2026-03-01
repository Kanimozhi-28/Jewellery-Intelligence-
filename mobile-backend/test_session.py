import requests
import time

API_URL = "http://localhost:8000"
CUST_ID = 149937

def test_session_lifecycle():
    print("--- Session Lifecycle Test ---")
    
    # 1. Start Session
    print(f"1. Starting session for {CUST_ID}...")
    try:
        r = requests.post(f"{API_URL}/sessions/start", json={"customer_id": CUST_ID})
        print(f"Start Response: {r.status_code} - {r.text}")
        if r.status_code == 200:
            sess_id = r.json()['session_id']
            print(f"   -> Started Session {sess_id}")
            
            # 2. Add Item
            print("2. Adding Item...")
            r2 = requests.post(f"{API_URL}/sessions/{sess_id}/items", json={"barcode": "TEST-1", "comments": "Auto Test"})
            print(f"   Add Item Response: {r2.status_code} - {r2.text}")
            
            # 3. End Session
            print("3. Ending Session...")
            r3 = requests.post(f"{API_URL}/sessions/{sess_id}/end", json={"status": "completed"})
            print(f"   End Session Response: {r3.status_code} - {r3.text}")
            
        elif r.status_code == 400:
            print("   -> Session already active or locked.")
            
    except Exception as e:
        print(f"Test Failed: {e}")

if __name__ == "__main__":
    test_session_lifecycle()
