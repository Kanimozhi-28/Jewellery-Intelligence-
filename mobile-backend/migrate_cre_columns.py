from sqlalchemy import text
from database import engine

def migrate():
    columns_to_add = [
        ("assigned_salesperson_id", "INTEGER REFERENCES users(id)"),
        ("is_floating", "BOOLEAN DEFAULT FALSE")
    ]
    
    with engine.connect() as conn:
        for col_name, col_type in columns_to_add:
            try:
                print(f"Adding column {col_name} to customers table...")
                conn.execute(text(f"ALTER TABLE customers ADD COLUMN {col_name} {col_type};"))
                conn.commit()
                print(f"Successfully added {col_name}.")
            except Exception as e:
                print(f"Error adding {col_name}: {e}")
                conn.rollback()

if __name__ == "__main__":
    migrate()
