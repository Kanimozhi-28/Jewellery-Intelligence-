from sqlalchemy.orm import joinedload
from database import SessionLocal
import models

db = SessionLocal()

try:
    # Get session 106 with joinedload
    session = db.query(models.Session).options(
        joinedload(models.Session.details).joinedload(models.SessionDetails.jewel)
    ).filter(models.Session.id == 106).first()
    
    if session:
        print(f"=== SESSION {session.id} ===")
        print(f"Details loaded: {len(session.details)}")
        
        for idx, detail in enumerate(session.details):
            print(f"\n  Detail #{idx + 1}:")
            print(f"    Detail ID: {detail.id}")
            print(f"    Session ID: {detail.session_id}")
            print(f"    Jewel ID: {detail.jewel_id}")
            print(f"    Jewel Name: {detail.jewel.name if detail.jewel else 'None'}")
            print(f"    Action: {detail.action}")
            print(f"    Comments (raw attr): '{detail.comments}'")
            print(f"    Comments type: {type(detail.comments)}")
            
            # Check if comments attribute exists
            print(f"    Has 'comments' attr: {hasattr(detail, 'comments')}")
            
            # Try to access via __dict__
            print(f"    __dict__ keys: {list(detail.__dict__.keys())}")
            if 'comments' in detail.__dict__:
                print(f"    __dict__['comments']: '{detail.__dict__['comments']}'")
    else:
        print("Session 106 not found")
        
finally:
    db.close()
