from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import FamilyCluster, Customer

def check_family(family_identifier):
    db: Session = SessionLocal()
    try:
        # Check by name
        print(f"Searching for FamilyCluster with name: {family_identifier}")
        family = db.query(FamilyCluster).filter(FamilyCluster.name == family_identifier).first()
        
        if not family:
            print(f"No family found with name '{family_identifier}'. Checking by ID...")
            try:
                fam_id = int(family_identifier)
                family = db.query(FamilyCluster).filter(FamilyCluster.id == fam_id).first()
            except ValueError:
                pass
        
        if family:
            print(f"Found Family: {family.name} (ID: {family.id})")
            print(f"Created At: {family.created_at}")
            
            members = db.query(Customer).filter(Customer.family_id == family.id).all()
            if members:
                print(f"Found {len(members)} members:")
                for member in members:
                    print(f"  - Customer ID: {member.id} (Short ID: {member.short_id}, Relationship: {member.family_relationship})")
            else:
                print("No members found in this family.")
        else:
            print(f"Family '{family_identifier}' not found by name or ID.")
            
    finally:
        db.close()

if __name__ == "__main__":
    check_family("393816")
