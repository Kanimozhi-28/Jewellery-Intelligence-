from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# Remote DB Credentials (from database.py)
DB_HOST = "10.100.21.222"
DB_NAME = "jewel_mob"
DB_USER = "jewel_user"
DB_PASS = "jewel123"

DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}/{DB_NAME}"

def remove_michael_salesperson():
    """
    Find and remove the salesperson named Michael from the remote database.
    This will also show what data exists before deletion.
    """
    try:
        engine = create_engine(DATABASE_URL, pool_pre_ping=True)
        Session = sessionmaker(bind=engine)
        session = Session()
        
        print("=" * 80)
        print("STEP 1: Finding Michael in the users table...")
        print("=" * 80)
        
        # Find Michael
        result = session.execute(
            text("SELECT id, username, full_name, role, status FROM users WHERE full_name ILIKE '%michael%' OR username ILIKE '%michael%'")
        )
        
        michael_records = result.fetchall()
        
        if not michael_records:
            print("ERROR: No user found with name 'Michael'")
            session.close()
            return
        
        print(f"\nSUCCESS: Found {len(michael_records)} record(s) matching 'Michael':\n")
        for record in michael_records:
            print(f"  ID: {record.id}")
            print(f"  Username: {record.username}")
            print(f"  Full Name: {record.full_name}")
            print(f"  Role: {record.role}")
            print(f"  Status: {record.status}")
            print("-" * 40)
        
        # Get Michael's ID for checking related data
        michael_id = michael_records[0].id
        
        print("\n" + "=" * 80)
        print(f"STEP 2: Checking related data for Michael (ID: {michael_id})...")
        print("=" * 80)
        
        # Check sessions
        sessions_result = session.execute(
            text("SELECT COUNT(*) as count FROM sessions WHERE salesperson_id = :id"),
            {"id": michael_id}
        )
        session_count = sessions_result.fetchone().count
        print(f"\nSessions assigned to Michael: {session_count}")
        
        # Check triggers
        triggers_result = session.execute(
            text("SELECT COUNT(*) as count FROM salesman_trigger WHERE salesperson_id = :id"),
            {"id": michael_id}
        )
        trigger_count = triggers_result.fetchone().count
        print(f"Triggers assigned to Michael: {trigger_count}")
        
        print("\n" + "=" * 80)
        print("STEP 3: Deleting Michael and related data...")
        print("=" * 80)
        
        # Delete in order (foreign key constraints)
        # 1. Delete session_details for sessions belonging to Michael
        if session_count > 0:
            session.execute(
                text("""
                    DELETE FROM session_details 
                    WHERE session_id IN (
                        SELECT id FROM sessions WHERE salesperson_id = :id
                    )
                """),
                {"id": michael_id}
            )
            print(f"SUCCESS: Deleted session details for Michael's sessions")
        
        # 2. Delete sales_history for sessions belonging to Michael AND for Michael as salesperson
        if session_count > 0:
            # Delete by session_id
            sales_history_result = session.execute(
                text("""
                    DELETE FROM sales_history 
                    WHERE session_id IN (
                        SELECT id FROM sessions WHERE salesperson_id = :id
                    )
                """),
                {"id": michael_id}
            )
            deleted_sales_by_session = sales_history_result.rowcount
            print(f"SUCCESS: Deleted {deleted_sales_by_session} sales history record(s) by session")
        
        # Also delete sales_history records directly referencing Michael as salesperson
        sales_history_sp_result = session.execute(
            text("DELETE FROM sales_history WHERE salesperson_id = :id"),
            {"id": michael_id}
        )
        deleted_sales_by_sp = sales_history_sp_result.rowcount
        print(f"SUCCESS: Deleted {deleted_sales_by_sp} sales history record(s) by salesperson")
        
        # 3. Delete sessions
        if session_count > 0:
            session.execute(
                text("DELETE FROM sessions WHERE salesperson_id = :id"),
                {"id": michael_id}
            )
            print(f"SUCCESS: Deleted {session_count} session(s)")
        
        # 4. Delete triggers
        if trigger_count > 0:
            session.execute(
                text("DELETE FROM salesman_trigger WHERE salesperson_id = :id"),
                {"id": michael_id}
            )
            print(f"SUCCESS: Deleted {trigger_count} trigger(s)")
        
        # 5. Finally delete the user
        session.execute(
            text("DELETE FROM users WHERE id = :id"),
            {"id": michael_id}
        )
        print(f"SUCCESS: Deleted user 'Michael' (ID: {michael_id})")
        
        # Commit the transaction
        session.commit()
        
        print("\n" + "=" * 80)
        print("SUCCESS: Michael has been completely removed from the database!")
        print("=" * 80)
        
        session.close()
        
    except Exception as e:
        print("\n" + "=" * 80)
        print("ERROR occurred during deletion:")
        print("=" * 80)
        print(f"{type(e).__name__}: {e}")
        if 'session' in locals():
            session.rollback()
            session.close()

if __name__ == "__main__":
    print("\nREMOVE MICHAEL SALESPERSON FROM REMOTE DATABASE")
    print("=" * 80)
    
    confirmation = input("\nWARNING: This will permanently delete Michael and all related data. Continue? (yes/no): ")
    
    if confirmation.lower() in ['yes', 'y']:
        remove_michael_salesperson()
    else:
        print("\nOperation cancelled by user.")
