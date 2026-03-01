import requests
import json

try:
    # Use localhost since we are running this on the same machine as backend
    r = requests.get('http://127.0.0.1:8000/customers')
    print(f"Status Code: {r.status_code}")
    if r.status_code == 200:
        data = r.json()
        print(f"Count: {len(data)}")
        print(json.dumps(data, indent=2))
    else:
        print(r.text)
except Exception as e:
    print(f"Error: {e}")
