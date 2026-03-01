from sqlalchemy import create_engine, text

DATABASE_URL = "postgresql://postgres:root@10.100.101.152:5432/Jewel_mob?sslmode=disable"

def create_cluster():
    try:
        engine = create_engine(DATABASE_URL)
        with engine.connect() as conn:
            # 1. Create a family cluster
            cluster_name = "Elite Family Cluster"
            conn.execute(text("INSERT INTO family_clusters (name, created_at) VALUES (:name, now())"), {"name": cluster_name})
            
            # 2. Get the cluster id
            cluster_id = conn.execute(text("SELECT id FROM family_clusters WHERE name = :name ORDER BY created_at DESC LIMIT 1"), {"name": cluster_name}).scalar()
            print(f"Created Cluster ID: {cluster_id}")
            
            # 3. Add members (using their IDs)
            members = [269103, 304710]
            for m_id in members:
                # Check if already exists to avoid PK violation
                exists = conn.execute(text("SELECT 1 FROM family_members WHERE cluster_id = :cid AND customer_id = :mid"), {"cid": cluster_id, "mid": m_id}).scalar()
                if not exists:
                    conn.execute(text("INSERT INTO family_members (cluster_id, customer_id) VALUES (:cid, :mid)"), {"cid": cluster_id, "mid": m_id})
                    print(f"Added customer {m_id} to cluster {cluster_id}")
                else:
                    print(f"Customer {m_id} already in cluster {cluster_id}")
            
            conn.commit()
            print("Successfully linked family members.")
            
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    create_cluster()
