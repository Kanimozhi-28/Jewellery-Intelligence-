import asyncio
import os
import sys

# Ensure the current directory is in the python path
sys.path.append(os.getcwd())

from sqlalchemy import select
from app.models.database import AsyncSessionLocal
from app.models.models import Jewellery

async def seed_jewellery():
    async with AsyncSessionLocal() as session:
        print("Seeding jewellery table with sample data...")
        
        # Sample data from user's request
        samples = [
            {"barcode": "JWL001", "name": "Diamond Ring", "price": 125000.0, "category": "Ring"},
            {"barcode": "JWL002", "name": "Gold Necklace", "price": 85000.0, "category": "Necklace"},
            {"barcode": "JWL003", "name": "Silver Bracelet", "price": 15000.0, "category": "Bracelet"}
        ]
        
        for item in samples:
            # Check if exists
            result = await session.execute(select(Jewellery).where(Jewellery.barcode == item["barcode"]))
            existing = result.scalar_one_or_none()
            
            if not existing:
                print(f"Adding new item: {item['name']} ({item['barcode']})")
                new_item = Jewellery(**item)
                session.add(new_item)
            else:
                print(f"Item already exists: {item['barcode']}")
        
        await session.commit()
        print("Seeding complete.")

if __name__ == "__main__":
    try:
        asyncio.run(seed_jewellery())
    except Exception as e:
        print(f"An error occurred: {e}")
