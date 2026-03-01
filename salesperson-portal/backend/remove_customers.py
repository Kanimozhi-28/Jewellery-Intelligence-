import asyncio
import sys
import os
from sqlalchemy import text
from sqlalchemy import select

# Ensure backend root is in python path
sys.path.append(os.getcwd())

from app.models.database import AsyncSessionLocal
from app.models.models import Session

async def delete_specific_customers():
    async with AsyncSessionLocal() as db:
        print("Starting CASCADE deletion process...")
        
        target_customers = [438122, 167155]
        target_customers_str = ["438122", "167155"]
        
        # 1. Get Session IDs for these customers (to delete scans)
        print("Finding related sessions...")
        stmt_find_sessions = select(Session.id).where(Session.customer_id.in_(target_customers_str))
        result_sessions = await db.execute(stmt_find_sessions)
        session_ids = result_sessions.scalars().all()
        
        if session_ids:
            # 2. Delete Scans for those sessions
            print(f"Deleting scans for {len(session_ids)} sessions...")
            # Format list string manually for raw SQL safe list: (id1, id2)
            session_ids_str = ",".join(map(str, session_ids))
            stmt_scans = text(f"DELETE FROM jewellery_scans WHERE session_id IN ({session_ids_str})")
            await db.execute(stmt_scans)
            
            # 3. Delete Sessions
            print("Deleting sessions...")
            stmt_del_sessions = text(f"DELETE FROM sessions WHERE id IN ({session_ids_str})")
            await db.execute(stmt_del_sessions)
        
        # 4. Delete from sales_triggers
        print("Deleting from sales_triggers...")
        stmt_triggers = text(f"DELETE FROM sales_triggers WHERE customer_id IN ({','.join(map(str, target_customers))})")
        await db.execute(stmt_triggers)
        
        # 5. Delete from customers
        print("Deleting from customers table...")
        # Format string list for SQL: ('id1', 'id2')
        ids_sql = ",".join([f"'{x}'" for x in target_customers_str])
        stmt_customers = text(f"DELETE FROM customers WHERE id IN ({ids_sql})")
        result = await db.execute(stmt_customers)
        
        print(f"Deleted {result.rowcount} customers.")
        
        await db.commit()
        print("Deletion complete.")

if __name__ == "__main__":
    asyncio.run(delete_specific_customers())
