from schemas import UserCreate

def test_schema():
    print("Testing Schema Parsing...")
    data = {
        "username": "test",
        "password": "pw",
        "full_name": "Test User",
        "role": "salesman",
        "status": "Inactive"
    }
    
    try:
        user = UserCreate(**data)
        print(f"Input: {data}")
        print(f"Parsed Object: {user}")
        print(f"Parsed Status: '{user.status}'")
        
        if user.status != "Inactive":
            print("FAIL: Status was not parsed correctly!")
        else:
            print("SUCCESS: Status parsed correctly.")
            
    except Exception as e:
        print(e)

if __name__ == "__main__":
    test_schema()
