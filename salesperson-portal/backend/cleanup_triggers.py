import asyncio
import os
import sys

# Ensure the current directory is in the python path to allow imports from 'app'
sys.path.append(os.getcwd())

from sqlalchemy import delete
from app.models.database import AsyncSessionLocal
from app.models.models import SalesTrigger

async def cleanup():
    async with AsyncSessionLocal() as session:
        print("Starting cleanup of sales_triggers table...")
        
        # Create deletion statement - DELETE ALL
        stmt = delete(SalesTrigger)
        
        # Execute
        result = await session.execute(stmt)
        await session.commit()
        
        print(f"Cleanup complete. Deleted {result.rowcount} rows (ALL DATA).")

if __name__ == "__main__":
    try:
        asyncio.run(cleanup())
    except Exception as e:
        print(f"An error occurred: {e}")
