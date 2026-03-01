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

with engine.connect() as connection:
    result = connection.execute(text("SELECT id, username, full_name, role FROM users WHERE username = 'string' OR full_name = 'string'"))
    users = result.fetchall()
    
    if not users:
        print("No user found with username or full_name 'string'.")
        # Let's list all users to see what's actually there
        print("\nCurrent Users in DB:")
        result_all = connection.execute(text("SELECT id, username, full_name FROM users"))
        for row in result_all:
            print(f"ID: {row.id}, Username: {row.username}, Name: {row.full_name}")
    else:
        for user in users:
            print(f"FOUND: ID: {user.id}, Username: {user.username}, Name: {user.full_name}, Role: {user.role}")
