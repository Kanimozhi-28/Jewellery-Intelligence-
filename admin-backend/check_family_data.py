from database import SessionLocal
import models

db = SessionLocal()

families = db.query(models.FamilyCluster).all()
print(f"Total Families: {len(families)}")

for family in families:
    print(f"Family: {family.name} (ID: {family.id})")
    members = db.query(models.Customer).filter(models.Customer.family_id == family.id).all()
    head_found = False
    for m in members:
        is_head = (str(m.short_id) == str(family.name))
        print(f"  - Member: {m.short_id} (ID: {m.id}), Name: {m.family_relationship}, Is Head? {is_head}")
        if is_head:
            head_found = True
    
    if not head_found:
        print(f"  WARNING: No member found with short_id matching family name '{family.name}'")

db.close()
