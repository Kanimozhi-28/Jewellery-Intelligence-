from sqlalchemy import create_engine, text

# Connection string
DATABASE_URL = "postgresql://postgres:root@10.100.101.152:5432/Jewel_mob?sslmode=disable"

def add_status_column():
    try:
        engine = create_engine(DATABASE_URL)
        with engine.connect() as conn:
            print("Adding 'status' column to 'users' table...")
            conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Active'"))
            conn.commit()
            print("Successfully added 'status' column!")
            
    except Exception as e:
        print("Error adding column:")
        print(e)

if __name__ == "__main__":
    add_status_column()
