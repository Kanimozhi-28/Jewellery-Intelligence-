from database import SessionLocal
from models import User, Session, SessionDetail, Customer, Jewel

db = SessionLocal()

# 1. Find the user (Broad Search)
search_term = "EMP001"
print(f"Searching for '{search_term}' in User table...")

# Check username
user_by_username = db.query(User).filter(User.username == search_term).first()
# Check full_name
user_by_fullname = db.query(User).filter(User.full_name == search_term).first()
# Check if it's a substring in full_name
user_by_like = db.query(User).filter(User.full_name.ilike(f"%{search_term}%")).first()

target_user = user_by_username or user_by_fullname or user_by_like

if target_user:
    print(f"FOUND USER: ID={target_user.id}, Username='{target_user.username}', FullName='{target_user.full_name}'")
    
    # 2. Check Sessions for this found user
    sessions = db.query(Session).filter(Session.salesperson_id == target_user.id).all()
    print(f"Total Sessions: {len(sessions)}")
    
    for s in sessions:
        customer = db.query(Customer).filter(Customer.id == s.customer_id).first()
        cust_info = customer.short_id if customer else "Unknown"
        print(f"  - Session {s.id}: Status='{s.status}', Customer='{cust_info}', Start='{s.start_time}'")
        
        details = db.query(SessionDetail).filter(SessionDetail.session_id == s.id).all()
        for d in details:
            jewel = db.query(Jewel).filter(Jewel.id == d.jewel_id).first()
            j_name = jewel.name if jewel else "Unknown Jewel"
            print(f"      * {d.action}: {j_name} ({d.comments})")
else:
    print(f"User '{search_term}' NOT found in username or full_name.")
    print("-" * 30)
    print("Dumping ALL Users for manual verification:")
    all_users = db.query(User).all()
    for u in all_users:
        print(f"ID: {u.id} | Username: {u.username} | FullName: {u.full_name} | Role: {u.role}")

db.close()
