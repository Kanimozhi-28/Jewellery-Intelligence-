import asyncio
import sys
import os
from sqlalchemy import text

# Ensure backend root is in python path
sys.path.append(os.getcwd())

from app.models.database import AsyncSessionLocal

async def delete_customers():
    async with AsyncSessionLocal() as db:
        print("Deleting customers 2903 and 2614...")
        
        # Delete from sales_triggers where customer_id matches
        stmt = text("DELETE FROM sales_triggers WHERE customer_id IN (2903, 2614)")
        result = await db.execute(stmt)
        await db.commit()
        
        print(f"Deleted {result.rowcount} records.")

if __name__ == "__main__":
    asyncio.run(delete_customers())
