from database import SessionLocal
import models
from sqlalchemy import func

def inspect_detections():
    db = SessionLocal()
    try:
        count = db.query(models.MLDetections).count()
        print(f"Total detections: {count}")
        
        # Hourly breakdown
        hourly = db.query(
            func.extract('hour', models.MLDetections.timestamp).label('hour'),
            func.count(models.MLDetections.id)
        ).group_by('hour').order_by('hour').all()
        
        print("\nHourly detections:")
        for h, c in hourly:
            print(f"Hour {int(h)}: {c}")
            
        # Floor breakdown
        floors = db.query(
            models.MLDetections.floor,
            func.count(models.MLDetections.id)
        ).group_by(models.MLDetections.floor).all()
        
        print("\nFloor breakdown:")
        for f, c in floors:
            print(f"Floor {f}: {c}")
            
    finally:
        db.close()

if __name__ == "__main__":
    inspect_detections()
