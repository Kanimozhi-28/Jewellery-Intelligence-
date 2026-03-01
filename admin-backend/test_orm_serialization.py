from sqlalchemy.orm import joinedload
from database import SessionLocal
import models
import schemas

db = SessionLocal()

try:
    # Test the exact query used in crud.py
    sessions = db.query(models.Session).options(
        joinedload(models.Session.salesperson),
        joinedload(models.Session.details).joinedload(models.SessionDetails.jewel)
    ).filter(models.Session.id == 106).all()
    
    if sessions:
        session = sessions[0]
        print(f"=== SESSION {session.id} (SQLAlchemy ORM) ===")
        print(f"Customer ID: {session.customer_id}")
        print(f"Salesperson ID: {session.salesperson_id}")
        print(f"Session Notes: '{session.notes}'")
        print(f"Details count: {len(session.details)}")
        
        for idx, detail in enumerate(session.details):
            print(f"\n  Detail #{idx + 1} (ORM Object):")
            print(f"    ID: {detail.id}")
            print(f"    Session ID: {detail.session_id}")
            print(f"    Jewel ID: {detail.jewel_id}")
            print(f"    Action: {detail.action}")
            print(f"    Comments (raw): '{detail.comments}'")
            print(f"    Comments type: {type(detail.comments)}")
            print(f"    Jewel: {detail.jewel.name if detail.jewel else 'None'}")
            
            # Try Pydantic serialization
            print(f"\n  Pydantic Serialization:")
            schema_detail = schemas.SessionDetailsWithJewel.from_orm(detail)
            print(f"    Schema object: {schema_detail}")
            print(f"    Comments in schema: '{schema_detail.comments}'")
    else:
        print("Session 106 not found")
        
finally:
    db.close()
