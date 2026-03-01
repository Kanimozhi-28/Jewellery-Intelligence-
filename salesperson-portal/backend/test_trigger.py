
import asyncio
import os
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from dotenv import load_dotenv
import datetime

load_dotenv(r"c:\Users\kanimozhi.a\Downloads\JewelleryIntelligence project\.env")

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    DATABASE_URL = "postgresql+asyncpg://postgres:postgres@localhost:5432/jewellery_db"

async def create_test_trigger():
    engine = create_async_engine(DATABASE_URL)
    async with engine.begin() as conn:
        try:
            print("Inserting test trigger for emp008...")
            await conn.execute(text("""
                INSERT INTO sales_triggers (sales_personid, salesperson_name, customer_id, timestamp)
                VALUES ('emp008', 'Arun Kumar', 12345, NOW());
            """))
            print("Test trigger inserted successfully.")
        except Exception as e:
            print(f"Error: {e}")
            
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(create_test_trigger())
