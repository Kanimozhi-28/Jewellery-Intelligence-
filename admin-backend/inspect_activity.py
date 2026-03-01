from database import SessionLocal
import models
from sqlalchemy import func

def inspect_events_sessions():
    db = SessionLocal()
    try:
        event_count = db.query(models.Events).count()
        print(f"Total events: {event_count}")
        
        session_count = db.query(models.Session).count()
        print(f"Total sessions: {session_count}")
        
        # Events hourly breakdown
        hourly_events = db.query(
            func.extract('hour', models.Events.timestamp).label('hour'),
            func.count(models.Events.id)
        ).group_by('hour').order_by('hour').all()
        
        print("\nHourly events:")
        for h, c in hourly_events:
            print(f"Hour {int(h)}: {c}")
            
        # Sessions hourly breakdown (using start_time)
        hourly_sessions = db.query(
            func.extract('hour', models.Session.start_time).label('hour'),
            func.count(models.Session.id)
        ).group_by('hour').order_by('hour').all()
        
        print("\nHourly sessions:")
        for h, c in hourly_sessions:
            print(f"Hour {int(h)}: {c}")
            
    finally:
        db.close()

if __name__ == "__main__":
    inspect_events_sessions()
