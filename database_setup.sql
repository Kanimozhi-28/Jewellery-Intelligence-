-- Database Setup Script for Jewel_mob
-- Share this with the Admin Dashboard Developer

-- 1. Users Table (Salesmen and Admins)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'salesman', -- 'admin' or 'salesman'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Customers Table (Linked to ML Identity)
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    short_id VARCHAR(20) UNIQUE, -- e.g., CUST-AB3D9F
    face_embedding_id VARCHAR(100), -- ID used by DeepFace/ML
    first_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_seen TIMESTAMP,
    total_visits INT DEFAULT 1,
    current_floor VARCHAR(50),
    is_in_store BOOLEAN DEFAULT FALSE
);

-- 3. ML Detections (Raw Log from ML System)
CREATE TABLE IF NOT EXISTS ml_detections (
    id SERIAL PRIMARY KEY,
    random_id VARCHAR(50),
    photo_path VARCHAR(255), -- Path or URL to image
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    floor VARCHAR(50)
);

-- 4. Salesman Trigger (Notification Bridge)
-- ML System inserts here -> Backend detects -> Sends Notification
CREATE TABLE IF NOT EXISTS salesman_trigger (
    id SERIAL PRIMARY KEY,
    salesperson_id INT REFERENCES users(id),
    sales_person_name VARCHAR(100),
    customer_id INT REFERENCES customers(id), -- Optional, if linked
    customer_short_id VARCHAR(50), -- Fallback if customer_id not yet known
    customer_jpg VARCHAR(255),
    time_stamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    floor VARCHAR(50),
    is_notified BOOLEAN DEFAULT FALSE -- Backend updates this to TRUE after sending
);

-- 5. Jewels (Inventory)
CREATE TABLE IF NOT EXISTS jewels (
    id SERIAL PRIMARY KEY,
    barcode VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100),
    description TEXT,
    price DECIMAL(10, 2),
    stock INT DEFAULT 1,
    photo_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Sessions (Interaction)
CREATE TABLE IF NOT EXISTS sessions (
    id SERIAL PRIMARY KEY,
    salesperson_id INT REFERENCES users(id),
    customer_id INT REFERENCES customers(id),
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'completed'
    notes TEXT
);

-- 7. Session Details (Items shown)
CREATE TABLE IF NOT EXISTS session_details (
    id SERIAL PRIMARY KEY,
    session_id INT REFERENCES sessions(id),
    jewel_id INT REFERENCES jewels(id),
    action VARCHAR(50), -- 'shown', 'interested', 'purchased'
    comments TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Family Clusters
CREATE TABLE IF NOT EXISTS family_clusters (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS family_members (
    cluster_id INT REFERENCES family_clusters(id),
    customer_id INT REFERENCES customers(id),
    PRIMARY KEY (cluster_id, customer_id)
);

-- Index for polling performance
CREATE INDEX IF NOT EXISTS idx_trigger_notified ON salesman_trigger(is_notified);
