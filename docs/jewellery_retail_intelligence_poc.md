# Jewellery Retail Intelligence - Proof of Concept (PoC) Approach

**Version:** 1.0  
**Document Type:** Technical PoC Strategy  
**Target:** MVP Development Roadmap

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [PoC Objectives](#poc-objectives)
3. [Tech Stack Selection](#tech-stack-selection)
4. [System Architecture](#system-architecture)
5. [Data Flow & Storage Strategy](#data-flow--storage-strategy)
6. [Privacy & Compliance Architecture](#privacy--compliance-architecture)
7. [PoC Implementation Phases](#poc-implementation-phases)
8. [Success Metrics](#success-metrics)
9. [Risk Mitigation](#risk-mitigation)
10. [Next Steps](#next-steps)

---

## Executive Summary

This PoC focuses on building a **privacy-first, interaction intelligence system** for jewellery retail stores using **100% open-source technologies**. The core objective is to prove that we can capture "what customers saw" without capturing "who they are."

**Key PoC Goals:**
- Validate zone-based customer detection
- Prove manual service initiation works at scale
- Demonstrate anonymous interaction tracking
- Test POS integration feasibility
- Measure salesperson adoption friction

**Duration:** 8-10 weeks  
**Budget:** Minimal (open-source only)  
**Team Size:** 2-3 developers + 1 QA

---

## PoC Objectives

### Primary Objectives
1. **Validate Core Workflow** - Prove that manual service initiation + barcode scanning creates usable interaction data
2. **Test Privacy Architecture** - Demonstrate that no personal data is required or stored
3. **Measure Performance** - Validate system handles 50+ customers/hour across 5 zones
4. **Prove Business Value** - Generate meaningful reports from 2 weeks of real store data

### Secondary Objectives
1. Test CCTV integration with IP cameras
2. Validate POS webhook integration
3. Test mobile app UX with real salespersons
4. Measure data storage & query performance

### Out of Scope for PoC
- Multi-store deployment
- Advanced analytics/ML
- Mobile app polish (functional UI only)
- High availability infrastructure
- Automated scaling

---

## Tech Stack Selection

### Core Principles
- **100% Open Source** - No proprietary licenses
- **Privacy-First** - No facial recognition libraries
- **Production-Ready** - Battle-tested technologies
- **Developer-Friendly** - Good documentation & community support
- **Cost-Effective** - Can run on modest hardware

---

### Selected Tech Stack

#### **1. Computer Vision & Image Processing**

| Component | Technology | Why Chosen |
|-----------|-----------|------------|
| **Camera Integration** | OpenCV (Python) | Industry standard, supports all IP camera protocols (RTSP/ONVIF) |
| **Person Detection** | YOLOv8 (Ultralytics) | Best open-source object detection, 60+ FPS on GPU, no facial recognition |
| **Image Processing** | Pillow (PIL) | Lightweight, fast image manipulation |

**Key Point:** YOLOv8 only detects "person" class - NO face recognition, NO biometric extraction.

---

#### **2. Backend Stack**

| Component | Technology | Why Chosen |
|-----------|-----------|------------|
| **API Framework** | FastAPI (Python) | Async support, auto-documentation, WebSocket support for real-time updates |
| **Task Queue** | Celery + Redis | Handle camera feeds asynchronously, reliable task processing |
| **Background Jobs** | APScheduler | Lightweight scheduler for cleanup jobs, retention policies |

---

#### **3. Database & Storage**

| Component | Technology | Why Chosen |
|-----------|-----------|------------|
| **Primary Database** | PostgreSQL 15+ | ACID compliance, JSON support, mature replication |
| **Image Storage** | MinIO (S3-compatible) | Self-hosted object storage, lifecycle policies, encryption at rest |
| **Cache Layer** | Redis 7+ | Fast session management, real-time customer list caching |
| **Time-Series Data** | TimescaleDB (Postgres extension) | Efficient time-based queries for interaction analytics |

---

#### **4. Frontend Stack**

| Component | Technology | Why Chosen |
|-----------|-----------|------------|
| **Salesperson Mobile App** | React Native (Expo) | Cross-platform (iOS/Android), fast development, hot reload |
| **Barcode Scanner** | expo-barcode-scanner | Native barcode/QR scanning, camera access |
| **State Management** | Zustand | Lightweight, simple, perfect for PoC |
| **API Client** | Axios + React Query | Caching, auto-retry, optimistic updates |

---

#### **5. Admin Dashboard**

| Component | Technology | Why Chosen |
|-----------|-----------|------------|
| **Framework** | Next.js 14 (App Router) | Server components, API routes, easy deployment |
| **UI Library** | shadcn/ui + Tailwind CSS | Beautiful components, fully customizable, accessible |
| **Charts** | Recharts | Declarative charts, responsive, no license restrictions |
| **Tables** | TanStack Table | Powerful data tables, sorting, filtering |

---

#### **6. Infrastructure**

| Component | Technology | Why Chosen |
|-----------|-----------|------------|
| **Containerization** | Docker + Docker Compose | Easy deployment, environment consistency |
| **Reverse Proxy** | Nginx | Load balancing, SSL termination, static file serving |
| **Process Manager** | Systemd | Reliable service management on Linux |
| **Monitoring** | Prometheus + Grafana | Open-source observability stack |

---

#### **7. Security & Privacy**

| Component | Technology | Why Chosen |
|-----------|-----------|------------|
| **API Authentication** | JWT (PyJWT) | Stateless auth, role-based access control |
| **Image Encryption** | AES-256 (cryptography.py) | Encrypt images at rest in MinIO |
| **Data Anonymization** | Custom middleware | Strip metadata, add random IDs, enforce retention |
| **API Rate Limiting** | slowapi | Prevent abuse, DoS protection |

---

### Complete Tech Stack Summary

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                            │
├─────────────────────────────────────────────────────────────┤
│  Salesperson App          │  Admin Dashboard                │
│  - React Native (Expo)    │  - Next.js 14                   │
│  - Zustand                │  - shadcn/ui + Tailwind         │
│  - React Query            │  - Recharts, TanStack Table     │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS / WebSocket
                            │
┌─────────────────────────────────────────────────────────────┐
│                     API LAYER                               │
├─────────────────────────────────────────────────────────────┤
│  Nginx (Reverse Proxy + SSL)                                │
│  FastAPI (REST + WebSocket)                                 │
│  - JWT Authentication                                       │
│  - Rate Limiting (slowapi)                                  │
│  - Data Validation (Pydantic)                               │
└─────────────────────────────────────────────────────────────┘
                            │
              ┌─────────────┼─────────────┐
              │             │             │
┌─────────────▼──┐  ┌──────▼──────┐  ┌──▼─────────────┐
│  PostgreSQL    │  │   Redis     │  │   MinIO        │
│  (+ TimescaleDB)│  │   Cache     │  │   (Images)     │
│  - Interactions│  │   Sessions  │  │   - Encrypted  │
│  - Analytics   │  │   - Lists   │  │   - Lifecycle  │
└────────────────┘  └─────────────┘  └────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                  PROCESSING LAYER                           │
├─────────────────────────────────────────────────────────────┤
│  Celery Workers (Async Tasks)                               │
│  - Camera Feed Processing (YOLOv8)                          │
│  - Image Cleanup (Retention Policy)                         │
│  - Report Generation                                        │
│                                                             │
│  APScheduler (Background Jobs)                              │
│  - Daily cleanup, metrics aggregation                       │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                  CAMERA LAYER                               │
├─────────────────────────────────────────────────────────────┤
│  OpenCV (RTSP/ONVIF Integration)                            │
│  YOLOv8 (Person Detection Only)                             │
│  - NO facial recognition                                    │
│  - NO biometric extraction                                  │
└─────────────────────────────────────────────────────────────┘
                            │
                    CCTV Cameras (IP)
```

---

## System Architecture

### High-Level Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                         STORE FLOOR                              │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐            │
│  │ Camera1 │  │ Camera2 │  │ Camera3 │  │ Camera4 │            │
│  │ (Zone A)│  │ (Zone A)│  │ (Zone B)│  │ (Zone C)│            │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘            │
│       │            │            │            │                   │
│       └────────────┴────────────┴────────────┘                   │
│                           │                                      │
│                    RTSP/ONVIF Streams                            │
└──────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│               CAMERA PROCESSING SERVICE (Celery)                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  1. Receive RTSP stream                                  │   │
│  │  2. Run YOLOv8 person detection (1 FPS sampling)         │   │
│  │  3. Extract clean person crop when entering zone         │   │
│  │  4. Generate anonymous customer_id (UUID)                │   │
│  │  5. Store image in MinIO (encrypted)                     │   │
│  │  6. Create record in PostgreSQL                          │   │
│  │  7. Push to Redis cache (zone-filtered list)             │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│                    DATA LAYER                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ PostgreSQL   │  │   Redis      │  │   MinIO      │          │
│  │              │  │              │  │              │          │
│  │ Tables:      │  │ Keys:        │  │ Buckets:     │          │
│  │ - zones      │  │ - zone:A     │  │ - customers  │          │
│  │ - customers  │  │ - zone:B     │  │ - retention  │          │
│  │ - sessions   │  │ - session:*  │  │   (7 days)   │          │
│  │ - scans      │  │              │  │              │          │
│  │ - purchases  │  │              │  │              │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└──────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│                     API LAYER (FastAPI)                          │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  REST Endpoints:                                       │     │
│  │  - POST /api/sessions/start                            │     │
│  │  - POST /api/sessions/{id}/scan                        │     │
│  │  - POST /api/sessions/{id}/end                         │     │
│  │  - GET  /api/customers?zone={zone}                     │     │
│  │                                                         │     │
│  │  WebSocket:                                            │     │
│  │  - /ws/zone/{zone}/customers (real-time updates)       │     │
│  │                                                         │     │
│  │  POS Webhook:                                          │     │
│  │  - POST /api/webhooks/pos/purchase                     │     │
│  └────────────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
                ▼                       ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│  SALESPERSON MOBILE APP  │  │   ADMIN DASHBOARD        │
│  (React Native)          │  │   (Next.js)              │
│                          │  │                          │
│  Screens:                │  │  Screens:                │
│  1. Zone Selection       │  │  1. Zone Management      │
│  2. Customer List        │  │  2. Real-time Monitor    │
│  3. Start Service        │  │  3. Reports              │
│  4. Scan Jewellery       │  │  4. Salesperson Mgmt     │
│  5. Session Summary      │  │  5. System Settings      │
└──────────────────────────┘  └──────────────────────────┘
```

---

## Data Flow & Storage Strategy

### Flow 1: Customer Entry Detection

```
CCTV Camera (Zone A)
      │
      ▼
OpenCV captures frame (1 FPS)
      │
      ▼
YOLOv8 detects "person" (confidence > 0.7)
      │
      ▼
Extract person bounding box crop
      │
      ▼
Check: New entry? (not seen in last 30 sec)
      │
      ├─ YES ──▶ Generate UUID (customer_id)
      │          │
      │          ▼
      │     Encrypt & store image (MinIO)
      │          │
      │          ▼
      │     Create record (PostgreSQL)
      │          │
      │          ▼
      │     Push to Redis (zone:A list)
      │          │
      │          ▼
      │     WebSocket broadcast (real-time)
      │
      └─ NO ───▶ Skip (already tracked)
```

---

### Flow 2: Service Session Lifecycle

```
Salesperson opens app
      │
      ▼
Select assigned zone (Zone A)
      │
      ▼
View customer list (from Redis zone:A)
      │
      ▼
Tap "Start Service" on Customer Image
      │
      ▼
POST /api/sessions/start
{
  customer_id: "uuid-123",
  salesperson_id: "emp-456",
  zone_id: "zone-A"
}
      │
      ▼
Session created (PostgreSQL)
      │
      ▼
Scan jewellery barcodes
      │
      ▼
POST /api/sessions/{session_id}/scan
{
  barcode: "JWL-12345",
  timestamp: "2025-01-15T10:30:00Z"
}
      │
      ▼
Scan recorded (jewellery_seen)
      │
      ▼
[Customer makes purchase at POS]
      │
      ▼
POS sends webhook
POST /api/webhooks/pos/purchase
{
  barcode: "JWL-12345",
  amount: 50000,
  timestamp: "2025-01-15T10:45:00Z"
}
      │
      ▼
System matches to active session
      │
      ▼
Link purchase to session (jewellery_purchased)
      │
      ▼
Tap "End Service"
      │
      ▼
POST /api/sessions/{session_id}/end
      │
      ▼
Session marked complete (calculate duration)
```

---

### Database Schema (PostgreSQL)

```sql
-- Zones Configuration
CREATE TABLE zones (
  zone_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_name VARCHAR(100) NOT NULL,
  floor_number INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Zone-Camera Mapping
CREATE TABLE zone_cameras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_id UUID REFERENCES zones(zone_id),
  camera_id VARCHAR(50) NOT NULL,
  camera_url VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE
);

-- Anonymous Customers (NO PERSONAL DATA)
CREATE TABLE customers (
  customer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_id UUID REFERENCES zones(zone_id),
  image_path VARCHAR(255) NOT NULL,
  detected_at TIMESTAMP NOT NULL,
  expires_at TIMESTAMP NOT NULL, -- 7 days retention
  is_active BOOLEAN DEFAULT TRUE
);

-- Salespersons
CREATE TABLE salespersons (
  salesperson_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE
);

-- Salesperson Zone Assignment
CREATE TABLE salesperson_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salesperson_id UUID REFERENCES salespersons(salesperson_id),
  zone_id UUID REFERENCES zones(zone_id),
  assigned_at TIMESTAMP DEFAULT NOW()
);

-- Service Sessions
CREATE TABLE sessions (
  session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(customer_id),
  salesperson_id UUID REFERENCES salespersons(salesperson_id),
  zone_id UUID REFERENCES zones(zone_id),
  started_at TIMESTAMP NOT NULL,
  ended_at TIMESTAMP,
  duration_minutes INT,
  status VARCHAR(20) DEFAULT 'active' -- active, completed
);

-- Jewellery Items Shown
CREATE TABLE jewellery_scans (
  scan_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(session_id),
  jewellery_barcode VARCHAR(100) NOT NULL,
  scanned_at TIMESTAMP NOT NULL,
  jewellery_name VARCHAR(255),
  jewellery_category VARCHAR(50),
  jewellery_price DECIMAL(10, 2)
);

-- Jewellery Items Purchased (from POS)
CREATE TABLE purchases (
  purchase_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(session_id),
  jewellery_barcode VARCHAR(100) NOT NULL,
  purchase_amount DECIMAL(10, 2) NOT NULL,
  purchased_at TIMESTAMP NOT NULL,
  pos_transaction_id VARCHAR(100)
);

-- Indexes for Performance
CREATE INDEX idx_customers_zone ON customers(zone_id);
CREATE INDEX idx_customers_detected ON customers(detected_at DESC);
CREATE INDEX idx_sessions_customer ON sessions(customer_id);
CREATE INDEX idx_sessions_salesperson ON sessions(salesperson_id);
CREATE INDEX idx_scans_session ON jewellery_scans(session_id);
CREATE INDEX idx_purchases_session ON purchases(session_id);

-- TimescaleDB: Convert customers table to hypertable for time-series
SELECT create_hypertable('customers', 'detected_at');
```

---

### Redis Cache Structure

```redis
# Zone-based customer lists (expire in 5 min)
zone:A:customers → LIST [customer_id_1, customer_id_2, ...]
zone:B:customers → LIST [...]

# Active sessions (quick lookup)
session:{session_id} → HASH {
  customer_id,
  salesperson_id,
  zone_id,
  started_at,
  status
}

# Salesperson zone assignments (persist for shift)
salesperson:{salesperson_id}:zones → SET [zone_A, zone_B]
```

---

### MinIO Storage Structure

```
Bucket: customer-images
├── 2025/
│   ├── 01/
│   │   ├── 15/
│   │   │   ├── {customer_id}_encrypted.jpg
│   │   │   ├── {customer_id}_encrypted.jpg
│   │   │   └── ...
│   │   └── 16/
│   └── 02/
└── lifecycle-policy.json (auto-delete after 7 days)
```

**Encryption:** AES-256 encryption at rest using MinIO server-side encryption.

---

## Privacy & Compliance Architecture

### Privacy-First Design Principles

#### 1. **No Biometric Data Collection**
```python
# What YOLOv8 does (ALLOWED)
person_bbox = yolo.detect(frame, classes=['person'])
person_crop = frame[bbox.y1:bbox.y2, bbox.x1:bbox.x2]

# What we DON'T do (FORBIDDEN)
# face_embedding = face_recognition.encode(person_crop)  ❌
# identity_match = match_to_database(face_embedding)     ❌
```

#### 2. **Anonymous ID Generation**
```python
import uuid

# System-generated, non-reversible ID
customer_id = str(uuid.uuid4())
# Example: "7c9e6679-7425-40de-944b-e07fc1f90ae7"

# NO connection to real identity
# NO name, phone, email stored
```

#### 3. **Data Retention Policy**
```python
# Automatic cleanup after 7 days
expires_at = detected_at + timedelta(days=7)

# Celery periodic task
@celery.task
def cleanup_expired_customers():
    expired = Customer.objects.filter(
        expires_at__lt=datetime.now()
    )
    for customer in expired:
        # Delete image from MinIO
        minio.remove_object('customer-images', customer.image_path)
        # Delete database record
        customer.delete()
```

#### 4. **Image Encryption at Rest**
```python
from cryptography.fernet import Fernet

# Encrypt before storing in MinIO
key = Fernet.generate_key()
cipher = Fernet(key)
encrypted_image = cipher.encrypt(image_bytes)

# Decrypt only when salesperson views
decrypted_image = cipher.decrypt(encrypted_image)
```

#### 5. **Access Control**
```python
# Salesperson can only see customers in THEIR assigned zones
@app.get("/api/customers")
def get_customers(zone_id: str, salesperson_id: str):
    # Verify salesperson is assigned to this zone
    if not has_zone_access(salesperson_id, zone_id):
        raise HTTPException(403, "Access denied")
    
    # Return only zone-filtered customers
    return get_customers_by_zone(zone_id)
```

---

### Compliance Checklist

| Requirement | Implementation | Status |
|-------------|----------------|---------|
| No personal data stored | UUID-only customer tracking | ✅ |
| No face recognition | YOLOv8 person detection only | ✅ |
| No biometric templates | No facial embeddings stored | ✅ |
| Image encryption | AES-256 at rest in MinIO | ✅ |
| Data retention limit | Auto-delete after 7 days | ✅ |
| Access control | Zone-based RBAC | ✅ |
| Audit logging | All API calls logged | ✅ |
| No cross-store tracking | Single store instance | ✅ |
| No external identity | No ID verification required | ✅ |
| Customer consent | In-store signage (legal requirement) | 📋 |

---

## PoC Implementation Phases

### Phase 1: Foundation (Week 1-2)

**Goal:** Setup infrastructure and basic camera integration

**Tasks:**
1. Setup Docker Compose stack (Postgres, Redis, MinIO, Nginx)
2. Create database schema with migrations (Alembic)
3. Setup FastAPI project structure
4. Integrate OpenCV with test CCTV camera (RTSP)
5. Implement YOLOv8 person detection pipeline
6. Test image capture and storage in MinIO
7. Create basic authentication (JWT)

**Deliverable:** Working camera detection system storing anonymous images

**Success Criteria:**
- Camera feed processed at 1 FPS
- Person detection accuracy > 85%
- Images stored with <2 sec latency

---

### Phase 2: Core Workflow (Week 3-4)

**Goal:** Build salesperson mobile app and session management

**Tasks:**
1. Create React Native app with Expo
2. Implement zone selection UI
3. Build customer list with real-time updates (WebSocket)
4. Create "Start Service" flow
5. Integrate barcode scanner (expo-barcode-scanner)
6. Implement session lifecycle API (start/scan/end)
7. Build Redis caching for zone-filtered lists

**Deliverable:** Functional mobile app for salespersons

**Success Criteria:**
- App loads customer list in <1 sec
- Barcode scan registers in <500ms
- Real-time updates work without refresh

---

### Phase 3: POS Integration (Week 5)

**Goal:** Auto-link purchases from POS system

**Tasks:**
1. Design POS webhook contract
2. Create webhook endpoint in FastAPI
3. Implement session-purchase matching logic
4. Test with mock POS data
5. Build purchase linking algorithm (handle edge cases)

**Deliverable:** Automated purchase tracking

**Success Criteria:**
- 100% of purchases linked to correct session (if active)
- Handle multiple concurrent sessions

---

### Phase 4: Admin Dashboard (Week 6-7)

**Goal:** Build reporting and zone management UI

**Tasks:**
1. Create Next.js admin dashboard
2. Implement zone management (CRUD)
3. Build salesperson management
4. Create Report #1: Jewellery Interest vs Purchase
5. Create Report #2: Salesperson Performance
6. Create Report #3: Zone Performance
7. Add CSV export functionality

**Deliverable:** Admin dashboard with 3 core reports

**Success Criteria:**
- Reports load in <3 seconds
- Filters work correctly
- CSV export generates valid files

---

### Phase 5: Testing & Refinement (Week 8-9)

**Goal:** Real-world testing with actual store data

**Tasks:**
1. Deploy system in test store location
2. Train 3-5 salespersons on mobile app
3. Collect 2 weeks of interaction data
4. Analyze UX friction points
5. Fix bugs and optimize performance
6. Test privacy compliance (audit)
7. Measure system performance under load

**Deliverable:** Production-ready PoC

**Success Criteria:**
- 90%+ salesperson adoption
- <5% error rate in session creation
- Zero personal data leaks
- System uptime > 99%

---

### Phase 6: Documentation & Handoff (Week 10)

**Goal:** Prepare for production deployment

**Tasks:**
1. Write deployment documentation
2. Create operations runbook
3. Document API specifications (OpenAPI)
4. Create user training materials
5. Prepare cost analysis for scale
6. Write executive summary report

**Deliverable:** Complete documentation package

---

## Success Metrics

### Technical Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Camera processing latency | <2 sec | Time from detection to DB insert |
| Customer list load time | <1 sec | Mobile app API response time |
| Barcode scan response | <500ms | Scan to confirmation time |
| Report generation time | <3 sec | Dashboard query execution |
| System uptime | >99% | Daily monitoring |
| False detection rate | <10% | Manual audit of 100 samples |

### Business Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Salesperson adoption | >90% | Daily active users / total staff |
| Session completion rate | >95% | Sessions ended / sessions started |
| Data capture accuracy | >98% | Verified scans / total scans |
| Report usage frequency | 3x/week | Admin dashboard logins |

### Privacy Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Personal data incidents | 0 | Security audit |
| Image retention violations | 0 | Automated compliance check |
| Unauthorized access attempts | 0 | Access log review |

---

## Risk Mitigation

### Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Camera integration issues | Medium | High | Test with 3 different IP camera brands early |
| YOLOv8 performance on CPU | High | Medium | Provide GPU recommendation, optimize for batch processing |
| Network latency issues | Medium | Medium | Implement local Redis cache, WebSocket fallback |
| POS integration complexity | High | High | Design flexible webhook, build mock POS for testing |
| Mobile app crashes | Medium | High | Extensive error handling, offline mode support |

### Privacy Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Accidental PII storage | Low | Critical | Code review checklist, automated scanning |
| Image retention violation | Low | High | Automated cleanup job, monitoring alerts |
| Unauthorized data access | Low | High | RBAC, audit logging, regular security reviews |

### Adoption Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Salesperson resistance | High | High | Early user testing, gather feedback, iterate UX |
| Too much friction | Medium | High | Optimize workflow, minimize taps, add shortcuts |
| Training complexity | Medium | Medium | Create video tutorials, in-person training sessions |

---

## Next Steps

### Immediate Actions (Week 1)

1. **Procurement:**
   - [ ] Setup Linux server (Ubuntu 22.04) or cloud VM (4 CPU, 16GB RAM, 100GB SSD)
   - [ ] Procure 1-2 test IP cameras (ONVIF compatible)
   - [ ] Get test mobile devices (1 Android, 1 iOS)

2. **Environment Setup:**
   - [ ] Install Docker + Docker Compose
   - [ ] Clone starter boilerplate repositories
   - [ ] Setup GitHub repository with branching strategy
   - [ ] Configure development environments

3. **Team Alignment:**
   - [ ] Kick-off meeting with dev team
   - [ ] Assign roles (backend, frontend, camera integration)
   - [ ] Setup daily standup schedule
   - [ ] Create project tracking board (GitHub Projects/Jira)

### Decision Points

**Week 4 Review:** Decide if core workflow is validated → Proceed to Phase 3  
**Week 7 Review:** Decide if reporting is sufficient → Proceed to field testing  
**Week 9 Review:** Go/No-Go decision for production deployment

---

## Appendix: Quick Start Commands

### Docker Compose Stack

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: timescale/timescaledb:latest-pg15
    environment:
      POSTGRES_DB: jewellery_intel
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: changeme
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  minio:
    image: minio/minio:latest
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: changeme
    volumes:
      - minio_data:/data
    ports:
      - "9000:9000"
      - "9001:9001"

  api:
    build: ./backend
    environment:
      DATABASE_URL: postgresql://admin:changeme@postgres:5432/jewellery_intel
      REDIS_URL: redis://redis:6379
      MINIO_ENDPOINT: minio:9000
    ports:
      - "8000:8000"
    depends_on:
      - postgres
      - redis
      - minio

  celery:
    build: ./backend
    command: celery -A app.celery worker --loglevel=info
    depends_on:
      - redis
      - postgres

volumes:
  postgres_data:
  minio_data:
```

### Start System

```bash
# Clone repository
git clone <repo-url>
cd jewellery-retail-intelligence

# Start all services
docker-compose up -d

# Check logs
docker-compose logs -f api

# Run database migrations
docker-compose exec api alembic upgrade head

# Create admin user
docker-compose exec api python scripts/create_admin.py
```

---

## Contact & Support

**Project Lead:** [Your Name]  
**Technical Lead:** [Tech Lead Name]  
**Repository:** `<github-repo-url>`  
**Documentation:** `<wiki-url>`

---

**Document Version:** 1.0  
**Last Updated:** 2025-01-15  
**Next Review:** Week 4 (End of Phase 2)
