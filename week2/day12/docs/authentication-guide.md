# Authentication & Authorization Guide

## Authentication
- JWT Authentication
- Access Token
- Refresh Token
- Password Hashing using bcrypt

## Authorization
- Role-Based Access Control (RBAC)
- User Role
- Admin Role
- Protected Routes

## APIs Implemented

### POST /api/auth/register
Registers a new user.

### POST /api/auth/login
Authenticates a user.

### POST /api/auth/refresh
Generates a new access token.

### GET /api/auth/profile
Returns logged-in user's profile.

### PUT /api/auth/change-password
Changes user password.

### POST /api/auth/logout
Logs out the user.

### GET /api/auth/admin
Admin-only protected route.

## Security Features
- Password hashing with bcrypt
- JWT authentication
- Refresh token support
- Role-based authorization
- Password validation

## Testing Completed
- Register ✔
- Login ✔
- Profile ✔
- Change Password ✔
- Refresh Token ✔
- Logout ✔
- RBAC ✔