import asyncio
import os
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import select
from app.models.database import engine
from app.models.models import Zone, Salesperson, Customer, Session, JewelleryScan

async def check_tables():
    async with engine.connect() as conn:
        print("Checking Tables...")
        for table in [Zone, Salesperson, Customer, Session, JewelleryScan]:
            try:
                res = await conn.execute(select(table))
                print(f"{table.__tablename__}: {res.fetchall()}")
            except Exception as e:
                print(f"Error checking {table.__tablename__}: {str(e)}")

if __name__ == "__main__":
    asyncio.run(check_tables())
