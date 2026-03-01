import psycopg2
import json
from datetime import datetime, date
from decimal import Decimal
from database import DB_HOST, DB_NAME, DB_USER, DB_PASS
import os

OUTPUT_FILE = "remote_db_export.txt"

def json_serial(obj):
    """JSON serializer for objects not serializable by default json code"""
    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    if isinstance(obj, Decimal):
        return float(obj)
    raise TypeError (f"Type {type(obj)} not serializable")

def dump_db():
    print(f"Connecting to {DB_HOST}...")
    try:
        conn = psycopg2.connect(host=DB_HOST, database=DB_NAME, user=DB_USER, password=DB_PASS)
        cur = conn.cursor()

        # Get all tables
        cur.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name;
        """)
        tables = [row[0] for row in cur.fetchall()]
        
        with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
            f.write(f"REMOTE DATABASE DUMP\n")
            f.write(f"Timestamp: {datetime.now()}\n")
            f.write(f"Database: {DB_NAME} on {DB_HOST}\n")
            f.write("="*50 + "\n\n")

            for table in tables:
                print(f"Dumping table: {table}")
                f.write(f"TABLE: {table}\n")
                f.write("-" * (len(table) + 7) + "\n")
                
                # Get columns
                cur.execute(f"SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '{table}' ORDER BY ordinal_position")
                columns_info = cur.fetchall()
                col_names = [c[0] for c in columns_info]
                
                f.write(f"Schema: {', '.join([f'{c[0]}({c[1]})' for c in columns_info])}\n")
                
                # Get rows
                cur.execute(f"SELECT * FROM {table}")
                rows = cur.fetchall()
                f.write(f"Row Count: {len(rows)}\n\n")
                
                f.write("DATA:\n")
                if rows:
                    # Write as JSON lines for readability usually, but let's do a pretty text format or JSON
                    # Using JSON for structure within the text file
                    for row in rows:
                        row_dict = dict(zip(col_names, row))
                        f.write(json.dumps(row_dict, default=json_serial, indent=2))
                        f.write("\n,\n")
                else:
                    f.write("(No Data)\n")
                
                f.write("\n" + "="*50 + "\n\n")

        conn.close()
        print(f"\nSuccessfully exported data to {os.path.abspath(OUTPUT_FILE)}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    dump_db()
