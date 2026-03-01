
from database import engine, Base
from sqlalchemy import text
import models

def migrate_sales_history():
    print("Creating sales_history table...")
    models.Base.metadata.create_all(bind=engine)
    print("Done.")

if __name__ == "__main__":
    migrate_sales_history()
