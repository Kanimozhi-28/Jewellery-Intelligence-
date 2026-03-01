import requests
import json

API_URL = "http://localhost:8000"

def test_admin_history():
    print("--- Starting Admin History Verification ---")
    
    # 1. Create a User (Salesperson)
    print("Creating Salesperson...")
    try:
        sp_res = requests.post(f"{API_URL}/users/", json={
            "username": "admin_test_sp", 
            "password": "pass", 
            "full_name": "Admin Test User", 
            "role": "salesman"
        })
        if sp_res.status_code == 200:
            sp_id = sp_res.json()['id']
            print(f"Salesperson created: ID {sp_id}")
        else:
            # Fallback if exists (unique constraint)
            print("User likely exists, login to get ID...")
            login_res = requests.post(f"{API_URL}/login", json={"username": "admin_test_sp", "password": "pass"})
            sp_id = login_res.json()['user_id']
            print(f"Salesperson ID found: {sp_id}")
    except Exception as e:
        print(f"User setup failed: {e}")
        return

    # 2. Create a Customer (if not exists)
    # We'll valid detection/customer flow via direct DB manipulation or just assume ID 1 exists
    # Let's pick ID 1 or a known existing customer from previous steps. 
    # Or create a fake detection to spawn a customer? 
    # Simpler: just use ID 6 (from previous test) if it exists, or 1.
    cust_id = 6 
    
    # 3. Start Session
    print(f"Starting Session for Customer {cust_id} by SP {sp_id}...")
    # Note: start_session endpoint uses dependency injection for user_id. 
    # In main.py it defaults to 1. To test correct SP, we might need headers or auth.
    # Looking at main.py: def start_session(..., current_user_id: int = 1, ...)
    # It has a default but NO Depends(get_current_user). It seems hardcoded to 1 for now unless passed?
    # Actually, fastAPI params query args. So query param current_user_id=sp_id might work if not hidden.
    # But wait, main.py definition: ... current_user_id: int = 1 ...
    # This acts as a query parameter in FastAPI if not a path param! 
    # So we can pass ?current_user_id=sp_id
    
    sess_res = requests.post(f"{API_URL}/sessions/start?current_user_id={sp_id}", json={"customer_id": cust_id})
    if sess_res.status_code != 200:
        print(f"Start Session Failed: {sess_res.text}")
        return
        
    session_id = sess_res.json()['session_id']
    print(f"Session Started: ID {session_id}")
    
    # 4. Add Item with Comment
    print("Adding Jewel with Comment...")
    item_payload = {
        "barcode": "TEST-JEWEL-999",
        "comments": "Customer loved the design, price too high."
    }
    # Allow auto-create "Unknown Item" if not found
    add_res = requests.post(f"{API_URL}/sessions/{session_id}/items", json=item_payload)
    print(f"Add Item Status: {add_res.status_code}")
    
    # 5. End Session
    print("Ending Session...")
    requests.post(f"{API_URL}/sessions/{session_id}/end", json={"status": "completed", "notes": "Good visit"})
    
    # 6. Verify History Endpoint
    print("Querying Customer History...")
    hist_res = requests.get(f"{API_URL}/customers/{cust_id}/history")
    history = hist_res.json()
    
    print("\n--- History Results ---")
    found_it = False
    for sess in history:
        if sess['session_id'] == session_id:
            found_it = True
            print(f"Session {sess['session_id']} Found!")
            print(f"Salesperson: {sess['salesperson_name']}")
            print(f"Details Count: {len(sess['details'])}")
            for d in sess['details']:
                print(f" - Item: {d['jewel_name']}")
                print(f" - Comment: {d['comments']}")
                print(f" - SP Name on Detail: {d['salesperson_name']}")
            
            if sess['salesperson_name'] == "Admin Test User" and sess['details'][0]['comments'] == "Customer loved the design, price too high.":
                print("\nSUCCESS: Data matches expectations.")
            else:
                print("\nFAILURE: Data mismatch.")
                
    if not found_it:
        print("FAILURE: Session not found in history.")

if __name__ == "__main__":
    test_admin_history()
