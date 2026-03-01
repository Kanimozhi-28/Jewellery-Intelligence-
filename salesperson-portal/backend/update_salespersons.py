
import asyncio
import os
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from dotenv import load_dotenv

load_dotenv(r"c:\Users\kanimozhi.a\Downloads\JewelleryIntelligence project\.env")

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    DATABASE_URL = "postgresql+asyncpg://postgres:postgres@localhost:5432/jewellery_db"

async def update_salespersons():
    engine = create_async_engine(DATABASE_URL)
    async with engine.begin() as conn:
        try:
            # 1. Add columns if missing
            print("Ensuring columns exist...")
            await conn.execute(text("ALTER TABLE salespersons ADD COLUMN IF NOT EXISTS zone VARCHAR;"))
            await conn.execute(text("ALTER TABLE salespersons ADD COLUMN IF NOT EXISTS password VARCHAR;"))
            
            # 2. Delete all existing rows
            print("Deleting existing rows...")
            await conn.execute(text("TRUNCATE TABLE salespersons RESTART IDENTITY CASCADE;"))
            
            # 3. Insert new rows with explicit NULL password
            print("Inserting new rows with password=NULL...")
            # Note: We can explicitly insert NULL or just omit the column if default is NULL.
            # But prompt says "add password column as null", implying explicit handling.
            await conn.execute(text("""
                INSERT INTO salespersons (id, name, role, zone, password) VALUES
                ('emp008', 'Arun Kumar', 'salesperson', 'gold', NULL),
                ('emp009', 'Priya Sharma', 'salesperson', 'silver', NULL),
                ('emp010', 'Rakesh Patel', 'salesperson', 'diamond', NULL);
            """))
            
            print("Update completed successfully.")
        except Exception as e:
            print(f"Error during update: {e}")
            
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(update_salespersons())
