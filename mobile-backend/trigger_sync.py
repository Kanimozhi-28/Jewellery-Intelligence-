from database import SessionLocal
import models
import datetime

def inject_monitor_test():
    db = SessionLocal()
    try:
        print("Injecting NEW detection for '149937' to trigger auto-creation...")
        det = models.MLDetection(
            random_id="149937",
            floor="First Floor",
            photo_path="/dummy/149937.jpg",
            timestamp=datetime.datetime.utcnow()
        )
        db.add(det)
        db.commit()
        print(f"Injected Detection ID: {det.id}")
        
    finally:
        db.close()

if __name__ == "__main__":
    inject_monitor_test()
