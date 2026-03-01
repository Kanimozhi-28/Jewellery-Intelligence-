import os
from sqlalchemy import create_engine, inspect
import urllib.parse

# Use the connection string from database.py (hardcoded here for the script to be standalone/reliable)
# host = "10.100.101.152"
# password = "root"
# db = "Jewel_mob"
DATABASE_URL = "postgresql://postgres:root@10.100.101.152:5432/Jewel_mob?sslmode=disable"

def check_schema():
    try:
        print(f"Connecting to {DATABASE_URL}...")
        engine = create_engine(DATABASE_URL)
        inspector = inspect(engine)
        
        tables = inspector.get_table_names()
        print(f"Connected! Found {len(tables)} tables.")
        print("-" * 30)
        
        for table_name in tables:
            print(f"Table: {table_name}")
            columns = inspector.get_columns(table_name)
            col_names = [col['name'] for col in columns]
            print(f"  Columns: {', '.join(col_names)}")
            print("-" * 30)
            
    except Exception as e:
        print("Error connecting or inspecting schema:")
        print(e)

if __name__ == "__main__":
    check_schema()
