from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError

# DB Credentials
DB_HOST = "10.100.21.222"
DB_NAME = "jewel_mob"
DB_USER = "jewel_user"
DB_PASS = "jewel123"

# Construct connection string
DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}/{DB_NAME}"

def test_connection():
    print(f"Attempting to connect to {DB_HOST}...")
    try:
        engine = create_engine(DATABASE_URL, connect_args={"connect_timeout": 5})
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            print("Connection Successful!")
            print(f"Test query result: {result.fetchone()}")
    except OperationalError as e:
        print("Connection Failed!")
        print(f"Error: {e}")
    except Exception as e:
        print("An error occurred!")
        print(f"Error: {e}")

if __name__ == "__main__":
    test_connection()
