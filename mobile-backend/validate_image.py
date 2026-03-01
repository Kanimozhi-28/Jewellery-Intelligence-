from database import SessionLocal
import models
import base64
import os

def validate_image():
    db = SessionLocal()
    try:
        c = db.query(models.Customer).first()
        if c and c.customer_jpg:
            data = c.customer_jpg
            print(f"ID: {c.id}")
            if "," in data:
                header, encoded = data.split(",", 1)
                print(f"Header: {header}")
                try:
                    decoded = base64.b64decode(encoded)
                    print(f"Successfully decoded {len(decoded)} bytes.")
                    with open("test_image.jpg", "wb") as f:
                        f.write(decoded)
                    print("Saved to test_image.jpg")
                except Exception as e:
                    print(f"Base64 Decode Error: {e}")
            else:
                 print("No comma found in data (no header?)")
                 try:
                    decoded = base64.b64decode(data)
                    print(f"Successfully decoded {len(decoded)} bytes (assuming no header).")
                 except Exception as e:
                    print(f"Base64 Decode Error: {e}")
        else:
            print("No customer or image data found.")
    finally:
        db.close()

if __name__ == "__main__":
    validate_image()
