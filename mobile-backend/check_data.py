from database import SessionLocal
from models import Session, SessionDetail, Customer, User

db = SessionLocal()

session_count = db.query(Session).count()
detail_count = db.query(SessionDetail).count()
customer_count = db.query(Customer).count()
user_count = db.query(User).count()

print(f"Sessions: {session_count}")
print(f"Session Details: {detail_count}")
print(f"Customers: {customer_count}")
print(f"Users: {user_count}")

# Check for a specific user and their sessions
if user_count > 0:
    first_user = db.query(User).first()
    user_sessions = db.query(Session).filter(Session.salesperson_id == first_user.id).all()
    print(f"User {first_user.username} (ID: {first_user.id}) has {len(user_sessions)} sessions.")
    if user_sessions:
        first_session = user_sessions[0]
        details = db.query(SessionDetail).filter(SessionDetail.session_id == first_session.id).all()
        print(f"  Session {first_session.id} has {len(details)} details.")

db.close()
