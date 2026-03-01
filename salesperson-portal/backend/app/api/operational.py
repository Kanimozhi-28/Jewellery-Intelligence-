from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, cast, String, func
from ..models.database import get_db
from ..models.models import Customer, Session, JewelleryScan, PersonFace, Jewellery, Salesperson, SalesTrigger
from pydantic import BaseModel
from typing import List
import datetime
import base64

router = APIRouter()

class ScanCreate(BaseModel):
    session_id: int
    barcode: str
    name: str
    price: float
    comment: str = ""

class ScanRequest(BaseModel):
    session_id: int
    jewellery_code: str

@router.get("/live-customers/{zone_id}")
async def get_live_customers(zone_id: str, salesperson_id: str = None, db: AsyncSession = Depends(get_db)):
    print(f"DEBUG: Fetching live customers for zone: {zone_id}, salesperson: {salesperson_id}")
    
    customers = []
    try:
        # User requested to get details from sales_triggers table
        # We prioritize filtered by salesperson_id if provided, as triggers are assigned to specific salespersons
        query = select(SalesTrigger)
        
        if salesperson_id:
             query = query.where(func.lower(SalesTrigger.sales_personid) == salesperson_id.lower())
        
        # Order by newest first
        query = query.order_by(SalesTrigger.timestamp.desc())
        
        result = await db.execute(query)
        triggers = result.scalars().all()
        
        seen_customers = set()
        for t in triggers:
            # Deduplicate by customer_id
            if t.customer_id in seen_customers:
                continue
            seen_customers.add(t.customer_id)
            
            # Encode binary photo to base64 string
            photo_encoded = base64.b64encode(t.customer_jpg).decode('utf-8') if t.customer_jpg else None
            
            customers.append({
                "id": str(t.customer_id),
                "zone_id": zone_id, # Keeping requested zone for consistency
                "detected_at": t.timestamp,
                "is_active": True,
                "photo": photo_encoded,
                "salesperson_name": t.salesperson_name 
            })
              
    except Exception as e:
        print(f"DEBUG ERROR: SalesTrigger query failed: {str(e)}")
    
    return customers

@router.post("/sessions/start")
async def start_session(customer_id: str, salesperson_id: str, db: AsyncSession = Depends(get_db)):
    print(f"DEBUG: Starting session for customer={customer_id}, salesperson={salesperson_id}")
    try:
        # 1. Ensure Salesperson exists (for PoC)
        s_query = select(Salesperson).where(Salesperson.id == salesperson_id)
        s_result = await db.execute(s_query)
        if not s_result.scalar_one_or_none():
            print(f"DEBUG: Salesperson {salesperson_id} not found, creating...")
            new_sp = Salesperson(id=salesperson_id, name=f"Salesperson {salesperson_id}", role="salesperson")
            db.add(new_sp)
            await db.flush()

        # 2. Ensure Customer exists (for PoC)
        c_query = select(Customer).where(Customer.id == customer_id)
        c_result = await db.execute(c_query)
        if not c_result.scalar_one_or_none():
            print(f"DEBUG: Customer {customer_id} not found, creating...")
            new_cust = Customer(id=customer_id, zone_id="gold", is_active=True) # Default to gold zone
            db.add(new_cust)
            await db.flush()

        db_session = Session(customer_id=customer_id, salesperson_id=salesperson_id)
        db.add(db_session)
        await db.commit()
        await db.refresh(db_session)
        print(f"DEBUG: Session created successfully with ID: {db_session.id}")
        return db_session
    except Exception as e:
        print(f"DEBUG ERROR in start_session: {str(e)}")
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/scans")
async def add_scan(scan: ScanCreate, db: AsyncSession = Depends(get_db)):
    db_scan = JewelleryScan(**scan.dict())
    db.add(db_scan)
    await db.commit()
    return {"status": "success"}

@router.post("/scan-jewellery")
async def scan_jewellery(request: ScanRequest, db: AsyncSession = Depends(get_db)):
    # 1. Find Jewellery
    j_query = select(Jewellery).where(Jewellery.barcode == request.jewellery_code)
    result = await db.execute(j_query)
    jewellery = result.scalar_one_or_none()
    
    if not jewellery:
        raise HTTPException(status_code=404, detail="Jewellery not found")
    
    # 2. Check for duplicate
    d_query = select(JewelleryScan).where(
        JewelleryScan.session_id == request.session_id,
        JewelleryScan.barcode == request.jewellery_code
    )
    d_result = await db.execute(d_query)
    if d_result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Duplicate scan: Item already added to session")
    
    # 3. Create Scan
    db_scan = JewelleryScan(
        session_id=request.session_id,
        barcode=jewellery.barcode,
        name=jewellery.name,
        price=jewellery.price,
        comment=""
    )
    db.add(db_scan)
    await db.commit()
    await db.refresh(db_scan)
    
    return db_scan

@router.get("/sessions/{session_id}/scans")
async def get_session_scans(session_id: int, db: AsyncSession = Depends(get_db)):
    query = select(JewelleryScan).where(JewelleryScan.session_id == session_id).order_by(JewelleryScan.scanned_at.desc())
    result = await db.execute(query)
    scans = result.scalars().all()
    return scans

@router.post("/sessions/end/{session_id}")
async def end_session(session_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Session).where(Session.id == session_id))
    db_session = result.scalar_one_or_none()
    if not db_session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    db_session.end_time = datetime.datetime.utcnow()
    db_session.status = "completed"
    await db.commit()
    return {"status": "success"}

@router.put("/scans/{scan_id}")
async def update_scan(scan_id: int, comment: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(JewelleryScan).where(JewelleryScan.id == scan_id))
    db_scan = result.scalar_one_or_none()
    if not db_scan:
        raise HTTPException(status_code=404, detail="Scan not found")
    
    db_scan.comment = comment
    await db.commit()
    await db.refresh(db_scan)
    return db_scan

@router.get("/salesperson-stats/{salesperson_id}")
async def get_salesperson_stats(salesperson_id: str, db: AsyncSession = Depends(get_db)):
    print(f"DEBUG: Fetching stats for salesperson: {salesperson_id}")
    
    # 1. Total Completed Sessions (Customers Attended)
    q_sessions = select(Session).where(
        Session.salesperson_id == salesperson_id,
        Session.status == 'completed'
    )
    r_sessions = await db.execute(q_sessions)
    sessions = r_sessions.scalars().all()
    total_sessions = len(sessions)
    
    # 2. Total Items Shown & Revenue
    # Join Session to filter by salesperson
    q_scans = select(JewelleryScan).join(Session).where(
        Session.salesperson_id == salesperson_id
    )
    r_scans = await db.execute(q_scans)
    scans = r_scans.scalars().all()
    
    total_items = len(scans)
    total_revenue = sum(scan.price for scan in scans if scan.price)
    
    # 3. Avg Session Duration
    total_duration_minutes = 0
    sessions_with_time = 0
    for s in sessions:
        if s.start_time and s.end_time:
            delta = s.end_time - s.start_time
            total_duration_minutes += delta.total_seconds() / 60
            sessions_with_time += 1
            
    avg_duration = round(total_duration_minutes / sessions_with_time) if sessions_with_time > 0 else 0
    
    return {
        "customers_attended": total_sessions,
        "items_shown": total_items,
        "total_revenue_potential": total_revenue,
        "avg_session_minutes": avg_duration
    }
