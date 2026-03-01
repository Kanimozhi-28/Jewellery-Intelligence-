from database import SessionLocal
import crud

db = SessionLocal()
users = crud.get_users(db)
for user in users:
    print(f"Username: {user.username}, Password: {user.password_hash}")
db.close()
