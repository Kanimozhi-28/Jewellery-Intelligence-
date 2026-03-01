from sqlalchemy import text
from database import engine

def check_raw(cluster_id):
    try:
        with engine.connect() as connection:
            result = connection.execute(text(f"SELECT * FROM family_members LIMIT 10"))
            rows = result.fetchall()
            print(f"Raw SQL check for cluster_id {cluster_id}: found {len(rows)} rows.")
            for row in rows:
                print(row)
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_raw(8)
