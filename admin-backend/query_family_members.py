from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import FamilyCluster, Customer
from database import SessionLocal

# Override if needed, but assuming database.py has correct URL or I'll hardcode the one from check_users.py if that failed
# In previous turns, check_users.py used:
# SQLALCHEMY_DATABASE_URL = "postgresql://user:password@10.100.21.222/dbname" (hypothetically)
# Let's import get_db or assume the environment is set.
# I will use the URL from database.py but if it's localhost and user has remote, I might need to check.
# user state says: running uvicorn on main:app. So database.py is likely correct.

from database import SessionLocal

def get_family_members(family_name):
    db = SessionLocal()
    try:
        family = db.query(FamilyCluster).filter(FamilyCluster.name == family_name).first()
        if not family:
            print(f"Family with name '{family_name}' not found.")
            return

        print(f"Family: {family.name} (ID: {family.id})")
        print(f"Members Count: {len(family.members)}")
        print("-" * 30)
        for member in family.members:
            # Prefer short_id if available, else id
            display_id = member.short_id if member.short_id else member.id
            print(f"Member ID: {display_id}")
            print(f"  Internal ID: {member.id}")
            print(f"  Name: {member.first_seen} (using first_seen as proxy if name missing)")
            # Customer model in models.py doesn't have a 'name' field! It has 'customer_jpg'.
            # It just has IDs and embeddings.
            
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    get_family_members("393816")
