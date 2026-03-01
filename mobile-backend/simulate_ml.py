from database import SessionLocal
import models
import uuid

def simulate_detection():
    db = SessionLocal()
    try:
        rand_id = f"ML-{uuid.uuid4().hex[:6].upper()}"
        print(f"Injecting detection for {rand_id} on Floor 1...")
        
        detection = models.MLDetection(
            random_id=rand_id,
            photo_path="/dummy/path/face.jpg", # Or base64
            floor="First Floor"
        )
        db.add(detection)
        db.commit()
        print(f"Injected Detection ID: {detection.id}")
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    simulate_detection()
