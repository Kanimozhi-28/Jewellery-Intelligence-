from sqlalchemy import create_engine, text
import pandas as pd

DATABASE_URL = "postgresql://postgres:root@10.100.101.152:5432/Jewel_mob?sslmode=disable"

def show_customers():
    try:
        engine = create_engine(DATABASE_URL)
        with engine.connect() as conn:
            # Query all columns except embedding which are too large
            query = text("SELECT id, short_id, first_seen, last_seen, total_visits, current_floor, is_in_store FROM customers")
            df = pd.read_sql(query, conn)
            print("--- Customer Table (Remote DB) ---")
            print(df.to_string(index=False))
            
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    show_customers()
