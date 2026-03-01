# How to Run the Dual Portal System

This project is now split into two independent portals sharing a single database.

## 1. Prerequisites
Ensure you have the remote database running on the other laptop at `10.100.101.152`.

## 2. Start the Admin Portal
The Admin portal is used for configuration and viewing analytics.

### Backend
1. Open a terminal in `admin-portal/backend`
2. Run: `uvicorn app.main:app --host 0.0.0.0 --port 8001`

### Frontend
1. Open a terminal in `admin-portal/frontend`
2. Run: `npm run dev -- --port 5174`

---

## 3. Start the Salesperson Portal
The Salesperson portal is used for real-time customer service.

### Backend
1. Open a terminal in `salesperson-portal/backend`
2. Run: `uvicorn app.main:app --host 0.0.0.0 --port 8000`

### Frontend
1. Open a terminal in `salesperson-portal/frontend`
2. Run: `npm run dev -- --port 5173`

---

## 4. Access Links
- **Admin Dashboard:** [http://localhost:5175](http://localhost:5175)
- **Salesperson App:** [http://localhost:5176](http://localhost:5176)
