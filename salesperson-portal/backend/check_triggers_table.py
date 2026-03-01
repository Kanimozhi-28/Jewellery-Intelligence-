
import asyncio
import os
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from dotenv import load_dotenv

load_dotenv(r"c:\Users\kanimozhi.a\Downloads\JewelleryIntelligence project\.env")

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    DATABASE_URL = "postgresql+asyncpg://postgres:postgres@localhost:5432/jewellery_db"

async def check_triggers():
    engine = create_async_engine(DATABASE_URL)
    async with engine.connect() as conn:
        try:
            # Check if table exists
            print("Checking if sales_triggers table exists...")
            result = await conn.execute(text("SELECT to_regclass('public.sales_triggers');"))
            table_exists = result.scalar()
            
            if table_exists:
                print("Table 'sales_triggers' exists.")
                # Get columns
                cols = await conn.execute(text("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'sales_triggers';"))
                print("Columns:")
                for col in cols.fetchall():
                    print(f"- {col[0]} ({col[1]})")
            else:
                print("Table 'sales_triggers' DOES NOT EXIST. (It might need to be created)")
            
        except Exception as e:
            print(f"Error: {e}")
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(check_triggers())
