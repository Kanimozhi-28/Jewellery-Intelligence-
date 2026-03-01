from database import SessionLocal
import models

def check_images():
    db = SessionLocal()
    try:
        customers = db.query(models.Customer).limit(5).all()
        print(f"Checking {len(customers)} customers for image data:\n")
        for c in customers:
            jpg_data = c.customer_jpg
            if not jpg_data:
                print(f"ID {c.id}: No image data (None/Empty)")
            else:
                prefix = jpg_data[:50]
                print(f"ID {c.id}: Length={len(jpg_data)}, Start='{prefix}...'")
                
                if "captured_faces" in jpg_data or "/" in jpg_data or "\\" in jpg_data:
                     print(f"   -> WARNING: Looks like a file path, not Base64!")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check_images()
