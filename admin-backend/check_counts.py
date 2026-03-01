from sqlalchemy import create_engine, text

DATABASE_URL = "postgresql://postgres:root@10.100.101.152:5432/Jewel_mob?sslmode=disable"

def check_counts():
    try:
        engine = create_engine(DATABASE_URL)
        with engine.connect() as conn:
            tables = ['users', 'customers', 'jewels', 'sessions', 'family_clusters', 'salesman_trigger', 'events']
            print(f"{'Table':<20} | {'Row Count'}")
            print("-" * 35)
            for t in tables:
                try:
                    count = conn.execute(text(f"SELECT COUNT(*) FROM {t}")).scalar()
                    print(f"{t:<20} | {count}")
                except Exception as e:
                    print(f"{t:<20} | Error: {e}")
                    
    except Exception as e:
        print("Database Connection Error:", e)

if __name__ == "__main__":
    check_counts()
