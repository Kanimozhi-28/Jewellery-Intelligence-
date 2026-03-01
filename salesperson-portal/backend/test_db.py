import asyncio
import os
from sqlalchemy.ext.asyncio import create_async_engine
from dotenv import load_dotenv
from sqlalchemy import text

async def test_conn():
    load_dotenv()
    url = os.getenv("DATABASE_URL")
    print(f"Connecting to: {url}")
    try:
        engine = create_async_engine(url)
        async with engine.connect() as conn:
            result = await conn.execute(text("SELECT 1"))
            print(f"Success! Result: {result.fetchone()}")
    except Exception as e:
        print(f"Connection failed: {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_conn())
