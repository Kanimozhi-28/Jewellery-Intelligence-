from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError

# DB Credentials
DB_HOST = "10.100.21.222"
DB_NAME = "jewel_mob"
DB_USER = "jewel_user"
DB_PASS = "jewel123"

# Construct connection string
DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}/{DB_NAME}"

def list_tables():
    print(f"Connecting to {DB_HOST} to list tables...")
    try:
        engine = create_engine(DATABASE_URL, connect_args={"connect_timeout": 10})
        with engine.connect() as connection:
            # query to get all table names in public schema
            query = text("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
            result = connection.execute(query)
            tables = [row[0] for row in result.fetchall()]
            
            if tables:
                print("\nTables found in 'public' schema:")
                for table in tables:
                    print(f"- {table}")
            else:
                print("\nNo tables found in 'public' schema.")
                
    except OperationalError as e:
        print("Connection Failed!")
        print(f"Error: {e}")
    except Exception as e:
        print("An error occurred!")
        print(f"Error: {e}")

if __name__ == "__main__":
    list_tables()
