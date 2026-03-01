import requests
from datetime import datetime

def check_friday_visitors():
    print("--- SCANNING FOR FRIDAY VISITORS ---")
    try:
        response = requests.get("http://127.0.0.1:8000/sessions/?limit=100")
        if response.status_code == 200:
            sessions = response.json()
            friday_visitors = []
            
            for s in sessions:
                start_time_str = s.get('start_time')
                if not start_time_str:
                    continue
                
                # Parse the ISO format timestamp
                # Example: 2026-01-23T13:22:31.120867
                try:
                    dt = datetime.fromisoformat(start_time_str.replace('Z', '+00:00'))
                    # dt.weekday() -> 0=Mon, 4=Fri
                    if dt.weekday() == 4:
                        cust = s.get('customer', {})
                        sales = s.get('salesperson', {})
                        friday_visitors.append({
                            "short_id": cust.get('short_id', 'Unknown'),
                            "time": start_time_str,
                            "salesperson": sales.get('full_name', 'Unknown')
                        })
                except Exception as e:
                    continue
            
            if friday_visitors:
                print(f"Found {len(friday_visitors)} visitor(s) for Friday:")
                for v in friday_visitors:
                    print(f"- Customer {v['short_id']} at {v['time']} (Managed by: {v['salesperson']})")
            else:
                print("No sessions found for Friday in the database.")
        else:
            print(f"API Error: {response.status_code}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_friday_visitors()
