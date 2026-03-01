import requests
try:
    r = requests.get("http://127.0.0.1:8000/customers/")
    data = r.json()
    found = False
    for c in data:
        if c.get("id") == 181995:
            print(f"ID: {c.get('id')}")
            print(f"LastSeen: {c.get('last_seen')}")
            print(f"TotalVisits: {c.get('visits')}")
            # Also print keys to see if capitalization is an issue
            # print(c.keys()) 
            found = True
            break
    if not found:
        print("Customer 181995 not found in API response")
except Exception as e:
    print(f"Error: {e}")
