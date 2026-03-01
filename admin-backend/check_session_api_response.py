import requests
import json

def check_api():
    print("--- CHECKING API SESSIONS ---")
    try:
        response = requests.get("http://127.0.0.1:8000/sessions/?limit=50")
        if response.status_code == 200:
            sessions = response.json()
            print(f"Fetched {len(sessions)} sessions.")
            
            count_with_details = 0
            for s in sessions:
                details = s.get('details', [])
                if details:
                    count_with_details += 1
                    print(f"\nSession ID {s['id']} has {len(details)} details:")
                    # Print first detail to check structure
                    print(json.dumps(details[0], indent=2))
                    if count_with_details >= 3:
                        break
            
            if count_with_details == 0:
                print("\nWARNING: No sessions have 'details' populated in the API response!")
            else:
                print(f"\nSuccess: Found sessions with details.")
                
        else:
            print(f"API Error: {response.status_code} - {response.text}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_api()
