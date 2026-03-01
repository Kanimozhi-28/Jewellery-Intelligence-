import requests
import json

def debug_api():
    print("--- DEBUGGING FLOATING CUSTOMERS API ---")
    try:
        url = "http://localhost:8000/customers/floating/"
        response = requests.get(url)
        print(f"Status Code: {response.status_code}")
        if response.status_code != 200:
            print("Error Response Body:")
            print(response.text)
        else:
            print("Success! Data:")
            print(json.dumps(response.json(), indent=2))
    except Exception as e:
        print(f"Connection error: {e}")

if __name__ == "__main__":
    debug_api()
