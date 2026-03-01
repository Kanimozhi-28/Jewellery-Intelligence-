# Admin Portal – Frontend-Only MVP Prompt (For Anti-Gravity)

## Purpose

This prompt is ONLY for building the **Admin Portal** of the Jewellery Retail Interaction Intelligence system using **frontend-only logic** and **dummy data**. No salesman mobile app is included.

---

## STRICT RULES

* ❌ Do NOT build or assume any backend

* ❌ Do NOT connect to any database (PostgreSQL, MongoDB, etc.)

* ❌ Do NOT integrate real CCTV, POS, or authentication services

* ❌ Do NOT add server-side logic

* ✅ Use dummy / mock data only

* ✅ Frontend-only implementation

* ✅ Static or simulated data sources

---

## TECH STACK ASSUMPTION

* Framework: React (Web)
* Styling: Tailwind CSS / Material UI
* Charts: Chart.js / Recharts
* State Management: React Context / Local State
* Storage: Local JSON files or LocalStorage

---

## DUMMY DATA STRATEGY

Use mock data from:

* jewellery.json
* customers.json
* sessions.json
* salespersons.json

OR

* Hardcoded arrays managed in frontend state

No real API calls.

---

## ADMIN PORTAL PAGES TO BUILD

### 1. Login Page

* Simple admin login UI (dummy credentials)
* No real authentication

---

### 2. Main Dashboard

Show KPI cards using dummy data:

* Total Customers (Today / Week)
* Total Sales Amount
* Average Time per Customer
* Attended vs Unattended %

Charts (mock data only):

* Line chart: Customers over time
* Bar chart: Sales per salesperson
* Pie chart: Floor-wise traffic
* Heatmap-style chart: Peak hours

Charts must be clearly visible and use theme variables.

---

### 3. Salesmen Management

* Table listing salespersons (dummy data)
* Columns: Name, Role, Assigned Zone, Status
* UI-only Add / Edit / Deactivate buttons (no backend)
* Detail view with dummy performance metrics

---

### 4. Customers Section

* Table of anonymous customers (dummy data)
* Columns: Customer ID, Photo thumbnail, First seen, Last seen, Visits, Time spent
* Filters: Date range, Floor (UI-only)
* Customer detail view with session history

---

### 5. Jewellery Intelligence Section

* Jewellery performance table (dummy data)

* Columns:

  * Item Identity
  * Interacted
  * Sold
  * Conversion
  * Actions

* Comments section:

  * Table with columns: Time, Customer ID, Comments
  * Even spacing between columns
  * Comments table appears LAST in the item section

---

### 6. Lost Opportunities Page

* List items with high views and low conversion (dummy data)

* Show:

  * Item name
  * Category
  * Value
  * Times shown
  * Times sold
  * Dominant feedback

* "Analyze Drilldown" button (UI-only)

---

### 7. Reports & Analytics

* Sales trends (daily / weekly / monthly)
* Customer interactions per floor
* Unattended customers report

Export buttons (CSV / PDF) – UI-only

---

### 8. Settings & Audit Logs

* Store settings UI (floors, zones, cameras)
* Audit log table using dummy events

---

## UI / UX REQUIREMENTS

* Desktop & tablet responsive layouts
* Sidebar navigation
* Light / Dark mode toggle
* Clean tables with proper spacing
* Professional admin-dashboard look

Use ONLY existing theme variables.
Do NOT hardcode colors.

---

## IMPORTANT NOTE (FOR REVIEW / VIVA)

This Admin Portal is a **frontend-only MVP** built using **dummy data** to demonstrate analytics, dashboards, and business intelligence.

Backend and database integration are intentionally abstracted and can be added later.

---

## FINAL INSTRUCTION TO ANTI-GRAVITY

> Build ONLY the Admin Portal UI and flow as described above using frontend logic and dummy data. Do not add or assume any backend services.

---

## END OF PROMPT
