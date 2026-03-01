import requests

API_URL = "http://localhost:8000"

def test_start_session():
    # Test with the problematic customer ID
    payload = {"customer_id": 149937} 
    
    print(f"Sending POST /sessions/start with {payload}")
    try:
        r = requests.post(f"{API_URL}/sessions/start", json=payload)
        print(f"Status Code: {r.status_code}")
        print(f"Response Headers: {r.headers}")
        print(f"Response Text: {r.text}")
        
        try:
            print("JSON:", r.json())
        except:
            print("Not JSON.")
            
    except Exception as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    test_start_session()
