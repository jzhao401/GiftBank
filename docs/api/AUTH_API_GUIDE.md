# Authentication & Registration API Guide

Base URL: `https://zhao401-3060.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai`

## 🔐 Authentication Endpoints

### 1. Register New User

**Endpoint:** `POST /api/auth/register`

**Request:**
```bash
curl -X POST https://zhao401-3060.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "yourpassword",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**Response (Success - 200):**
```json
{
  "authtoken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "user@example.com"
}
```

**Response (Duplicate - 400):**
```json
{
  "error": "User already exists"
}
```

---

### 2. Login

**Endpoint:** `POST /api/auth/login`

**Request:**
```bash
curl -X POST https://zhao401-3060.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "yourpassword"
  }'
```

**Response (Success - 200):**
```json
{
  "authtoken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userName": "John Doe",
  "userEmail": "user@example.com"
}
```

**Response (Wrong Password - 404):**
```json
{
  "error": "Invalid credentials"
}
```

**Response (User Not Found - 400):**
```json
{
  "error": "User not found"
}
```

---

### 3. Get User Profile

**Endpoint:** `GET /api/auth/profile`

**Headers Required:**
- `authorization: Bearer <token>`
- `email: user@example.com`

**Request:**
```bash
curl https://zhao401-3060.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/api/auth/profile \
  -H "authorization: Bearer YOUR_TOKEN_HERE" \
  -H "email: user@example.com"
```

**Response (Success - 200):**
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response (Unauthorized - 401):**
```json
{
  "error": "Unauthorized - Missing token or email"
}
```

**Response (Invalid Token - 401):**
```json
{
  "error": "Invalid or expired token"
}
```

---

### 4. Update User Profile

**Endpoint:** `PUT /api/auth/update`

**Headers Required:**
- `authorization: Bearer <token>`
- `email: user@example.com`
- `Content-Type: application/json`

**Request (Update Name):**
```bash
curl -X PUT https://zhao401-3060.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/api/auth/update \
  -H "authorization: Bearer YOUR_TOKEN_HERE" \
  -H "email: user@example.com" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith"
  }'
```

**Request (Update Password):**
```bash
curl -X PUT https://zhao401-3060.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/api/auth/update \
  -H "authorization: Bearer YOUR_TOKEN_HERE" \
  -H "email: user@example.com" \
  -H "Content-Type: application/json" \
  -d '{
    "password": "newpassword123"
  }'
```

**Request (Update Both):**
```bash
curl -X PUT https://zhao401-3060.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/api/auth/update \
  -H "authorization: Bearer YOUR_TOKEN_HERE" \
  -H "email: user@example.com" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "password": "newpassword123"
  }'
```

**Response (Success - 200):**
```json
{
  "authtoken": "NEW_JWT_TOKEN_HERE"
}
```

**Note:** Always use the new token returned after update!

---

## 🔒 Security Features

### Password Hashing
- Passwords are hashed using **bcrypt** with salt (rounds: 10)
- Plain text passwords are never stored
- Hashes are compared during login

### JWT Tokens
- **Algorithm:** HS256 (HMAC with SHA-256)
- **Expiration:** 1 hour
- **Payload:** Contains user ID
- **Secret:** Stored in environment variable

### Token Validation
- All protected endpoints require valid JWT
- Tokens are validated before processing requests
- Expired tokens are rejected

### Duplicate Prevention
- Email uniqueness enforced
- Registration checks for existing users
- Returns appropriate error messages

---

## 🧪 Complete Test Workflow

### Run Automated Test Script:
```bash
./test-auth.sh
```

This tests all 12 scenarios:
1. ✅ Register new user
2. ✅ Reject duplicate registration
3. ✅ Login with correct credentials
4. ✅ Reject wrong password
5. ✅ Reject non-existent user
6. ✅ Get profile with auth
7. ✅ Reject profile without auth
8. ✅ Update profile name
9. ✅ Verify update
10. ✅ Update password
11. ✅ Login with new password
12. ✅ Reject old password

---

## 📋 Manual Testing Steps

### Step 1: Register
```bash
curl -X POST https://zhao401-3060.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "firstName": "Test",
    "lastName": "User"
  }' | jq .
```
Save the `authtoken` from response.

### Step 2: Login
```bash
curl -X POST https://zhao401-3060.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }' | jq .
```

### Step 3: Get Profile
```bash
# Replace YOUR_TOKEN with actual token
curl https://zhao401-3060.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/api/auth/profile \
  -H "authorization: Bearer YOUR_TOKEN" \
  -H "email: test@example.com" | jq .
```

### Step 4: Update Profile
```bash
curl -X PUT https://zhao401-3060.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/api/auth/update \
  -H "authorization: Bearer YOUR_TOKEN" \
  -H "email: test@example.com" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Updated",
    "lastName": "Name"
  }' | jq .
```

---

## 🎯 Expected Behaviors

### Registration
| Scenario | Status | Response |
|----------|--------|----------|
| New user | 200 | Token + email |
| Duplicate email | 400 | "User already exists" |
| Missing fields | 500 | Error message |

### Login
| Scenario | Status | Response |
|----------|--------|----------|
| Valid credentials | 200 | Token + user info |
| Wrong password | 404 | "Invalid credentials" |
| User not found | 400 | "User not found" |
| Missing fields | 500 | Error message |

### Get Profile
| Scenario | Status | Response |
|----------|--------|----------|
| Valid token | 200 | User profile |
| No token | 401 | "Unauthorized" |
| Invalid token | 401 | "Invalid or expired token" |
| Expired token | 401 | "Invalid or expired token" |

### Update Profile
| Scenario | Status | Response |
|----------|--------|----------|
| Valid update | 200 | New token |
| No auth | 401 | "Unauthorized" |
| User not found | 404 | "User not found" |

---

## 🔑 Token Management

### Getting a Token
1. **Register:** Returns token immediately
2. **Login:** Returns token on successful login

### Using a Token
Include in header as:
```
authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Expiration
- Tokens expire after **1 hour**
- Must login again to get new token
- Profile updates return new token

### Refreshing Token
- Update profile (even with no changes) to get new token
- Or simply login again

---

## 🐛 Troubleshooting

### "User already exists"
- Email is already registered
- Use different email or login instead

### "Invalid credentials"
- Password is incorrect
- Check password spelling/case

### "User not found"
- Email not registered
- Register first or check email spelling

### "Unauthorized"
- Missing authorization header
- Missing email header
- Include both headers in request

### "Invalid or expired token"
- Token has expired (> 1 hour old)
- Token is malformed
- Get new token by logging in

### 500 Internal Server Error
- Check MongoDB is running
- Check backend logs for details
- Verify all required fields are provided

---

## 💡 Tips

1. **Save Your Token:** After registration/login, save the token for subsequent requests
2. **Token Expiry:** Tokens expire in 1 hour, you'll need to login again
3. **Headers Matter:** Profile and update endpoints require both `authorization` and `email` headers
4. **New Token on Update:** Always use the new token returned after profile update
5. **Test Script:** Use `./test-auth.sh` for comprehensive testing
6. **jq Tool:** Install `jq` for pretty JSON output: `brew install jq`

---

## 📊 Database Collection

Users are stored in the `users` collection with this structure:

```javascript
{
  _id: ObjectId("..."),
  email: "user@example.com",
  firstName: "John",
  lastName: "Doe",
  password: "$2a$10$hashed_password_here",
  createdAt: ISODate("2024-11-15T10:30:00Z"),
  updatedAt: ISODate("2024-11-15T12:00:00Z")
}
```

---

## ✅ Success Criteria

Your authentication system is working if:
- ✅ New users can register
- ✅ Duplicate emails are rejected
- ✅ Users can login with correct credentials
- ✅ Wrong passwords are rejected
- ✅ Tokens are generated and validated
- ✅ Profile can be retrieved with valid token
- ✅ Profile can be updated
- ✅ Passwords are hashed in database
- ✅ Tokens expire after 1 hour
- ✅ Unauthorized requests are blocked
