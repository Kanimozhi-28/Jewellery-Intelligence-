
from database import engine
from sqlalchemy.orm import Session
from models import FamilyCluster, Customer
from sqlalchemy import func

def cleanup_families():
    with Session(bind=engine) as db:
        print("Cleaning up duplicate families...")
        
        # 1. Find all families
        families = db.query(FamilyCluster).all()
        
        # Group by lower-case name
        fam_map = {}
        for f in families:
            lower_name = f.name.lower()
            if lower_name not in fam_map:
                fam_map[lower_name] = []
            fam_map[lower_name].append(f)
            
        for name, duplicates in fam_map.items():
            if len(duplicates) > 1:
                print(f"Found duplicates for '{name}': {[d.name for d in duplicates]}")
                # Keep the first one (or the one with ID 1 if present)
                # Sort by ID
                duplicates.sort(key=lambda x: x.id)
                keep = duplicates[0]
                remove_list = duplicates[1:]
                
                print(f"Keeping ID {keep.id} ({keep.name}), removing IDs {[r.id for r in remove_list]}")
                
                for r in remove_list:
                    # Reassign members to 'keep'
                    members = db.query(Customer).filter(Customer.family_id == r.id).all()
                    for m in members:
                        print(f"  Reassigning customer {m.id} to family {keep.id}")
                        m.family_id = keep.id
                    
                    db.delete(r)
        
        db.commit()
        print("Cleanup done.")

if __name__ == "__main__":
    cleanup_families()
