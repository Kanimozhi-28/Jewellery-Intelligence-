from sqlalchemy import create_engine, text
import pandas as pd

DATABASE_URL = "postgresql://postgres:root@10.100.101.152:5432/Jewel_mob?sslmode=disable"

def show_family_clusters():
    try:
        engine = create_engine(DATABASE_URL)
        with engine.connect() as conn:
            query = text("SELECT id, name, created_at FROM family_clusters")
            df = pd.read_sql(query, conn)
            print("--- Family Clusters Table (Remote DB) ---")
            print(df.to_string(index=False))
            
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    show_family_clusters()
