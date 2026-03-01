from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Update with your actual database URL

SQLALCHEMY_DATABASE_URL = "postgresql://jewel_user:jewel123@10.100.21.222/jewel_mob"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"connect_timeout": 10},
    pool_pre_ping=True,
    pool_recycle=300,
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
