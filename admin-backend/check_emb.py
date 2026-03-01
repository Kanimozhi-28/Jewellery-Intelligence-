from sqlalchemy import create_engine, text

# Connection string
DATABASE_URL = "postgresql://postgres:root@10.100.101.152:5432/Jewel_mob?sslmode=disable"

def check_embedding_content():
    try:
        engine = create_engine(DATABASE_URL)
        with engine.connect() as conn:
            result = conn.execute(text("SELECT username, embedding FROM users WHERE username = 'EMP2650'"))
            for row in result:
                if row.embedding:
                    print(f"User: {row.username}")
                    print(f"Embedding type: {type(row.embedding)}")
                    print(f"First 100 chars: {str(row.embedding)[:100]}")
                else:
                    print("No embedding found.")
            
    except Exception as e:
        print("Error:")
        print(e)

if __name__ == "__main__":
    check_embedding_content()
