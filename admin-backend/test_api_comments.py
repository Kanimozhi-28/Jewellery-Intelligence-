import requests
import json

# Test the sessions API to see what data is being returned
response = requests.get("http://localhost:8000/sessions/")

if response.status_code == 200:
    sessions = response.json()
    print(f"Total sessions: {len(sessions)}\n")
    
    # Find session 106 which should have the "Need some design" comment
    for session in sessions:
        if session.get('id') == 106:
            print("=== SESSION 106 DETAILS ===")
            print(f"Session ID: {session.get('id')}")
            print(f"Customer ID: {session.get('customer_id')}")
            print(f"Salesperson ID: {session.get('salesperson_id')}")
            print(f"Session Notes: {session.get('notes')}")
            print(f"\nSession Details ({len(session.get('details', []))}):")
            
            for idx, detail in enumerate(session.get('details', [])):
                print(f"\n  Detail #{idx + 1}:")
                print(f"    Jewel ID: {detail.get('jewel_id')}")
                jewel = detail.get('jewel', {})
                print(f"    Jewel Name: {jewel.get('name')}")
                print(f"    Comments: '{detail.get('comments')}'")
                print(f"    Action: {detail.get('action')}")
            
            break
    else:
        print("Session 106 not found in API response")
        print(f"\nAvailable session IDs: {[s.get('id') for s in sessions[:10]]}")
else:
    print(f"API Error: {response.status_code}")
    print(response.text)
