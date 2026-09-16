# Authentication & RBAC Guide

## 1. Authentication Methods

### JWT Authentication

JWT is used to securely authenticate users.

The application uses:

- Access tokens for API authentication
- Refresh tokens to obtain new access tokens
- Token expiration for security
- Password hashing using bcrypt

The access token contains:

- User ID
- Email
- Role

Clients send the access token using:

`Authorization: Bearer <token>`

### OAuth2 and Social Login

The application supports the structure for:

- Google OAuth
- Facebook OAuth
- GitHub OAuth

Passport.js is used to manage OAuth authentication strategies.

### Session Management

Express sessions are used with Passport to support OAuth session management.

---

## 2. Authorization Patterns

### Role-Based Access Control (RBAC)

Users are assigned roles:

- user
- moderator
- admin

Each role has different permissions.

### Permission-Based Access

The application defines permissions such as:

- user:read
- user:write
- user:delete
- product:read
- product:write
- product:delete
- order:read
- order:write
- order:delete
- admin:access

### Ownership

Users can be restricted to accessing resources that belong to them.

Administrators can access resources without ownership restrictions.

### Role Hierarchy

Higher-level roles can have more permissions.

For example:

`user → moderator → admin`

---

## 3. Security Best Practices

### Password Security

Passwords should:

- Be at least 8 characters long
- Contain uppercase letters
- Contain lowercase letters
- Contain numbers
- Contain special characters
- Be hashed before storage

### Token Security

JWT tokens should:

- Have an expiration time
- Use a strong secret key
- Be sent using HTTPS in production
- Be protected from unauthorized access

### Input Validation

User input should be validated before processing to reduce invalid or malicious requests.

### Rate Limiting

Authentication endpoints should use rate limiting to reduce brute-force attacks.

### Audit Logging

Authentication and authorization errors should be logged so security-related events can be monitored.

---

## 4. Authentication Flow

1. User registers with name, email and password.
2. Password is validated.
3. Password is hashed using bcrypt.
4. User account is created.
5. Access and refresh tokens are generated.
6. Client uses the access token for protected API requests.
7. Server verifies the JWT.
8. User role and permissions are checked.
9. Refresh token can be used to obtain a new access token.

---

## 5. RBAC Flow

1. User authenticates.
2. JWT identifies the user and role.
3. RBAC middleware checks the user's role.
4. Permission middleware checks required permissions.
5. Ownership checks can restrict access to user-owned resources.
6. Unauthorized requests receive a `403 Forbidden` response.