from sqlalchemy.orm import Session
from database import SessionLocal
import models
import schemas

# Test if Pydantic schema properly serializes comments field
db = SessionLocal()

try:
    # Get session_details with comments
    detail = db.query(models.SessionDetails).filter(
        models.SessionDetails.comments.isnot(None),
        models.SessionDetails.comments != ''
    ).first()
    
    if detail:
        print("=== RAW DATABASE RECORD ===")
        print(f"ID: {detail.id}")
        print(f"Session ID: {detail.session_id}")
        print(f"Jewel ID: {detail.jewel_id}")
        print(f"Action: {detail.action}")
        print(f"Comments (raw): '{detail.comments}'")
        print(f"Comments type: {type(detail.comments)}")
        
        print("\n=== PYDANTIC SCHEMA SERIALIZATION ===")
        # Try to serialize with Pydantic
        schema_obj = schemas.SessionDetailsWithJewel.from_orm(detail)
        print(f"Schema object: {schema_obj}")
        print(f"Schema dict: {schema_obj.dict()}")
        print(f"Comments in dict: '{schema_obj.dict().get('comments')}'")
    else:
        print("No session_details with comments found")
        
finally:
    db.close()
