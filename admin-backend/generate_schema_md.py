import psycopg2
from database import DB_HOST, DB_NAME, DB_USER, DB_PASS
import os

OUTPUT_FILE = "database_schema.md"

def generate_md():
    try:
        conn = psycopg2.connect(host=DB_HOST, database=DB_NAME, user=DB_USER, password=DB_PASS)
        cur = conn.cursor()

        # Query information_schema for columns
        cur.execute("""
            SELECT table_name, column_name, data_type, is_nullable
            FROM information_schema.columns 
            WHERE table_schema = 'public'
            ORDER BY table_name, ordinal_position;
        """)
        rows = cur.fetchall()
        
        # Organize by table
        schema = {}
        for table, col, dtype, nullable in rows:
            if table not in schema:
                schema[table] = []
            schema[table].append((col, dtype, nullable))

        with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
            f.write(f"# Database Schema Documentation\n\n")
            f.write(f"**Database:** `{DB_NAME}`\n")
            f.write(f"**Host:** `{DB_HOST}`\n\n")
            f.write("---\n\n")
            
            for table, cols in schema.items():
                f.write(f"### Table: `{table}`\n\n")
                f.write("| Column Name | Data Type | Nullable |\n")
                f.write("| :--- | :--- | :---: |\n")
                for col, dtype, nullable in cols:
                    f.write(f"| **{col}** | `{dtype}` | {nullable} |\n")
                f.write("\n---\n\n")
        
        print(f"Schema documented in {os.path.abspath(OUTPUT_FILE)}")
        conn.close()

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    generate_md()
