from sqlalchemy import create_engine, text

DATABASE_URL = "postgresql://postgres:root@10.100.101.152:5432/Jewel_mob?sslmode=disable"

def check_all_counts():
    try:
        engine = create_engine(DATABASE_URL)
        with engine.connect() as conn:
            tables = ['users', 'customers', 'jewels', 'sessions', 'family_clusters', 'salesman_trigger']
            print(f"{'Table':<20} | {'Count'}")
            print("-" * 30)
            for t in tables:
                try:
                    count = conn.execute(text(f"SELECT COUNT(*) FROM {t}")).scalar()
                    print(f"{t:<20} | {count}")
                except Exception as e:
                    print(f"{t:<20} | ERROR")
    except Exception as e:
        print("DB Check Failed:", e)

if __name__ == "__main__":
    check_all_counts()
