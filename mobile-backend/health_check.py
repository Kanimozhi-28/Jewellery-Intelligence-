import requests
def check_health():
    try:
        r = requests.get("http://127.0.0.1:8000/")
        print(f"Health Check: {r.status_code} - {r.text}")
    except Exception as e:
        print(f"Health Check Failed: {e}")

if __name__ == "__main__":
    check_health()
