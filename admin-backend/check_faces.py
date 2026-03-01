from sqlalchemy import create_engine, text

# Connection string
DATABASE_URL = "postgresql://postgres:root@10.100.101.152:5432/Jewel_mob?sslmode=disable"

def check_faces():
    try:
        engine = create_engine(DATABASE_URL)
        with engine.connect() as conn:
            # Query for the specific salesmen
            result = conn.execute(text("SELECT id, username, full_name, customer_jpg, embedding FROM users WHERE full_name IN ('EMP001', 'EMP002') OR username IN ('EMP2650', 'EMP2927')"))
            
            print(f"{'ID':<5} {'Username':<15} {'Name':<10} {'Customer JPG (First 50 chars)':<35} {'Embedding (Length)'}")
            print("-" * 90)
            for row in result:
                jpg_preview = str(row.customer_jpg)[:50] if row.customer_jpg else "None"
                emb_len = len(str(row.embedding)) if row.embedding else 0
                print(f"{row.id:<5} {row.username:<15} {row.full_name:<10} {jpg_preview:<35} {emb_len}")
            
    except Exception as e:
        print("Error checking faces:")
        print(e)

if __name__ == "__main__":
    check_faces()
