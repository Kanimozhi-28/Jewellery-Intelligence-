import requests
import json

def test_users():
    url = "http://localhost:8000/users/?role=salesman"
    try:
        print(f"GET {url}")
        r = requests.get(url)
        print(f"Status: {r.status_code}")
        if r.status_code == 200:
            data = r.json()
            print(f"Count: {len(data)}")
            print(json.dumps(data, indent=2))
        else:
            print("Error Text:", r.text)
    except Exception as e:
        print("Request Failed:", e)

if __name__ == "__main__":
    test_users()
