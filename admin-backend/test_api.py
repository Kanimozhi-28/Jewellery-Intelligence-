import requests

BASE_URL = "http://localhost:8000"

def test_api():
    endpoints = [
        "/metrics/",
        "/users/?role=salesman",
        "/customers/",
        "/jewels/",
        "/sessions/",
        "/family-clusters/",
        "/audit-logs/"
    ]
    
    print(f"{'Endpoint':<25} | {'Status'} | {'Count/Data'}")
    print("-" * 50)
    
    for ep in endpoints:
        try:
            r = requests.get(f"{BASE_URL}{ep}")
            status = r.status_code
            data = r.json()
            
            count = "N/A"
            if isinstance(data, list):
                count = len(data)
            elif isinstance(data, dict):
                count = str(data)[:30] + "..."
            
            print(f"{ep:<25} | {status:<6} | {count}")
        except Exception as e:
            print(f"{ep:<25} | ERR    | {e}")

if __name__ == "__main__":
    test_api()
