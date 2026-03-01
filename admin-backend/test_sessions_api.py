import requests
import json

# Test the sessions API to verify it returns salesperson, jewels, and comments
response = requests.get("http://localhost:8000/sessions/")

if response.status_code == 200:
    sessions = response.json()
    print(f"Total sessions: {len(sessions)}\n")
    
    if sessions:
        # Show first session in detail
        first = sessions[0]
        print("First Session Details:")
        print(f"  Session ID: {first.get('id')}")
        print(f"  Start Time: {first.get('start_time')}")
        
        # Salesperson
        sp = first.get('salesperson')
        if sp:
            print(f"  Salesperson: {sp.get('full_name')} (ID: {sp.get('id')})")
        else:
            print("  Salesperson: MISSING!")
        
        # Session Details (Jewels + Comments)
        details = first.get('details', [])
        print(f"  Session Details Count: {len(details)}")
        for idx, detail in enumerate(details[:3]):  # Show first 3
            jewel = detail.get('jewel', {})
            print(f"    [{idx+1}] Jewel: {jewel.get('name')} | Action: {detail.get('action')} | Comments: {detail.get('comments')}")
    else:
        print("No sessions found in database.")
else:
    print(f"API Error: {response.status_code}")
    print(response.text)
