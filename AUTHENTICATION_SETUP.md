# Authentication System - Setup & Usage Guide

## Overview
A complete authentication system has been implemented for the Ops Bookmark POC with:
- Login page with username/password form
- Database-backed credential validation
- Session management via httpOnly cookies
- Protected routes (dashboard only accessible when logged in)
- Logout functionality
- Admin user seeding

## Quick Start

### 1. Initialize Database & Seed Admin User
```bash
curl -X POST http://localhost:3000/api/auth/seed
```

Response:
```json
{
  "message": "Admin user created successfully",
  "user": {
    "id": 1,
    "username": "admin",
    "role": "Admin"
  }
}
```

### 2. Login
Navigate to `http://localhost:3000/signin` and enter:
- Username: `admin`
- Password: `admin`

### 3. Access Dashboard
After successful login, you'll be redirected to `/dashboard` where you can:
- View your username and role
- Add bookmarks
- Manage bookmarks
- Click "Logout" to end session

## File Structure

### Frontend Pages
- **app/page.tsx** - Home page (redirects to signin)
- **app/signin/page.tsx** - Login page with form
- **app/signup/page.tsx** - Account creation page
- **app/dashboard/page.tsx** - Protected bookmark dashboard

### API Routes
- **app/api/auth/signin/route.ts** - POST /api/auth/signin (validates credentials)
- **app/api/auth/signup/route.ts** - POST /api/auth/signup (creates new user)
- **app/api/auth/logout/route.ts** - POST /api/auth/logout (clears session)
- **app/api/auth/check/route.ts** - GET /api/auth/check (verifies authentication)
- **app/api/auth/seed/route.ts** - POST /api/auth/seed (initializes admin user)

### Database Layer
- **lib/db.ts** - PostgreSQL utilities with functions:
  - `initializeDatabase()` - Creates users table
  - `createUser()` - Inserts new user
  - `getUserByUsername()` - Retrieves user by username
  - `verifyCredentials()` - Validates username/password
  - `seedAdminUser()` - Creates admin user (idempotent)

## Database Schema

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Environment Variables Required

```
DATABASE_URL=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=postgres
```

## User Flow

### Login Flow
1. User visits `/signin`
2. Enters username and password
3. System validates against database
4. On success: httpOnly cookie set, redirect to `/dashboard`
5. On failure: error message displayed

### Protected Routes
- `/dashboard` - Checks authentication cookie
- If not authenticated: redirects to `/signin`
- If authenticated: displays dashboard with user info

### Logout Flow
1. User clicks "Logout" button on dashboard
2. Authentication cookie cleared
3. Redirected to `/signin`

## Security Features

- **httpOnly Cookies** - Prevents XSS access to auth tokens
- **Secure Flag** - Set in production environment
- **SameSite=lax** - Prevents CSRF attacks
- **Session Expiry** - 7 days (configurable)
- **Plain Text Passwords** - For POC only (use bcrypt in production)

## Testing the System

### Test Login with Admin Credentials
```bash
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'
```

### Test Invalid Credentials
```bash
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"wrong"}'
```

### Test Protected Route
```bash
curl http://localhost:3000/api/auth/check
```

### Create New User
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"newuser","password":"password123","role":"User"}'
```

## Success Criteria Met

✓ Login page with username/password form
✓ Database validation of credentials
✓ Session handling via httpOnly cookies
✓ Protected routes (dashboard requires login)
✓ Logout functionality
✓ Admin user seeding (username: admin, password: admin)
✓ Error messages for invalid credentials
✓ User info displayed on dashboard
✓ Redirect to login for unauthenticated users

## Future Enhancements

- Password hashing (bcrypt)
- JWT-based authentication
- Role-based access control
- Session expiry handling
- Password reset flow
- Multi-user support
- OAuth/SSO integration
