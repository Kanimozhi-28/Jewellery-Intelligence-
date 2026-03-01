import asyncio
import sys
import os
from sqlalchemy import select
from sqlalchemy import text

# Ensure backend root is in python path
sys.path.append(os.getcwd())

from app.models.database import AsyncSessionLocal
from app.models.models import SalesTrigger

async def list_data():
    async with AsyncSessionLocal() as db:
        print("Fetching all Sales Triggers...")
        result = await db.execute(select(SalesTrigger))
        triggers = result.scalars().all()
        
        print(f"Total Triggers: {len(triggers)}")
        for t in triggers:
            print(f"ID: {t.id} | CustomerID: {t.customer_id} | Name: {t.salesperson_name}")

if __name__ == "__main__":
    asyncio.run(list_data())
