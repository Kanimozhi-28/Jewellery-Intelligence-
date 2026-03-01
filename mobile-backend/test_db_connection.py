from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError

# DB Configuration provided by user
DB_HOST = "10.100.21.222"
DB_NAME = "jewel_mob"
DB_USER = "jewel_user"
DB_PASS = "jewel123"

DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}/{DB_NAME}"

print(f"Attempting to connect to: {DATABASE_URL}")

try:
    engine = create_engine(DATABASE_URL)
    with engine.connect() as connection:
        print("\nSUCCESS: Connection established!")
        
        # List tables
        from sqlalchemy import inspect
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        
        print(f"\nTables found in '{DB_NAME}':")
        if tables:
            for table in tables:
                print(f" - {table}")
        else:
            print(" - No tables found.")

except SQLAlchemyError as e:
    print("\nFAILURE: Could not connect to the database.")
    print(f"Error: {e}")
except Exception as e:
    print(f"\nAn unexpected error occurred: {e}")
