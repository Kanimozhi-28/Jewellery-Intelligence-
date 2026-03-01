from sqlalchemy import create_engine, text

# Remote DB Credentials
DB_HOST = "10.100.21.222"
DB_NAME = "jewel_mob"
DB_USER = "jewel_user"
DB_PASS = "jewel123"

DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}/{DB_NAME}"

def verify_michael_removal():
    """
    Verify that Michael has been removed from the database.
    """
    try:
        engine = create_engine(DATABASE_URL, pool_pre_ping=True)
        
        with engine.connect() as conn:
            print("=" * 80)
            print("VERIFICATION: Checking for any remaining 'Michael' users...")
            print("=" * 80)
            
            # Check for Michael
            result = conn.execute(
                text("SELECT id, username, full_name, role, status FROM users WHERE full_name ILIKE '%michael%' OR username ILIKE '%michael%'")
            )
            
            michael_records = result.fetchall()
            
            if not michael_records:
                print("\nSUCCESS: No users named 'Michael' found in the database!")
                print("Michael has been completely removed.")
            else:
                print(f"\nWARNING: Found {len(michael_records)} user(s) still named 'Michael':\n")
                for record in michael_records:
                    print(f"  ID: {record.id}")
                    print(f"  Username: {record.username}")
                    print(f"  Full Name: {record.full_name}")
                    print(f"  Role: {record.role}")
                    print(f"  Status: {record.status}")
                    print("-" * 40)
                print("\nNote: The script only removed the first Michael found (ID: 1).")
                print("If you want to remove the other Michael(s), run the script again.")
            
            print("\n" + "=" * 80)
            print("All current users in the database:")
            print("=" * 80)
            
            all_users = conn.execute(
                text("SELECT id, username, full_name, role FROM users ORDER BY id")
            )
            
            print(f"\n{'ID':<5} {'Username':<20} {'Full Name':<25} {'Role'}")
            print("-" * 80)
            for user in all_users:
                print(f"{user.id:<5} {user.username:<20} {user.full_name or 'N/A':<25} {user.role or 'N/A'}")
            
    except Exception as e:
        print(f"\nERROR: {type(e).__name__}: {e}")

if __name__ == "__main__":
    verify_michael_removal()
