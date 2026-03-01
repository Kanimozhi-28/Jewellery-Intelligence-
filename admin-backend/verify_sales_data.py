from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()

# Remote DB Credentials
DB_HOST = "10.100.21.222"
DB_NAME = "jewel_mob"
DB_USER = "jewel_user"
DB_PASS = "jewel123"
DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}/{DB_NAME}"

engine = create_engine(DATABASE_URL)

def verify_data():
    print("--- FETCHING REAL SESSION COUNTS FROM REMOTE DB ---")
    try:
        with engine.connect() as connection:
            query = text("""
                SELECT u.full_name, COUNT(s.id) 
                FROM users u 
                LEFT JOIN sessions s ON u.id = s.salesperson_id 
                WHERE u.full_name IN ('Marimuthu', 'Vishwa') 
                GROUP BY u.full_name
            """)
            result = connection.execute(query)
            rows = result.fetchall()
            
            if not rows:
                print("No data found for Marimuthu or Vishwa in the sessions table.")
            else:
                for row in rows:
                    name = row[0]
                    count = row[1]
                    sales_est = count * 125000
                    print(f"Salesperson: {name}")
                    print(f"  - Real Sessions in DB: {count}")
                    print(f"  - Dashboard Sales (Est.): ₹{sales_est:,}")
                    print("-" * 30)
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    verify_data()
