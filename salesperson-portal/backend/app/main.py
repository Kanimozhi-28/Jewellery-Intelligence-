from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import asyncio
from .api import operational, notifications
from .models.database import engine, Base

app = FastAPI(title="Jewellery Intelligence - Salesperson API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    retries = 5
    for i in range(retries):
        try:
            print(f"Attempting to connect to database (attempt {i+1}/{retries})...")
            async with engine.begin() as conn:
                await conn.run_sync(Base.metadata.create_all)
            print("Database connection successful.")
            break
        except Exception as e:
            print(f"Database connection failed: {e}")
            if i < retries - 1:
                wait_time = 5 * (i + 1)
                print(f"Retrying in {wait_time} seconds...")
                await asyncio.sleep(wait_time)
            else:
                print("Could not connect to database after multiple retries.")
                raise e

app.include_router(operational.router, prefix="/api/operational", tags=["Operational"])
app.include_router(notifications.router, prefix="/api/notifications", tags=["Notifications"])

@app.get("/")
def read_root():
    return {"msg": "Salesperson Interaction Backend Online"}
