from database import SessionLocal
from sqlalchemy import text

def inspect_users_ml():
    db = SessionLocal()
    try:
        print("--- Checking Columns in 'users' ---")
        result = db.execute(text("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users';"))
        for row in result:
            print(f"User Col: {row[0]} ({row[1]})")

        print("\n--- Checking Columns in 'ml_detections' ---")
        result = db.execute(text("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'ml_detections';"))
        for row in result:
            print(f"ML Col: {row[0]} ({row[1]})")
            
    except Exception as e:
        print(f"Error (likely sqlite?): {e}")
        # Fallback for checking content if schema query fails
        try:
            print("--- Users Content Check ---")
            res = db.execute(text("SELECT * FROM users LIMIT 1"))
            print("User Keys:", res.keys())
        except Exception as e2:
            print(f"User content check failed: {e2}")

    finally:
        db.close()

if __name__ == "__main__":
    inspect_users_ml()
