import requests
import json

# Get sessions for customer 393816
response = requests.get("http://localhost:8000/sessions/")

if response.status_code == 200:
    sessions = response.json()
    
    # Filter sessions for customer 393816
    customer_sessions = [s for s in sessions if s.get('customer_id') == 393816]
    
    print(f"Found {len(customer_sessions)} sessions for Customer 393816\n")
    
    for session in customer_sessions:
        print(f"=== SESSION {session.get('id')} ===")
        print(f"Session Notes: '{session.get('notes')}'")
        print(f"Details count: {len(session.get('details', []))}")
        
        for idx, detail in enumerate(session.get('details', [])):
            jewel = detail.get('jewel', {})
            print(f"\n  Detail #{idx + 1}:")
            print(f"    Jewel: {jewel.get('name')}")
            print(f"    Action: {detail.get('action')}")
            print(f"    Comments: '{detail.get('comments')}'")
            print(f"    Comments is None: {detail.get('comments') is None}")
            print(f"    Comments type: {type(detail.get('comments'))}")
        print("\n" + "="*50 + "\n")
else:
    print(f"API Error: {response.status_code}")
