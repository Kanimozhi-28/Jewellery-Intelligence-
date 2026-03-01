
import asyncio
import os
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from dotenv import load_dotenv

load_dotenv(r"c:\Users\kanimozhi.a\Downloads\JewelleryIntelligence project\.env")

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    # Try to find it in the other .env or assume local
    DATABASE_URL = "postgresql+asyncpg://postgres:postgres@localhost:5432/jewellery_db" # fallback
    print(f"Using fallback DB URL: {DATABASE_URL}")
else:
    print(f"Using DB URL from env: {DATABASE_URL}")

async def inspect_table():
    engine = create_async_engine(DATABASE_URL)
    async with engine.connect() as conn:
        try:
            result = await conn.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name = 'salespersons';"))
            columns = [row[0] for row in result.fetchall()]
            print("Columns in salespersons table:", columns)
        except Exception as e:
            print(f"Error: {e}")
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(inspect_table())
