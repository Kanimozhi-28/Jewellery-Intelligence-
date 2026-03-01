import requests
import json

BASE_URL = "http://localhost:8000"

def test_update_photo():
    # 1. Get a user
    print("Getting users...")
    r = requests.get(f"{BASE_URL}/users/?role=salesman")
    users = r.json()
    if not users:
        print("No users found")
        return

    target_user = users[0]
    user_id = target_user['id']
    username = target_user['username']
    print(f"Target User: {username} (ID: {user_id})")

    # 2. Update photo
    payload = {
        "username": username,
        "password": "newpassword123", # Schema requires password
        "full_name": target_user['full_name'],
        "role": target_user['role'],
        "zone": target_user.get('zone', 'First Floor'),
        "sales": 0,
        "status": "Active",
        "photo": "http://localhost:8000/static/uploads/test_pic_123.jpg" 
    }
    
    print("Sending PUT request with photo...")
    url = f"{BASE_URL}/users/{user_id}"
    r = requests.put(url, json=payload)
    print(f"Status: {r.status_code}")
    if r.status_code == 200:
        updated_user = r.json()
        print("Updated User Response:", json.dumps(updated_user, indent=2))
        
        # 3. Verify persistence
        print("Verifying persistence...")
        r2 = requests.get(f"{BASE_URL}/users/?role=salesman")
        users_refetched = r2.json()
        saved_user = next((u for u in users_refetched if u['id'] == user_id), None)
        if saved_user and saved_user.get('photo') == payload['photo']:
            print("SUCCESS: Photo persisted!")
        else:
            print("FAILURE: Photo NOT persisted.")
            print("Saved Data:", saved_user)
    else:
        print("Update Failed:", r.text)

if __name__ == "__main__":
    test_update_photo()
