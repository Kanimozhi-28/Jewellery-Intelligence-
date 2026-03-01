import sys
from sqlalchemy import create_engine, text

def run_migration():
    print("--- Database Migration Tool ---")
    print("This script will add the missing columns to the 'customers' table.")
    
    # Default connection string from your project
    default_url = "postgresql://jewel_user:jewel123@10.100.21.222/jewel_mob"
    
    print(f"\nDefault Connection: {default_url}")
    use_custom = input("Do you want to use a different connection string (e.g. with 'postgres' user)? (y/n): ").lower()
    
    if use_custom == 'y':
        url = input("Enter full connection string (e.g. postgresql://postgres:PASSWORD@10.100.21.222/jewel_mob): ")
    else:
        url = default_url

    try:
        engine = create_engine(url)
        with engine.connect() as conn:
            print("\nExecuting migration...")
            conn.execute(text("ALTER TABLE customers ADD COLUMN IF NOT EXISTS assigned_salesperson_id INTEGER REFERENCES users(id);"))
            conn.execute(text("ALTER TABLE customers ADD COLUMN IF NOT EXISTS is_floating BOOLEAN DEFAULT FALSE;"))
            conn.commit()
            print("\n✅ SUCCESS: Columns added successfully!")
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        print("\nPossible reasons:")
        print("1. Incorrect username/password.")
        print("2. Current user is not the owner of the table (try using the 'postgres' user).")
        print("3. VPN connection is not active.")

if __name__ == "__main__":
    run_migration()
