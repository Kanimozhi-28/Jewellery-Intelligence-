from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
import models, schemas
from datetime import datetime

# --- Users ---
def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def create_user(db: Session, user: schemas.UserCreate):
    # Remote DB just has full_name, username, password, etc.
    db_user = models.User(
        username=user.username,
        password_hash=user.password, # Plaintext for now as per prev setup
        full_name=user.full_name,
        role=user.role,
        is_active=(user.status == "Active"),
        zone=user.zone,
        status_text=user.status,
        customer_jpg=user.photo
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def delete_user(db: Session, user_id: int):
    user = get_user(db, user_id)
    if user:
        db.delete(user)
        db.commit()
    return user

def update_user(db: Session, user_id: int, user_data: schemas.UserCreate):
    db_user = get_user(db, user_id)
    if db_user:
        # Update fieldswith open("backend_debug.log", "a") as f:
        db_user.username = user_data.username
        # Plaintext update as per requirement
        if user_data.password:
            db_user.password_hash = user_data.password 
        db_user.full_name = user_data.full_name
        db_user.role = user_data.role
        db_user.is_active = (user_data.status == "Active") # Auto-sync is_active based on text status
        db_user.zone = user_data.zone # Now persists to 'floor' column
        db_user.status_text = user_data.status # Now persists to 'status' column
        db_user.customer_jpg = user_data.photo
        
        # Virtual/Mock fields (won't persist but accepted)
        # db_user.sales_count = user.sales
        
        db.commit()
        db.refresh(db_user)
    return db_user

# --- Jewels ---
def get_jewels(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Jewel).offset(skip).limit(limit).all()

def create_jewel(db: Session, jewel: schemas.JewelCreate):
    db_jewel = models.Jewel(**jewel.dict(exclude_unset=True)) # Naive mapping
    db.add(db_jewel)
    db.commit()
    db.refresh(db_jewel)
    return db_jewel

# --- Customers ---
def get_customers(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Customer).order_by(models.Customer.last_seen.desc().nulls_last()).offset(skip).limit(limit).all()

# --- Sessions ---
def get_sessions(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Session).options(
        joinedload(models.Session.salesperson),
        joinedload(models.Session.details).joinedload(models.SessionDetails.jewel)
    ).offset(skip).limit(limit).all()

def create_session(db: Session, session: schemas.SessionCreate):
    db_session = models.Session(**session.dict())
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session

# --- Triggers ---
def get_triggers(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.SalesmanTrigger).order_by(models.SalesmanTrigger.time_stamp.desc()).offset(skip).limit(limit).all()

# --- Family Clusters ---
def get_family_clusters(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.FamilyCluster).offset(skip).limit(limit).all()

# --- Dashboard Metrics ---
# --- Dashboard Metrics ---
def get_dashboard_metrics(db: Session):
    total_sales_sessions = db.query(models.Session).count()
    total_customers = db.query(models.Customer).count()
    
    # Calculate average time per customer (session duration)
    sessions = db.query(models.Session).filter(models.Session.end_time != None).all()
    total_duration = 0
    count = 0
    for s in sessions:
        if s.start_time and s.end_time:
            duration = (s.end_time - s.start_time).total_seconds() / 60 # in minutes
            total_duration += duration
            count += 1
    
    avg_time = round(total_duration / count, 1) if count > 0 else 0
    
    # Calculate attended percentage (unique customers with sessions / total customers)
    attended_customers = db.query(models.Session.customer_id).distinct().count()
    attended_percentage = round((attended_customers / total_customers) * 100, 1) if total_customers > 0 else 0
    
    # Floor distribution (from MLDetections for historical traffic)
    floor_counts = db.query(
        models.MLDetections.floor,
        func.count(models.MLDetections.id).label('count')
    ).group_by(models.MLDetections.floor).all()
    
    floor_distribution = []
    for f in floor_counts:
        floor_distribution.append({
            "name": f.floor or "Unknown",
            "value": f.count
        })

    # Daily visits (Ensure all 7 days are present)
    days_map = {"Mon": 0, "Tue": 0, "Wed": 0, "Thu": 0, "Fri": 0, "Sat": 0, "Sun": 0}
    
    daily_stats = db.query(
        func.to_char(models.Session.start_time, 'Dy').label('day'),
        func.count(models.Session.id).label('count')
    ).group_by('day').all()
    
    for s in daily_stats:
        if s.day in days_map:
            days_map[s.day] = s.count
            
    # Return in correct calendar order
    ordered_days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    daily_visits = [{"name": day, "customers": days_map[day]} for day in ordered_days]

    # Top Interacted Jewels
    jewel_stats = db.query(
        models.Jewel.name,
        func.count(models.SessionDetails.id).label('count')
    ).join(models.SessionDetails, models.Jewel.id == models.SessionDetails.jewel_id)\
     .group_by(models.Jewel.name)\
     .order_by(func.count(models.SessionDetails.id).desc())\
     .limit(5).all()
    
    top_jewels = [{"name": j.name, "count": j.count} for j in jewel_stats]

    return {
        "total_sales_sessions": total_sales_sessions,
        "total_customers": total_customers,
        "avg_time_per_customer": avg_time,
        "attended_percentage": attended_percentage,
        "floor_distribution": floor_distribution,
        "daily_visits": daily_visits,
        "top_jewels": top_jewels
    }

# --- Audit Logs ---
def get_audit_logs(db: Session, skip: int = 0, limit: int = 100):
    # Mock data for demonstration since the table doesn't exist in remote DB yet
    today = datetime.now().date().isoformat()
    return [
        {
            "id": 201,
            "action": "USER_ADDED",
            "username": "Michael",
            "details": "Onboarded 'EMP001' (ID003) as Salesman.",
            "created_at": f"{today}T09:00:00"
        },

        {
            "id": 203,
            "action": "STATUS_CHANGE",
            "username": "Michael",
            "details": "Changed 'EMP001' status to Active.",
            "created_at": f"{today}T09:10:30"
        },
        {
            "id": 204,
            "action": "USER_ADDED",
            "username": "Michael",
            "details": "Onboarded 'EMP002' (ID004) to First Floor.",
            "created_at": f"{today}T10:15:00"
        },

        {
            "id": 206,
            "action": "ZONE_ASSIGN",
            "username": "System",
            "details": "Re-assigned 'Michael' to Second Floor.",
            "created_at": f"{today}T11:05:45"
        },
        {
            "id": 207,
            "action": "LOGIN",
            "username": "Michael",
            "details": "Admin 'Michael' logged in (Second Floor).",
            "created_at": f"{today}T11:30:20"
        }
    ]

# --- Analytics ---
def get_activity_heatmap(db: Session):
    # Fetch from MLDetections
    ml_results = db.query(
        models.MLDetections.floor,
        func.extract('hour', models.MLDetections.timestamp).label('hour'),
        func.count(models.MLDetections.id).label('count')
    ).group_by(models.MLDetections.floor, 'hour').all()
    
    # Mapping for requested zone names
    zone_map = {
        "First Floor": "First Floor",
        "Entrance": "Entrance",
        "Floor Entrance": "Entrance",
        "Floor First Floor": "First Floor",
        "Main Entrance": "Entrance",
        "Exit": "Exit",
        "Second Floor": "Second Floor",
        "second flloor": "Second Floor"
    }

    heatmap_data = []
    processed_keys = set()
    
    for r in ml_results:
        original_floor = r.floor or "Entrance"
        mapped_floor = zone_map.get(original_floor, original_floor)
        
        # Merge counts if multiple DB floors map to same display floor
        key = (mapped_floor, int(r.hour))
        found = False
        for entry in heatmap_data:
            if entry["floor"] == mapped_floor and entry["hour"] == int(r.hour):
                entry["count"] += r.count
                found = True
                break
        if not found:
            heatmap_data.append({
                "floor": mapped_floor,
                "hour": int(r.hour),
                "count": r.count
            })
    
    # Complement with Events data mapped to "Entrance" or specific cameras if needed
    if len(heatmap_data) < 10:
        event_results = db.query(
            models.Events.camera_name,
            func.extract('hour', models.Events.timestamp).label('hour'),
            func.count(models.Events.id).label('count')
        ).group_by(models.Events.camera_name, 'hour').all()
        
        for r in event_results:
            # Map camera names to requested zones
            cam = r.camera_name.lower() if r.camera_name else ""
            mapped_floor = "Entrance"
            if "first" in cam: mapped_floor = "First Floor"
            elif "second" in cam: mapped_floor = "Second Floor"
            elif "exit" in cam: mapped_floor = "Exit"
            
            found = False
            for entry in heatmap_data:
                if entry["floor"] == mapped_floor and entry["hour"] == int(r.hour):
                    entry["count"] += r.count
                    found = True
                    break
            if not found:
                heatmap_data.append({
                    "floor": mapped_floor,
                    "hour": int(r.hour),
                    "count": r.count
                })
            
    # Ensure all 4 requested zones are present at least once in the structure (even with 0) 
    # so they always show on the Y axis
    requested_zones = ["Entrance", "First Floor", "Second Floor", "Exit"]
    existing_zones = set(d["floor"] for d in heatmap_data)
    for z in requested_zones:
        if z not in existing_zones:
            heatmap_data.append({"floor": z, "hour": 12, "count": 0})

    return heatmap_data

from sqlalchemy import text

# --- CRE Functionality ---
def get_floating_customers(db: Session):
    # Customers in store who are NOT in the ignored_customers table and have no active session
    # Using raw SQL for ignored check to avoid ORM initialization issues
    try:
        res = db.execute(text("SELECT customer_id FROM ignored_customers")).fetchall()
        ignored_customer_ids = [r[0] for r in res]
    except:
        ignored_customer_ids = []

    active_session_customer_ids = db.query(models.Session.customer_id).filter(models.Session.end_time == None).subquery()
    
    customers = db.query(models.Customer).filter(
        models.Customer.is_in_store == True,
        ~models.Customer.id.in_(ignored_customer_ids),
        ~models.Customer.id.in_(active_session_customer_ids)
    ).all()
    
    return customers

def update_customer_ignored_status(db: Session, customer_id: int, is_ignored: bool):
    if is_ignored:
        # Add to ignored_customers if not already there
        exists = db.query(models.IgnoredCustomer).filter(models.IgnoredCustomer.customer_id == customer_id).first()
        if not exists:
            new_ignored = models.IgnoredCustomer(customer_id=customer_id, reason="Marked by CRE")
            db.add(new_ignored)
            db.commit()
    else:
        # Remove from ignored_customers
        db.query(models.IgnoredCustomer).filter(models.IgnoredCustomer.customer_id == customer_id).delete()
        db.commit()
    
    return db.query(models.Customer).filter(models.Customer.id == customer_id).first()
