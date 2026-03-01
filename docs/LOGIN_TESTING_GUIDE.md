# Login Testing Guide

## How the Login Flow Works

1. **User enters credentials** on the login page (`/login`)
2. **Form submission** triggers `handleLogin` function
3. **AuthContext** sends POST request to `http://localhost:8000/login/`
4. **Backend** queries remote database (`10.100.21.222`) for the user
5. **Backend validates** username and password
6. **On success**: User data is stored in localStorage and user is redirected to dashboard (`/`)
7. **On failure**: Error message is displayed on the login page

## Available Test Credentials

From the remote database, you can use any of these:

C:\Users\kanimozhi.a\Downloads\Adminpage\admin-portal
## Testing Steps

### 1. Start the Backend Server
```bash
cd backend
python main.py
```
You should see: `Uvicorn running on http://127.0.0.1:8000`

### 2. Start the Frontend
```bash
cd admin-portal
npm run dev
```
You should see the app running on `http://localhost:5173` (or similar)

### 3. Test Login
1. Navigate to `http://localhost:5173/login`
2. Enter a username (e.g., `vishwa`)
3. Enter the corresponding password (e.g., `password`)
4. Click "Sign In"
5. You should be redirected to the dashboard if credentials are correct

## Troubleshooting

### If login fails:

1. **Check Backend Console**: Look for error messages
   - "User not found" = Username doesn't exist
   - "Password mismatch" = Wrong password
   - "User account is inactive" = User is disabled

2. **Check Frontend Console** (Browser DevTools):
   - Network errors = Backend not running or CORS issue
   - 401 errors = Invalid credentials
   - 500 errors = Server error

3. **Verify Database Connection**:
   ```bash
   cd backend
   python get_users_from_remote_db.py
   ```
   This will show all available users.

4. **Check CORS**: Make sure backend allows requests from frontend origin

## Login Flow Diagram

```
User Input (Login Page)
    ↓
handleLogin() - validates input
    ↓
login() in AuthContext - sends API request
    ↓
POST /login/ (Backend)
    ↓
Query Remote Database (10.100.21.222)
    ↓
Validate Credentials
    ↓
Success → Store user data → Redirect to Dashboard
Failure → Show error message
```

## Code Files Involved

- **Frontend Login Page**: `admin-portal/src/pages/Login.jsx`
- **Auth Context**: `admin-portal/src/context/AuthContext.jsx`
- **Backend Login Endpoint**: `backend/main.py` (line 156)
- **Database Query**: `backend/crud.py` (`get_user_by_username`)
- **Protected Routes**: `admin-portal/src/App.jsx`
