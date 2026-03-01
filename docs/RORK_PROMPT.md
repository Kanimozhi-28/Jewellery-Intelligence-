# Rork Master Prompt

**Copy and paste the text below into Rork. Make sure to replace `YOUR_PC_IP_ADDRESS` with your actual IP address first (e.g. 192.168.1.5).**

***

I want you to build a **Native Mobile Application** for a Salesperson Portal using **React Native** and **Expo**. 

**CRITICAL RULE**: Do NOT create a backend. You must connect to an **EXISTING** Python FastAPI backend running at `http://10.100.100.142:8000`.

### **1. App Configuration**
*   **Framework**: React Native with Expo Router.
*   **Data Fetching**: Use `axios`.
*   **State Management**: Use `zustand`.
*   **Icons**: Use `lucide-react-native`.
*   **Theme**: "Premium Utility" - Background `#F8F9FA`, Primary `#1E3A8A` (Deep Blue), Accent `#D97706` (Gold).

### **2. Global State Store (Zustand)**
Create a store `useJewelleryStore` with:
*   `salespersonId`: default "EMP001" (string).
*   `currentZone`: default "A" (string).
*   `sessionId`: default null (string | null).
*   `setZone(zone)`: function.
*   `setSessionId(id)`: function.

### **3. Screens & Navigation (Bottom Tabs)**

#### **Tab 1: Zone Monitor (Home)**
*   **Header**: Title "Live Floor Monitor".
*   **Zone Selector**: 3 Buttons [Zone A] [Zone B] [Zone C] at the top. Updates `currentZone` in store.
*   **Content**: A list of "Customer Cards" fetched from API.
*   **API Logic**:
    *   Poll `GET /api/operational/live-customers/{currentZone}` every 3 seconds.
    *   Response is `[{ "id": "...", "detected_at": "...", "photo": "base64..." }]`.
*   **Card UI**:
    *   Show the `photo` (Base64 image).
    *   Show "Customer #{last 4 chars of ID}".
    *   Show Time (e.g. "10:30 AM").
    *   **Action Button**: "Attend Customer".
*   **Button Logic**:
    *   On press, call `POST /api/operational/sessions/start`.
    *   Body: `{ "customer_id": customer.id, "salesperson_id": store.salespersonId }`.
    *   On success, save `session_id` to store and navigate to "Active Session" tab.

#### **Tab 2: Active Session**
*   **Logic**: If `sessionId` is null, show a message "No active customer. Select one from Zone Monitor."
*   **Header**: "Serving Customer".
*   **Main Feature**: "Scan Product" Section.
    *   Input field: "Enter Barcode" (e.g. JWL-999).
    *   Button: "Add Item".
    *   API: `POST /api/operational/scan-jewellery` with `{ "session_id": store.sessionId, "jewellery_code": input_value }`.
*   **List**: "Items Shown".
    *   Fetch `GET /api/operational/sessions/{sessionId}/scans`.
    *   Display list of items (Name, Price).
*   **Footer**: "End Session" Button (Red).
    *   API: `POST /api/operational/sessions/end/{sessionId}`.
    *   On success, set `sessionId` to null and go back to Home.

#### **Tab 3: My Performance**
*   **Header**: "Daily stats".
*   **Data**: Fetch `GET /api/operational/salesperson-stats/{store.salespersonId}`.
*   **UI**: 
    *   Simple Grid showing:
        *   "Customers": `customers_attended`
        *   "Products Shown": `items_shown`
        *   "Potential Revenue": `total_revenue_potential`
