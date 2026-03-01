from database import SessionLocal
import models

def verify_tables():
    db = SessionLocal()
    try:
        tables = {
            "Users": models.User,
            "Sessions": models.Session,
            "Jewels": models.Jewel,
            "Family Clusters": models.FamilyCluster
        }
        print("Confirmation from Remote DB (10.100.101.152):")
        for name, model in tables.items():
            count = db.query(model).count()
            print(f"- {name}: Table exists ({count} records)")
    except Exception as e:
        print(f"Error checking tables: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    verify_tables()
