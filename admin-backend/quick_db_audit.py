from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()

DB_HOST = "10.100.21.222"
DB_NAME = "jewel_mob"
DB_USER = "jewel_user"
DB_PASS = "jewel123"
DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}/{DB_NAME}"

engine = create_engine(DATABASE_URL)

try:
    with engine.connect() as connection:
        j_res = connection.execute(text("SELECT COUNT(*) FROM jewels")).scalar()
        sd_res = connection.execute(text("SELECT COUNT(*) FROM session_details")).scalar()
        print(f"Total Jewels: {j_res}")
        print(f"Total SessionDetails: {sd_res}")
        
        if j_res > 0:
            names = connection.execute(text("SELECT name FROM jewels LIMIT 5")).fetchall()
            print("Sample Jewels:", [n[0] for n in names])
except Exception as e:
    print(f"Error: {e}")
