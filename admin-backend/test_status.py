import requests
import json

BASE_URL = "http://localhost:8000"

def test_update_status():
    user_id = 1 # Michael
    
    # 1. Get current user
    print(f"Fetching user {user_id}...")
    r = requests.get(f"{BASE_URL}/users/")
    users = r.json()
    michael = next((u for u in users if u['id'] == user_id), None)
    
    if not michael:
        print("Michael not found!")
        return

    print(f"Current Status: {michael.get('status')}")

    # 2. Update status to 'Inactive'
    print("Updating status to 'Inactive'...")
    payload = {
        "username": michael['username'],
        "password": "password", # Need to send password as it is required in UserCreate
        "full_name": michael['full_name'],
        "role": michael['role'],
        "zone": michael.get('zone', 'First Floor'),
        "status": "Inactive"
    }
    
    r = requests.put(f"{BASE_URL}/users/{user_id}", json=payload)
    if r.status_code == 200:
        print("Update successful!")
        print("Response:", r.json())
    else:
        print("Update failed:", r.status_code, r.text)

    # 3. Verify persistence
    print("Verifying persistence...")
    r = requests.get(f"{BASE_URL}/users/")
    users = r.json()
    michael = next((u for u in users if u['id'] == user_id), None)
    print(f"New Status: {michael.get('status')}")

if __name__ == "__main__":
    test_update_status()
