import requests
import json

def test_heatmap_api():
    try:
        response = requests.get("http://localhost:8000/activity-heatmap/")
        if response.status_code == 200:
            data = response.json()
            print(f"Success! Received {len(data)} heatmap entries.")
            if data:
                print("Sample Entry:", json.dumps(data[0], indent=2))
        else:
            print(f"Failed! Status Code: {response.status_code}")
            print("Response:", response.text)
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_heatmap_api()
