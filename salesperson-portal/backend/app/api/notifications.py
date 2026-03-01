
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, text, func
from app.models.database import get_db
from app.models.models import SalesTrigger
from datetime import datetime
from typing import Optional

router = APIRouter()

@router.get("/poll")
async def poll_notifications(
    salesperson_id: str,
    last_timestamp: Optional[str] = Query(None, description="ISO timestamp of last check"),
    db: AsyncSession = Depends(get_db)
):
    try:
        # Case-insensitive comparison
        query = select(SalesTrigger).where(func.lower(SalesTrigger.sales_personid) == salesperson_id.lower())
        
        if last_timestamp:
            try:
                # Basic ISO parsing
                ts = datetime.fromisoformat(last_timestamp.replace('Z', '+00:00'))
                # IMPORTANT: Convert to naive UTC or strip tz to match DB 'timestamp without time zone'
                ts_naive = ts.replace(tzinfo=None)
                
                print(f"DEBUG POLL: ID={salesperson_id}, LastTS (Frontend)={last_timestamp}, Naive={ts_naive}")
                
                query = query.where(SalesTrigger.timestamp > ts_naive)
            except ValueError:
                pass # Ignore invalid timestamp, return all (or limits)
        
        # Order by newest first
        query = query.order_by(SalesTrigger.timestamp.desc()).limit(5)
        
        result = await db.execute(query)
        triggers = result.scalars().all()
        
        if triggers:
            print(f"DEBUG POLL: Finding {len(triggers)} triggers for {salesperson_id}")

        return {
            "notifications": [
                {
                    "id": t.id,
                    "customer_id": t.customer_id,
                    "salesperson_name": t.salesperson_name,
                    "timestamp": t.timestamp.isoformat()
                }
                for t in triggers
            ]
        }
    except Exception as e:
        print(f"Error polling notifications: {e}")
        return {"notifications": []}
