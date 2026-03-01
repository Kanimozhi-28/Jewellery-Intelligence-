import requests
import json

try:
    # URL to the local backend
    url = "http://127.0.0.1:8000/customers"
    print(f"Fetching from {url}...")
    
    r = requests.get(url)
    if r.status_code == 200:
        data = r.json()
        print(f"Success. Got {len(data)} customers.")
        
        targets = [367499, 758872, 364799]
        found_count = 0
        
        for c in data:
            if c['id'] in targets:
                found_count += 1
                print(f"\n--- API Customer {c['id']} ---")
                print(f"short_id: {c.get('short_id')}")
                print(f"photo_url: {c.get('photo_url')}")
                jpg = c.get('customer_jpg')
                if jpg:
                    print(f"customer_jpg length: {len(jpg)}")
                    print(f"Start: {jpg[:30]}...")
                else:
                    print("customer_jpg is None/Empty in API response!")
        
        print(f"\nFound {found_count} of {len(targets)} targets.")

    else:
        print(f"Failed: {r.status_code} - {r.text}")

except Exception as e:
    print(f"Error: {e}")
