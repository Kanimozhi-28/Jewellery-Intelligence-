
import requests
import sys

API_URL = "http://localhost:8000"

def run_test():
    print("1. Creating Families...")
    # Create 'Elite' (if not exists)
    try:
        r = requests.post(f"{API_URL}/families", json={"name": "Elite family cluster"})
        if r.status_code == 200:
            print("Created 'Elite family cluster'")
        else:
            print(f"Elite family cluster: {r.json()}")
    except Exception as e:
        print(f"Error creating Elite: {e}")

    # Create 'Volmort'
    try:
        r = requests.post(f"{API_URL}/families", json={"name": "Volmort"})
        if r.status_code == 200:
            print("Created 'Volmort'")
        else:
            print(f"Volmort: {r.json()}")
    except Exception as e:
        print(f"Error creating Volmort: {e}")

    print("\n2. Checking IDs...")
    r = requests.get(f"{API_URL}/families")
    families = r.json()
    for f in families:
        print(f"ID: {f['id']}, Name: {f['name']}")
    
    # Identify IDs
    elite_id = next((f['id'] for f in families if f['name'] == "Elite family cluster"), None)
    volmort_id = next((f['id'] for f in families if f['name'] == "Volmort"), None)
    
    print(f"\nElite ID: {elite_id}, Volmort ID: {volmort_id}")
    
    # Create a dummy customer
    print("\n3. Creating Dummy Customer...")
    # Check if exists first
    r = requests.get(f"{API_URL}/customers")
    customers = r.json()
    dummy = next((c for c in customers if c['short_id'] == "BUG_TEST_USER"), None)
    
    if not dummy:
        # We need to manually insert via DB or find a way. 
        # Actually our backend auto-creates on detection. 
        # But for test, let's pick an existing customer ID if available, or just use ID 1 if it exists.
        if customers:
            dummy = customers[0]
            print(f"Using existing customer ID: {dummy['id']}")
        else:
            print("No customers found to test with.")
            # Create one directly in DB logic is hard via API as we don't have create_customer endpoint exposed publicly for manual entry usually, 
            # closely coupled with ML. 
            # But let's assume there is at least one customer from previous context.
            return

    # Try assigning to Volmort
    print(f"\n4. Assigning Customer {dummy['id']} into 'Volmort'...")
    r = requests.post(f"{API_URL}/customers/{dummy['id']}/family", json={
        "family_name": "Volmort",
        "relationship": "TestMember"
    })
    print(f"Response: {r.json()}")

    # Verify
    print("\n5. Verifying Assignment...")
    r = requests.get(f"{API_URL}/customers")
    updated_customers = r.json()
    updated_dummy = next((c for c in updated_customers if c['id'] == dummy['id']), None)
    
    if updated_dummy:
        print(f"Customer Family ID: {updated_dummy['family_id']}")
        if updated_dummy['family_id'] == volmort_id:
            print("SUCCESS: Correctly assigned to Volmort.")
        elif updated_dummy['family_id'] == elite_id:
            print("FAILURE: Incorrectly assigned to Elite!")
        else:
            print(f"FAILURE: Assigned to unknown ID {updated_dummy['family_id']}")
    else:
        print("Could not find customer to verify.")

if __name__ == "__main__":
    run_test()
