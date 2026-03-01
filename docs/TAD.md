# Technical Architecture Document (TAD)
## Admin Jewel Portal

**Version:** 1.0  
**Last Updated:** January 22, 2026  
**Architecture Owner:** DataGold Engineering Team

---

## 1. System Overview

### 1.1 Architecture Pattern
The Admin Jewel Portal follows a **three-tier architecture**:
- **Presentation Layer**: React-based SPA (Single Page Application)
- **Application Layer**: FastAPI REST API server
- **Data Layer**: PostgreSQL relational database

### 1.2 High-Level Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        Browser[Web Browser]
    end
    
    subgraph "Frontend - React SPA"
        App[App.jsx]
        Router[React Router]
        Context[Context Providers]
        Pages[Pages Components]
        UI[UI Components]
    end
    
    subgraph "Backend - FastAPI"
        API[FastAPI Server]
        Auth[Authentication]
        CRUD[CRUD Operations]
        Schemas[Pydantic Schemas]
    end
    
    subgraph "Data Layer"
        DB[(PostgreSQL Database)]
        ML[Face Recognition System]
    end
    
    Browser --> App
    App --> Router
    Router --> Pages
    Pages --> Context
    Pages --> UI
    Context --> API
    API --> Auth
    API --> CRUD
    CRUD --> Schemas
    Schemas --> DB
    ML -.-> DB
    
    style Browser fill:#e1f5ff
    style App fill:#fff4e6
    style API fill:#f0f9ff
    style DB fill:#f0fdf4
```

### 1.3 Technology Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Frontend** | React | 18.x | UI framework |
| | Vite | 5.x | Build tool & dev server |
| | Tailwind CSS | 3.x | Styling framework |
| | Recharts | 2.x | Data visualization |
| | Lucide React | Latest | Icon library |
| **Backend** | Python | 3.8+ | Programming language |
| | FastAPI | Latest | Web framework |
| | SQLAlchemy | Latest | ORM |
| | Pydantic | Latest | Data validation |
| | Uvicorn | Latest | ASGI server |
| **Database** | PostgreSQL | 12+ | Relational database |
| **DevOps** | Git | Latest | Version control |

---

## 2. Frontend Architecture

### 2.1 Project Structure

```
admin-portal/
├── public/                    # Static assets
├── src/
│   ├── assets/               # Images, fonts
│   ├── components/           # Reusable components
│   │   ├── charts/          # Chart components
│   │   │   ├── CustomersLineChart.jsx
│   │   │   ├── SalesBarChart.jsx
│   │   │   ├── TrafficPieChart.jsx
│   │   │   └── HeatmapChart.jsx
│   │   ├── layout/          # Layout components
│   │   │   ├── Sidebar.jsx
│   │   │   └── Header.jsx
│   │   └── ui/              # UI primitives
│   │       ├── Button.jsx
│   │       ├── Card.jsx
│   │       ├── Table.jsx
│   │       └── Badge.jsx
│   ├── context/             # React Context
│   │   ├── AuthContext.jsx  # Authentication state
│   │   └── DataContext.jsx  # Application data
│   ├── pages/               # Page components
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Customers.jsx
│   │   ├── Salesmen.jsx
│   │   ├── Reports.jsx
│   │   ├── Settings.jsx
│   │   └── Integrations.jsx
│   ├── services/            # API services
│   │   └── api.js
│   ├── utils/               # Utility functions
│   │   └── sessionHelpers.js
│   ├── App.jsx              # Main app component
│   ├── App.css              # App styles
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

### 2.2 Component Architecture

#### 2.2.1 Context Providers

**AuthContext.jsx**
- Manages user authentication state
- Stores user info in localStorage
- Provides login/logout functions
- Exposes: `user`, `login()`, `logout()`

**DataContext.jsx**
- Fetches and caches application data
- Manages loading states
- Provides data to all components
- Exposes: `customers`, `salespersons`, `sessions`, `jewellery`, `familyClusters`, `metrics`, `auditLogs`, `activityHeatmap`

#### 2.2.2 Page Components

| Page | Route | Key Features |
|------|-------|--------------|
| **Login** | `/login` | Username/password authentication |
| **Dashboard** | `/` | Metrics cards, charts, heatmap |
| **Customers** | `/customers` | Customer list, session details, family modal |
| **Salesmen** | `/salesmen` | Salesperson CRUD, session tracking, floating customers |
| **Reports** | `/reports` | Report generation, PDF/CSV/Excel export |
| **Settings** | `/settings` | System configuration (placeholder) |
| **Integrations** | `/integrations` | Third-party integrations (placeholder) |

#### 2.2.3 UI Components

**Design System:**
- **Card**: Container with header, content, footer
- **Table**: Responsive data table with sorting
- **Button**: Primary, outline, ghost variants
- **Badge**: Status indicators with color variants
- **Modal**: Overlay dialogs for details

**Styling Approach:**
- Tailwind CSS utility classes
- Custom CSS for complex layouts
- Responsive design (mobile-first)
- Dark mode support (planned)

### 2.3 State Management

```mermaid
graph LR
    A[User Action] --> B[Component]
    B --> C{Local State?}
    C -->|Yes| D[useState]
    C -->|No| E{Auth Related?}
    E -->|Yes| F[AuthContext]
    E -->|No| G[DataContext]
    F --> H[API Call]
    G --> H
    H --> I[Backend]
    I --> J[Update State]
    J --> K[Re-render]
```

**State Layers:**
1. **Local State**: Component-specific (forms, modals, filters)
2. **Context State**: Shared across components (user, data)
3. **Server State**: Fetched from API (customers, sessions)

### 2.4 Data Flow

**Fetch Pattern:**
```javascript
// DataContext.jsx
useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const [customersRes, salespersonsRes, sessionsRes] = 
        await Promise.all([
          fetch('http://localhost:8000/customers/'),
          fetch('http://localhost:8000/users/'),
          fetch('http://localhost:8000/sessions/')
        ]);
      
      setCustomers(await customersRes.json());
      setSalespersons(await salespersonsRes.json());
      setSessions(await sessionsRes.json());
    } catch (error) {
      console.error('Data fetch failed:', error);
    } finally {
      setLoading(false);
    }
  };
  
  fetchData();
}, []);
```

---

## 3. Backend Architecture

### 3.1 Project Structure

```
backend/
├── main.py                  # FastAPI app & routes
├── models.py                # SQLAlchemy ORM models
├── schemas.py               # Pydantic schemas
├── crud.py                  # Database operations
├── database.py              # DB connection config
├── requirements.txt         # Python dependencies
├── static/                  # Uploaded files
│   └── uploads/
└── [utility scripts]        # Data inspection/migration
```

### 3.2 API Design

#### 3.2.1 API Endpoints

**Authentication**
```
POST   /login/                    # User login
```

**Users (Salespersons)**
```
GET    /users/                    # List all users
POST   /users/                    # Create user
PUT    /users/{id}                # Update user
DELETE /users/{id}                # Delete user
GET    /users/credentials/        # Get all credentials (admin)
```

**Customers**
```
GET    /customers/                # List all customers
```

**Sessions**
```
GET    /sessions/                 # List all sessions (with details)
POST   /sessions/                 # Create session
```

**Jewels**
```
GET    /jewels/                   # List all jewels
POST   /jewels/                   # Create jewel
```

**Analytics**
```
GET    /metrics/                  # Dashboard metrics
GET    /activity-heatmap/         # Hourly activity by floor
GET    /audit-logs/               # System audit logs (mock)
```

**Triggers**
```
GET    /triggers/                 # Salesperson notifications
```

**Family Clusters**
```
GET    /family-clusters/          # List family groups
```

**File Upload**
```
POST   /upload/                   # Upload image (returns URL)
```

#### 3.2.2 Request/Response Examples

**Login Request:**
```json
POST /login/
{
  "username": "vishwa",
  "password": "password"
}
```

**Login Response:**
```json
{
  "id": 1,
  "username": "vishwa",
  "role": "admin",
  "name": "Vishwa Kumar"
}
```

**Get Sessions Response:**
```json
[
  {
    "id": 1,
    "salesperson_id": 1,
    "customer_id": 5,
    "start_time": "2026-01-22T10:30:00",
    "end_time": "2026-01-22T11:15:00",
    "status": "completed",
    "notes": "Customer interested in gold bangles",
    "salesperson": {
      "id": 1,
      "username": "vishwa",
      "full_name": "Vishwa Kumar",
      "role": "salesman",
      "zone": "First Floor",
      "photo": "http://localhost:8000/static/uploads/abc123.jpg"
    },
    "customer": {
      "id": 5,
      "short_id": "CUST-393816",
      "total_visits": 3,
      "photo": "data:image/jpeg;base64,..."
    },
    "details": [
      {
        "id": 10,
        "jewel_id": 25,
        "action": "Shown",
        "comments": "Customer liked the design",
        "jewel": {
          "id": 25,
          "name": "Gold Bangles Set",
          "barcode": "JWL-001",
          "price": 125000
        }
      }
    ]
  }
]
```

### 3.3 Database Layer

#### 3.3.1 ORM Models (SQLAlchemy)

**Key Models:**

```python
# models.py

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(100))
    role = Column(String(20))  # 'admin', 'manager', 'salesman'
    is_active = Column(Boolean, default=True)
    zone = Column("floor", String(50))  # Mapped to 'floor' column
    status_text = Column("status", String(50))
    customer_jpg = Column(String(255))  # Photo URL
    embedding = Column(Text)  # Face embedding
    
    sessions = relationship("Session", back_populates="salesperson")

class Customer(Base):
    __tablename__ = "customers"
    id = Column(Integer, primary_key=True)
    short_id = Column(String(50), unique=True)
    face_embedding_id = Column(String(100))
    first_seen = Column(DateTime)
    last_seen = Column(DateTime)
    total_visits = Column(Integer, default=1)
    current_floor = Column(String(50))
    is_in_store = Column(Boolean, default=False)
    customer_jpg = Column(Text)  # Photo data
    family_id = Column(Integer, ForeignKey("family_clusters.id"))
    family_relationship = Column(String(50))
    
    sessions = relationship("Session", back_populates="customer")
    family = relationship("FamilyCluster", back_populates="members")

class Session(Base):
    __tablename__ = "sessions"
    id = Column(Integer, primary_key=True)
    salesperson_id = Column(Integer, ForeignKey("users.id"))
    customer_id = Column(Integer, ForeignKey("customers.id"))
    start_time = Column(DateTime)
    end_time = Column(DateTime)
    status = Column(String(20))  # 'active', 'completed'
    notes = Column(Text)
    
    salesperson = relationship("User", back_populates="sessions")
    customer = relationship("Customer", back_populates="sessions")
    details = relationship("SessionDetails", back_populates="session")

class SessionDetails(Base):
    __tablename__ = "session_details"
    id = Column(Integer, primary_key=True)
    session_id = Column(Integer, ForeignKey("sessions.id"))
    jewel_id = Column(Integer, ForeignKey("jewels.id"))
    action = Column(String(50))  # 'Shown', 'Sold'
    comments = Column(Text)
    timestamp = Column(DateTime)
    
    session = relationship("Session", back_populates="details")
    jewel = relationship("Jewel")

class Jewel(Base):
    __tablename__ = "jewels"
    id = Column(Integer, primary_key=True)
    barcode = Column(String(50), unique=True)
    name = Column(String(100))
    description = Column(Text)
    price = Column(DECIMAL(10, 2))
    stock = Column(Integer, default=0)
    photo_url = Column(String(255))

class FamilyCluster(Base):
    __tablename__ = "family_clusters"
    id = Column(Integer, primary_key=True)
    name = Column(String(100))
    created_at = Column(DateTime)
    
    members = relationship("Customer", back_populates="family")
```

#### 3.3.2 Database Schema

**Entity Relationship Diagram:**

```mermaid
erDiagram
    USERS ||--o{ SESSIONS : "handles"
    CUSTOMERS ||--o{ SESSIONS : "participates"
    SESSIONS ||--o{ SESSION_DETAILS : "contains"
    JEWELS ||--o{ SESSION_DETAILS : "shown_in"
    FAMILY_CLUSTERS ||--o{ CUSTOMERS : "groups"
    USERS ||--o{ SALESMAN_TRIGGER : "receives"
    
    USERS {
        int id PK
        string username UK
        string password_hash
        string full_name
        string role
        boolean is_active
        string floor
        string status
        string customer_jpg
        text embedding
    }
    
    CUSTOMERS {
        int id PK
        string short_id UK
        datetime first_seen
        datetime last_seen
        int total_visits
        string current_floor
        boolean is_in_store
        text customer_jpg
        int family_id FK
        string family_relationship
    }
    
    SESSIONS {
        int id PK
        int salesperson_id FK
        int customer_id FK
        datetime start_time
        datetime end_time
        string status
        text notes
    }
    
    SESSION_DETAILS {
        int id PK
        int session_id FK
        int jewel_id FK
        string action
        text comments
        datetime timestamp
    }
    
    JEWELS {
        int id PK
        string barcode UK
        string name
        text description
        decimal price
        int stock
        string photo_url
    }
    
    FAMILY_CLUSTERS {
        int id PK
        string name
        datetime created_at
    }
    
    SALESMAN_TRIGGER {
        int id PK
        int salesperson_id FK
        int customer_id FK
        string customer_short_id
        string customer_jpg
        datetime time_stamp
        string floor
        boolean is_notified
    }
```

**Key Relationships:**
- One User (salesperson) → Many Sessions
- One Customer → Many Sessions
- One Session → Many SessionDetails
- One Jewel → Many SessionDetails
- One FamilyCluster → Many Customers

#### 3.3.3 Database Configuration

```python
# database.py
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "postgresql://jewel_user:jewel123@10.100.21.222/jewel_mob"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

**Connection Details:**
- **Host**: 10.100.21.222
- **Database**: jewel_mob
- **User**: jewel_user
- **Password**: jewel123
- **Port**: 5432 (default PostgreSQL)

### 3.4 Business Logic Layer

#### 3.4.1 CRUD Operations

**Key Functions (crud.py):**

```python
# User Management
def get_user_by_username(db: Session, username: str)
def create_user(db: Session, user: schemas.UserCreate)
def update_user(db: Session, user_id: int, user_data: schemas.UserCreate)
def delete_user(db: Session, user_id: int)

# Customer Operations
def get_customers(db: Session, skip: int = 0, limit: int = 100)

# Session Management
def get_sessions(db: Session, skip: int = 0, limit: int = 100)
def create_session(db: Session, session: schemas.SessionCreate)

# Analytics
def get_dashboard_metrics(db: Session)
def get_activity_heatmap(db: Session)
def get_audit_logs(db: Session, skip: int = 0, limit: int = 100)
```

#### 3.4.2 Data Validation (Pydantic)

```python
# schemas.py

class UserBase(BaseModel):
    username: str
    full_name: Optional[str] = None
    role: Optional[str] = "salesman"
    zone: Optional[str] = "First Floor"
    status: str = "Active"
    photo: Optional[str] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    created_at: Optional[datetime] = None
    has_embedding: bool = False
    
    class Config:
        from_attributes = True

class Session(BaseModel):
    id: int
    salesperson_id: Optional[int]
    customer_id: Optional[int]
    start_time: Optional[datetime]
    end_time: Optional[datetime]
    status: Optional[str]
    notes: Optional[str]
    salesperson: Optional[User]
    customer: Optional[Customer]
    details: List[SessionDetailsWithJewel] = []
    
    class Config:
        from_attributes = True
```

### 3.5 Middleware & CORS

```python
# main.py
from fastapi.middleware.cors import CORSMiddleware

origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 4. Data Flow & Integration

### 4.1 Complete Request Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as API
    participant C as CRUD
    participant D as Database
    
    U->>F: Click "View Customers"
    F->>F: Check AuthContext
    F->>A: GET /customers/
    A->>C: get_customers(db)
    C->>D: SELECT * FROM customers
    D-->>C: Customer rows
    C-->>A: Customer objects
    A->>A: Serialize to JSON
    A-->>F: JSON response
    F->>F: Update DataContext
    F->>F: Re-render component
    F-->>U: Display customer list
```

### 4.2 Face Recognition Integration

```mermaid
graph LR
    A[Camera System] --> B[Face Detection ML]
    B --> C[Generate Embedding]
    C --> D[Store in ml_detections]
    D --> E[Match Existing Customer]
    E --> F{Match Found?}
    F -->|Yes| G[Update last_seen]
    F -->|No| H[Create New Customer]
    G --> I[Trigger Notification]
    H --> I
    I --> J[salesman_trigger table]
    J --> K[Frontend Polls /triggers/]
    K --> L[Display Alert]
```

**Data Flow:**
1. Camera captures face → ML system processes
2. Embedding stored in `ml_detections` table
3. System matches against existing `customers.embedding`
4. If match: Update `last_seen`, `is_in_store`, `current_floor`
5. If new: Create customer record with `short_id`
6. Create `salesman_trigger` record for notification
7. Frontend displays floating customer for allocation

### 4.3 Session Lifecycle

```mermaid
stateDiagram-v2
    [*] --> CustomerDetected
    CustomerDetected --> Allocated: Manager assigns salesperson
    Allocated --> SessionStarted: Salesperson begins interaction
    SessionStarted --> ShowingJewels: Present items
    ShowingJewels --> ShowingJewels: Add more items
    ShowingJewels --> RecordingSale: Customer purchases
    RecordingSale --> SessionCompleted: End session
    ShowingJewels --> SessionCompleted: No purchase
    SessionCompleted --> [*]
    
    note right of CustomerDetected
        ml_detections table
        salesman_trigger table
    end note
    
    note right of SessionStarted
        sessions table
        status = 'active'
    end note
    
    note right of ShowingJewels
        session_details table
        action = 'Shown'
    end note
    
    note right of RecordingSale
        session_details table
        action = 'Sold'
    end note
```

---

## 5. Security Architecture

### 5.1 Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as API
    participant D as Database
    
    U->>F: Enter username/password
    F->>A: POST /login/ {username, password}
    A->>D: SELECT * FROM users WHERE username=?
    D-->>A: User record
    A->>A: Compare password (plaintext)
    alt Valid credentials
        A-->>F: {id, username, role, name}
        F->>F: Store in localStorage
        F->>F: Set AuthContext
        F-->>U: Redirect to dashboard
    else Invalid credentials
        A-->>F: 401 Unauthorized
        F-->>U: Show error message
    end
```

> [!CAUTION]
> **Security Vulnerability**: Passwords are currently stored and compared as plaintext. This is a critical security risk.

**Recommended Fix:**
```python
# Install: pip install passlib bcrypt
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# On user creation:
hashed_password = pwd_context.hash(plain_password)

# On login:
if not pwd_context.verify(plain_password, user.password_hash):
    raise HTTPException(status_code=401)
```

### 5.2 Authorization

**Role-based Access Control (RBAC):**

| Role | Permissions |
|------|------------|
| **Admin** | Full access: manage users, view all data, generate reports |
| **Manager** | View all data, manage salespersons, generate reports |
| **Salesman** | View assigned customers, update sessions, limited reports |

**Implementation Status:**
- ✅ Role stored in database
- ✅ Role returned on login
- ❌ **Not Implemented**: Backend endpoint protection
- ❌ **Not Implemented**: Frontend route guards

**Recommended Implementation:**
```python
# Dependency for protected routes
def get_current_user(token: str = Depends(oauth2_scheme)):
    # Verify JWT token
    # Return user object
    pass

def require_role(required_role: str):
    def role_checker(user: User = Depends(get_current_user)):
        if user.role != required_role:
            raise HTTPException(status_code=403)
        return user
    return role_checker

# Usage:
@app.delete("/users/{id}")
def delete_user(id: int, user: User = Depends(require_role("admin"))):
    # Only admins can delete users
    pass
```

### 5.3 Data Security

**Current Measures:**
- Database credentials hardcoded (development only)
- CORS restricted to known origins
- File uploads stored locally

**Production Requirements:**
- Environment variables for secrets
- HTTPS/TLS encryption
- SQL injection protection (SQLAlchemy ORM provides this)
- XSS protection (React provides this)
- CSRF tokens for state-changing operations
- Rate limiting on API endpoints
- Input validation (Pydantic provides this)

---

## 6. Performance Optimization

### 6.1 Database Optimization

**Query Optimization:**
```python
# Eager loading to avoid N+1 queries
def get_sessions(db: Session):
    return db.query(models.Session).options(
        joinedload(models.Session.salesperson),
        joinedload(models.Session.details).joinedload(models.SessionDetails.jewel)
    ).all()
```

**Indexing Strategy:**
```sql
-- Existing indexes (from schema)
CREATE UNIQUE INDEX idx_users_username ON users(username);
CREATE UNIQUE INDEX idx_customers_short_id ON customers(short_id);
CREATE UNIQUE INDEX idx_jewels_barcode ON jewels(barcode);

-- Recommended additional indexes
CREATE INDEX idx_sessions_salesperson_id ON sessions(salesperson_id);
CREATE INDEX idx_sessions_customer_id ON sessions(customer_id);
CREATE INDEX idx_sessions_start_time ON sessions(start_time);
CREATE INDEX idx_customers_last_seen ON customers(last_seen);
CREATE INDEX idx_ml_detections_timestamp ON ml_detections(timestamp);
```

### 6.2 Frontend Optimization

**Code Splitting:**
```javascript
// Lazy load pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Customers = lazy(() => import('./pages/Customers'));
const Reports = lazy(() => import('./pages/Reports'));

// Wrap in Suspense
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="/customers" element={<Customers />} />
  </Routes>
</Suspense>
```

**Data Caching:**
- Context providers cache API responses
- Refresh on user action or timer
- Optimistic UI updates for mutations

**Bundle Size:**
- Vite tree-shaking for unused code
- Recharts loaded only on Dashboard
- Icon library tree-shaken by Lucide

### 6.3 API Performance

**Response Time Targets:**
- Simple queries (users, customers): <200ms
- Complex queries (sessions with joins): <500ms
- Analytics (heatmap, metrics): <1s
- File uploads: <2s

**Optimization Techniques:**
- Database connection pooling (SQLAlchemy default)
- Pagination for large datasets
- Selective field loading
- Response compression (gzip)

---

## 7. Deployment Architecture

### 7.1 Development Environment

**Frontend:**
```bash
cd admin-portal
npm install
npm run dev
# Runs on http://localhost:5173
```

**Backend:**
```bash
cd backend
pip install -r requirements.txt
python main.py
# Runs on http://localhost:8000
```

**Database:**
- Remote PostgreSQL server (10.100.21.222)
- No local setup required

### 7.2 Production Deployment

**Recommended Architecture:**

```mermaid
graph TB
    subgraph "Client"
        Browser[Web Browser]
    end
    
    subgraph "CDN / Static Hosting"
        Static[React Build<br/>Nginx/Vercel/Netlify]
    end
    
    subgraph "Application Server"
        LB[Load Balancer]
        API1[FastAPI Instance 1]
        API2[FastAPI Instance 2]
    end
    
    subgraph "Database"
        DB[(PostgreSQL<br/>Primary)]
        DBR[(PostgreSQL<br/>Replica)]
    end
    
    subgraph "External Services"
        ML[Face Recognition<br/>Service]
    end
    
    Browser --> Static
    Static --> LB
    LB --> API1
    LB --> API2
    API1 --> DB
    API2 --> DB
    DB -.Replication.-> DBR
    ML --> DB
    
    style Browser fill:#e1f5ff
    style Static fill:#fff4e6
    style LB fill:#f0f9ff
    style DB fill:#f0fdf4
```

**Deployment Steps:**

1. **Frontend Build:**
```bash
npm run build
# Outputs to dist/ folder
# Deploy to Nginx, Vercel, or Netlify
```

2. **Backend Deployment:**
```bash
# Using Gunicorn + Uvicorn workers
gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

3. **Environment Configuration:**
```bash
# .env file
DATABASE_URL=postgresql://user:pass@host/db
SECRET_KEY=your-secret-key
ALLOWED_ORIGINS=https://yourdomain.com
```

4. **Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    # Frontend
    location / {
        root /var/www/admin-portal/dist;
        try_files $uri /index.html;
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://localhost:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 7.3 Monitoring & Logging

**Application Monitoring:**
- **Backend**: Python logging module
- **Frontend**: Console errors, Sentry (recommended)
- **Database**: PostgreSQL logs, pg_stat_statements

**Metrics to Track:**
- API response times
- Error rates (4xx, 5xx)
- Database query performance
- User session duration
- Feature usage analytics

**Logging Strategy:**
```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

@app.post("/login/")
def login(request: LoginRequest):
    logger.info(f"Login attempt: {request.username}")
    # ... authentication logic
    logger.info(f"Login successful: {request.username}")
```

---

## 8. Testing Strategy

### 8.1 Backend Testing

**Unit Tests:**
```python
# test_crud.py
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from crud import get_user_by_username, create_user

def test_create_user():
    # Setup test database
    # Create user
    # Assert user exists
    pass

def test_get_user_by_username():
    # Create test user
    # Retrieve by username
    # Assert correct user returned
    pass
```

**API Tests:**
```python
# test_api.py
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_login_success():
    response = client.post("/login/", json={
        "username": "testuser",
        "password": "testpass"
    })
    assert response.status_code == 200
    assert "username" in response.json()

def test_get_customers():
    response = client.get("/customers/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
```

### 8.2 Frontend Testing

**Component Tests (Jest + React Testing Library):**
```javascript
// Dashboard.test.jsx
import { render, screen } from '@testing-library/react';
import Dashboard from './Dashboard';

test('renders dashboard metrics', () => {
  render(<Dashboard />);
  expect(screen.getByText(/Total Customers/i)).toBeInTheDocument();
  expect(screen.getByText(/Est. Total Sales/i)).toBeInTheDocument();
});
```

**Integration Tests:**
- Test complete user flows (login → view customers → generate report)
- Mock API responses
- Test error handling

### 8.3 End-to-End Testing

**Recommended Tool:** Playwright or Cypress

```javascript
// e2e/login.spec.js
test('user can login and view dashboard', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.fill('input[name="username"]', 'vishwa');
  await page.fill('input[name="password"]', 'password');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('http://localhost:5173/');
  await expect(page.locator('h2')).toContainText('Dashboard');
});
```

---

## 9. API Documentation

### 9.1 OpenAPI/Swagger

FastAPI automatically generates interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

### 9.2 Example API Calls

**cURL Examples:**

```bash
# Login
curl -X POST http://localhost:8000/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"vishwa","password":"password"}'

# Get Customers
curl http://localhost:8000/customers/

# Create User
curl -X POST http://localhost:8000/users/ \
  -H "Content-Type: application/json" \
  -d '{
    "username":"newuser",
    "password":"pass123",
    "full_name":"New User",
    "role":"salesman",
    "zone":"First Floor",
    "status":"Active"
  }'

# Upload Image
curl -X POST http://localhost:8000/upload/ \
  -F "file=@photo.jpg"
```

---

## 10. Dependencies

### 10.1 Frontend Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.x",
    "recharts": "^2.x",
    "lucide-react": "latest"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.x",
    "vite": "^5.x",
    "tailwindcss": "^3.x",
    "postcss": "^8.x",
    "autoprefixer": "^10.x",
    "eslint": "^8.x"
  }
}
```

### 10.2 Backend Dependencies

```txt
fastapi
uvicorn
sqlalchemy
psycopg2-binary
pydantic
python-multipart
```

---

## 11. Future Technical Enhancements

### 11.1 Short-term (3 months)
- [ ] Implement JWT authentication
- [ ] Add password hashing (bcrypt)
- [ ] Set up automated backups
- [ ] Add API rate limiting
- [ ] Implement comprehensive logging

### 11.2 Medium-term (6 months)
- [ ] WebSocket for real-time updates
- [ ] Redis caching layer
- [ ] Elasticsearch for advanced search
- [ ] Automated testing pipeline (CI/CD)
- [ ] Docker containerization

### 11.3 Long-term (12 months)
- [ ] Microservices architecture
- [ ] GraphQL API option
- [ ] Mobile app (React Native)
- [ ] AI-powered recommendations
- [ ] Multi-tenancy support

---

## 12. Troubleshooting Guide

### 12.1 Common Issues

**Frontend won't start:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**Backend database connection error:**
```bash
# Check database connectivity
psql -h 10.100.21.222 -U jewel_user -d jewel_mob

# Verify credentials in database.py
# Ensure network access to remote server
```

**CORS errors:**
```python
# Add frontend URL to allowed origins in main.py
origins = [
    "http://localhost:5173",  # Add your frontend URL
]
```

**Image upload fails:**
```bash
# Ensure static/uploads directory exists
mkdir -p backend/static/uploads
chmod 755 backend/static/uploads
```

---

## 13. Glossary

| Term | Definition |
|------|------------|
| **ORM** | Object-Relational Mapping (SQLAlchemy) |
| **ASGI** | Asynchronous Server Gateway Interface (Uvicorn) |
| **SPA** | Single Page Application |
| **CRUD** | Create, Read, Update, Delete operations |
| **JWT** | JSON Web Token (for authentication) |
| **CORS** | Cross-Origin Resource Sharing |
| **Eager Loading** | Loading related data in a single query |
| **N+1 Problem** | Performance issue from multiple queries |

---

**Document Status:** ✅ Complete  
**Next Review:** March 2026  
**Maintained By:** Engineering Team
