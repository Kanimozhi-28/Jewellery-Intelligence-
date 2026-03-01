from sqlalchemy.orm import joinedload
from database import SessionLocal
import models
import schemas
import json

db = SessionLocal()

try:
    # Get session 106 exactly as the API does
    sessions = db.query(models.Session).options(
        joinedload(models.Session.salesperson),
        joinedload(models.Session.details).joinedload(models.SessionDetails.jewel)
    ).filter(models.Session.id == 106).all()
    
    if sessions:
        session = sessions[0]
        
        # Convert to Pydantic schema (as FastAPI does)
        session_schema = schemas.Session.model_validate(session)
        
        print("=== PYDANTIC SCHEMA OBJECT ===")
        print(f"Session ID: {session_schema.id}")
        print(f"Details count: {len(session_schema.details)}")
        
        for idx, detail in enumerate(session_schema.details):
            print(f"\n  Detail #{idx + 1} (Pydantic):")
            print(f"    Detail ID: {detail.id}")
            print(f"    Jewel: {detail.jewel.name if detail.jewel else 'None'}")
            print(f"    Action: {detail.action}")
            print(f"    Comments: '{detail.comments}'")
            print(f"    Comments type: {type(detail.comments)}")
        
        # Serialize to JSON (as FastAPI does)
        print("\n=== JSON SERIALIZATION (model_dump) ===")
        json_data = session_schema.model_dump()
        print(f"Details in JSON: {len(json_data['details'])}")
        
        for idx, detail in enumerate(json_data['details']):
            print(f"\n  Detail #{idx + 1} (JSON):")
            print(f"    Jewel: {detail.get('jewel', {}).get('name')}")
            print(f"    Comments: '{detail.get('comments')}'")
            print(f"    Comments is None: {detail.get('comments') is None}")
        
        # Pretty print the full JSON
        print("\n=== FULL JSON OUTPUT ===")
        print(json.dumps(json_data, indent=2, default=str)[:1000])
    else:
        print("Session 106 not found")
        
finally:
    db.close()
