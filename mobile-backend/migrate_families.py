
from database import engine, Base
from sqlalchemy import text

def migrate():
    with engine.connect() as conn:
        conn = conn.execution_options(isolation_level="AUTOCOMMIT")
        
        # 1. Create family_clusters table
        print("Creating family_clusters table...")
        try:
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS family_clusters (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR UNIQUE,
                    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (now() at time zone 'utc')
                );
            """))
            print("Created family_clusters table.")
        except Exception as e:
            print(f"Error creating table: {e}")

        # 2. Add columns to customers
        print("Adding columns to customers table...")
        try:
            conn.execute(text("ALTER TABLE customers ADD COLUMN IF NOT EXISTS family_id INTEGER REFERENCES family_clusters(id);"))
            conn.execute(text("ALTER TABLE customers ADD COLUMN IF NOT EXISTS family_relationship VARCHAR;"))
            print("Added columns to customers.")
        except Exception as e:
            print(f"Error altering customers table: {e}")

if __name__ == "__main__":
    migrate()
