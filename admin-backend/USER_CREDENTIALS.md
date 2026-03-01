# User Credentials from Remote Database

## Available Users for Login

The following users are available in the remote database (`10.100.21.222`):

| ID | Username | Password | Role | Full Name | Status |
|----|----------|----------|------|-----------|--------|
| 4 | user_4 | newpassword123 | salesman | EMP002 | Active |
| 10 | vishwa | password | salesman | Vishwa | Active |
| 11 | marimuthu | password1 | salesman | Marimuthu | Active |
| 12 | user_12 | password | salesman | Ram | Active |
| 13 | karthi | password | salesman | Karthi | Active |
| 15 | david | password | salesman | David | Active |

## How to Login

1. Start the backend server:
   ```bash
   cd backend
   python main.py
   ```

2. Start the frontend:
   ```bash
   cd admin-portal
   npm run dev
   ```

3. Navigate to the login page and use any of the credentials above.

## API Endpoints

- **POST `/login/`** - Login with username and password
- **GET `/users/credentials/`** - Get all users with their credentials (for admin purposes)

## Notes

- All passwords are stored as plaintext in the `password_hash` column
- All users are currently active
- All users have the role "salesman"
