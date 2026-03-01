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
        # First, check if there are any dependent triggers to avoid foreign key errors
        # Note: In your models, triggers and sessions have foreign keys to users
        
        # Delete from sessions first if any
        connection.execute(text("DELETE FROM sessions WHERE salesperson_id = 16"))
        
        # Delete from salesman_trigger first if any
        connection.execute(text("DELETE FROM salesman_trigger WHERE salesperson_id = 16"))
        
        # Now delete the user
        result = connection.execute(text("DELETE FROM users WHERE id = 16 AND username = 'string'"))
        connection.commit()
        
        if result.rowcount > 0:
            print(f"Successfully deleted user 'string' (ID: 16) and their associated data.")
        else:
            print("User 'string' (ID: 16) not found or already deleted.")
except Exception as e:
    print(f"Error during deletion: {str(e)}")
