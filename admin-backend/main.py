from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from pydantic import BaseModel
import shutil
import os
import uuid

import models, schemas, crud
from database import SessionLocal, engine

# models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Admin Portal API")

# Mount static files
os.makedirs("static/uploads", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "http://localhost:5174", # Added new frontend port
    "http://127.0.0.1:5174",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, # Explicit origins required for allow_credentials=True
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Admin Portal API is running with Postgres"}

@app.post("/upload/")
async def upload_image(file: UploadFile = File(...)):
    # Generate unique filename
    file_extension = file.filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = f"static/uploads/{filename}"
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Return URL (assuming localhost for now, or relative path)
    return {"url": f"http://localhost:8000/{file_path}"}

# --- Users ---
@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    return crud.create_user(db=db, user=user)

@app.get("/users/", response_model=List[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all users from remote database"""
    return crud.get_users(db, skip=skip, limit=limit)

@app.get("/users/credentials/")
def get_user_credentials(db: Session = Depends(get_db)):
    """Get all users with their credentials (username and password) from remote database"""
    users = crud.get_users(db, skip=0, limit=1000)
    return [
        {
            "id": user.id,
            "username": user.username,
            "password": user.password_hash,  # Password stored in password_hash column
            "role": user.role,
            "full_name": user.full_name,
            "is_active": user.is_active
        }
        for user in users
    ]

@app.delete("/users/{user_id}", response_model=schemas.User)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = crud.delete_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.put("/users/{user_id}", response_model=schemas.User)
def update_user(user_id: int, user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Note: UserCreate requires password, but for update we might want a partial schema
    # For now, frontend sends the existing or dummy password
    db_user = crud.update_user(db, user_id, user)
    if not db_user:
         raise HTTPException(status_code=404, detail="User not found")
    return db_user

# --- Jewels ---
@app.post("/jewels/", response_model=schemas.Jewel)
def create_jewel(item: schemas.JewelCreate, db: Session = Depends(get_db)):
    return crud.create_jewel(db=db, jewel=item)

@app.get("/jewels/", response_model=List[schemas.Jewel])
def read_jewels(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_jewels(db, skip=skip, limit=limit)

# --- Customers ---
@app.get("/customers/", response_model=List[schemas.Customer])
def read_customers(skip: int = 0, limit: int = 1000, db: Session = Depends(get_db)):
    return crud.get_customers(db, skip=skip, limit=limit)

# --- Sessions ---
@app.post("/sessions/", response_model=schemas.Session)
def create_session(session: schemas.SessionCreate, db: Session = Depends(get_db)):
    return crud.create_session(db=db, session=session)

@app.get("/sessions/", response_model=List[schemas.Session])
def read_sessions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_sessions(db, skip=skip, limit=limit)

# --- Triggers ---
@app.get("/triggers/", response_model=List[schemas.Trigger])
def read_triggers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_triggers(db, skip=skip, limit=limit)

# --- Family Clusters ---
@app.get("/family-clusters/", response_model=List[schemas.FamilyCluster])
def read_family_clusters(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_family_clusters(db, skip=skip, limit=limit)

@app.get("/metrics/", response_model=Dict[str, Any])
def read_metrics(db: Session = Depends(get_db)):
    return crud.get_dashboard_metrics(db)

# --- Audit Logs ---
# --- Audit Logs ---
@app.get("/audit-logs/")
def read_audit_logs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_audit_logs(db, skip=skip, limit=limit)

@app.get("/activity-heatmap/", response_model=List[schemas.ActivityHeatmapEntry])
def read_activity_heatmap(db: Session = Depends(get_db)):
    return crud.get_activity_heatmap(db)


class LoginRequest(BaseModel):
    username: str
    password: str

@app.post("/login/")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    try:
        print(f"Login Attempt Received -> Username: '{request.username}', Password: '{request.password}'")
        
        # Get user from remote database
        user = crud.get_user_by_username(db, request.username)
        if not user:
            print(f"User '{request.username}' not found in database")
            raise HTTPException(status_code=401, detail="Invalid username or password")
        
        # Check if user is active
        if not user.is_active:
            print(f"User '{request.username}' is inactive")
            raise HTTPException(status_code=403, detail="User account is inactive")
        
        print(f"DB User Found -> Username: '{user.username}', Role: '{user.role}'")
        
        # Password verification (assuming passwords are stored as plaintext in remote DB)
        # If passwords are hashed, you would need to use bcrypt or similar here
        if user.password_hash != request.password:
            print(f"Password mismatch for user '{request.username}'")
            raise HTTPException(status_code=401, detail="Invalid username or password")
        
        # Return user data for frontend
        user_data = {
            "id": user.id,
            "username": user.username,
            "role": user.role or "salesman",
            "name": user.full_name or user.username
        }
        
        print(f"Login successful for user '{user.username}'")
        return user_data
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Login error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error during login")
