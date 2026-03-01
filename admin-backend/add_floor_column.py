from sqlalchemy import create_engine, text

# Connection string
DATABASE_URL = "postgresql://postgres:root@10.100.101.152:5432/Jewel_mob?sslmode=disable"

def add_column():
    try:
        engine = create_engine(DATABASE_URL)
        with engine.connect() as conn:
            print("Adding 'floor' column to 'users' table...")
            conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS floor VARCHAR(50) DEFAULT 'First Floor'"))
            conn.commit()
            print("Successfully added 'floor' column!")
            
    except Exception as e:
        print("Error adding column:")
        print(e)

if __name__ == "__main__":
    add_column()
