import asyncio
import sys
import os
import datetime
from sqlalchemy import text

# Ensure backend root is in python path
sys.path.append(os.getcwd())

from app.models.database import AsyncSessionLocal
from app.models.models import SalesTrigger

# Dummy 1x1 pixel JPEG white image
DUMMY_IMAGE = b'\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x01\x00H\x00H\x00\x00\xff\xdb\x00C\x00\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\db\x00C\x01\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xc0\x00\x11\x08\x00\x01\x00\x01\x03\x01"\x00\x02\x11\x01\x03\x11\x01\xff\xc4\x00\x15\x00\x01\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x08\xff\xc4\x00\x14\x10\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\xff\xc4\x00\x14\x01\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\xff\xc4\x00\x14\x11\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\xff\xda\x00\x0c\x03\x01\x00\x02\x11\x03\x11\x00?\x00\xb2\xc0\x07\xff\xd9'

async def populate():
    async with AsyncSessionLocal() as db:
        print("Clearing old triggers...")
        await db.execute(text("DELETE FROM sales_triggers"))
        await db.commit()
        
        print("Adding dummy customers...")
        triggers = [
            # Zone A Customers
            SalesTrigger(
                sales_personid="EMP001",
                salesperson_name="John Doe", 
                customer_id=101,
                customer_jpg=DUMMY_IMAGE,
                timestamp=datetime.datetime.utcnow()
            ),
            SalesTrigger(
                sales_personid=None,
                salesperson_name=None,
                customer_id=102, 
                customer_jpg=DUMMY_IMAGE,
                timestamp=datetime.datetime.utcnow()
            ),
             # Zone B Customer
            SalesTrigger(
                sales_personid="EMP002",
                salesperson_name="Jane Smith",
                customer_id=201,
                customer_jpg=DUMMY_IMAGE,
                timestamp=datetime.datetime.utcnow()
            ),
        ]
        
        db.add_all(triggers)
        await db.commit()
        print("Done! Added 3 dummy customers (2 in Zone A, 1 in Zone B).")

if __name__ == "__main__":
    asyncio.run(populate())
