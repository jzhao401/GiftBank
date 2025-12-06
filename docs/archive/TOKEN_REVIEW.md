# Bearer Token Review - GiftBank Authentication Flow

## 🔍 Current Token Usage Analysis

### Session Storage Keys Used

| Component | Key Used | Value Stored |
|-----------|----------|--------------|
| Registration | `token` | JWT authtoken from backend |
| Login | `token` | JWT authtoken from backend |
| Login | `bearer-token` | ❌ READ but NEVER SET |
| Profile | `token` | JWT authtoken (read only) |

## ⚠️ ISSUES FOUND

### Issue 1: Unused `bearer-token` Reference in Login
**Location:** `LoginPage.js` line 19
```javascript
const bearerToken = sessionStorage.getItem('bearer-token'); // ❌ NEVER SET ANYWHERE
```

**Problem:** 
- This variable is defined but never used
- It checks for 'bearer-token' but registration/login store as 'token'
- Dead code that doesn't affect functionality but is confusing

**Impact:** Low - Variable is unused, no functional impact

---

### Issue 2: Inconsistent Token Storage Keys
**Current State:**
- ✅ Registration stores: `token`
- ✅ Login stores: `token`
- ✅ Profile reads: `token`
- ❌ Login also reads: `bearer-token` (but never sets it)

**Problem:** Inconsistency creates confusion

---

### Issue 3: Bearer Token Format in Headers
**Current Implementation:**

| Endpoint | Header Format | Correct? |
|----------|--------------|----------|
| Profile GET | `Authorization: Bearer ${token}` | ✅ Correct |
| Profile PUT | `Authorization: Bearer ${token}` | ✅ Correct |

**Backend Handling:**
```javascript
// GET /profile
const authtoken = req.headers.authorization?.replace('Bearer ', '');
// ✅ Correctly strips "Bearer " prefix
```

✅ **This is CORRECT!** The backend properly handles Bearer token format.

---

## ✅ What's Working Correctly

### 1. Token Storage (Registration)
```javascript
// RegistrationPage.js
sessionStorage.setItem('token', data.authtoken);  // ✅ Stores token
sessionStorage.setItem('name', firstName);        // ✅ Stores name
sessionStorage.setItem('email', email);           // ✅ Stores email
```

### 2. Token Storage (Login)
```javascript
// LoginPage.js
sessionStorage.setItem('token', data.authtoken);   // ✅ Stores token
sessionStorage.setItem('name', data.userName);     // ✅ Stores name
sessionStorage.setItem('email', data.userEmail);   // ✅ Stores email
```

### 3. Token Usage in Profile
```javascript
// Profile.js - GET profile
const authtoken = sessionStorage.getItem("token");  // ✅ Reads correct key
headers: {
  'Authorization': `Bearer ${authtoken}`,           // ✅ Correct format
  'Email': email,
}

// Profile.js - PUT update
headers: {
  "Authorization": `Bearer ${authtoken}`,           // ✅ Correct format
  "Content-Type": "application/json",
  "Email": email,
}
```

### 4. Backend Token Verification
```javascript
// Backend - authRoutes.js
const authtoken = req.headers.authorization?.replace('Bearer ', '');
// ✅ Correctly strips Bearer prefix
jwt.verify(authtoken, JWT_SECRET);
// ✅ Properly verifies token
```

---

## 🔧 Recommended Fixes

### Fix 1: Remove Unused `bearer-token` Variable
**File:** `giftlink-frontend/src/components/LoginPage/LoginPage.js`

**Current Code (lines 18-23):**
```javascript
const navigate = useNavigate();
const { setIsLoggedIn } = useAppContext();
const bearerToken = sessionStorage.getItem('bearer-token'); // ❌ Remove this

useEffect(() => {
  if (sessionStorage.getItem('token')) {  // ✅ This is correct
    navigate('/');
  }
}, [navigate])
```

**Fixed Code:**
```javascript
const navigate = useNavigate();
const { setIsLoggedIn } = useAppContext();
// Removed unused bearerToken variable

useEffect(() => {
  if (sessionStorage.getItem('token')) {  // ✅ Already correct
    navigate('/');
  }
}, [navigate])
```

### Fix 2: Registration Should Store Full Name
**File:** `giftlink-frontend/src/components/RegistrationPage/RegistrationPage.js`

**Current Code (line 36):**
```javascript
sessionStorage.setItem('name', firstName);  // ❌ Only stores first name
```

**Fixed Code:**
```javascript
sessionStorage.setItem('name', `${firstName} ${lastName}`);  // ✅ Full name
```

---

## 📊 Authentication Flow Summary

### Registration Flow
```
1. User fills form
2. POST /api/auth/register
   Body: { firstName, lastName, email, password }
3. Backend creates JWT token
4. Response: { authtoken, email }
5. Frontend stores:
   - sessionStorage.token = authtoken
   - sessionStorage.name = firstName lastName  ⚠️ Currently only firstName
   - sessionStorage.email = email
6. Navigate to home page
```

### Login Flow
```
1. User enters credentials
2. POST /api/auth/login
   Body: { email, password }
3. Backend verifies and creates JWT
4. Response: { authtoken, userName, userEmail }
5. Frontend stores:
   - sessionStorage.token = authtoken      ✅
   - sessionStorage.name = userName        ✅
   - sessionStorage.email = userEmail      ✅
6. Navigate to home page
```

### Profile Fetch Flow
```
1. User navigates to /profile
2. Component reads token and email from sessionStorage ✅
3. GET /api/auth/profile
   Headers:
   - Authorization: Bearer <token>         ✅
   - Email: <email>                        ✅
4. Backend:
   - Strips "Bearer " prefix               ✅
   - Verifies JWT token                    ✅
   - Fetches user from MongoDB             ✅
5. Response: { name, email, firstName, lastName }
6. Frontend updates display and sessionStorage
```

### Profile Update Flow
```
1. User edits name
2. Frontend splits name into firstName/lastName ✅
3. PUT /api/auth/update
   Headers:
   - Authorization: Bearer <token>         ✅
   - Email: <email>                        ✅
   Body: { firstName, lastName }           ✅
4. Backend:
   - Strips "Bearer " prefix               ✅
   - Verifies JWT                          ✅ (should add this!)
   - Updates MongoDB                       ✅
5. Response: { authtoken }
6. Frontend updates sessionStorage
```

---

## ⚠️ Additional Security Issue Found

### Issue 4: PUT /update Doesn't Verify JWT Token
**File:** `giftlink-backend/routes/authRoutes.js`

**Current Code:**
```javascript
router.put("/update", async (req, res) => {
  // Gets email from header but doesn't verify JWT! ❌
  const emailHeader = req.headers["email"];
  // No JWT verification here!
```

**Should Be:**
```javascript
router.put("/update", async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    // ADD JWT VERIFICATION
    const authtoken = req.headers.authorization?.replace('Bearer ', '');
    const emailHeader = req.headers["email"];
    
    if (!authtoken || !emailHeader) {
      logger.error("Missing auth credentials");
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Verify JWT token
    try {
      jwt.verify(authtoken, JWT_SECRET);
    } catch (err) {
      logger.error("Invalid token");
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    
    // Continue with update...
```

---

## 📝 Summary of Token Usage

### ✅ CORRECT
1. Token stored as `sessionStorage.token` (consistent)
2. Bearer format in headers: `Authorization: Bearer <token>`
3. Backend strips "Bearer " prefix correctly
4. Profile GET endpoint verifies JWT ✅
5. Token format and usage is standard OAuth2/JWT practice

### ⚠️ NEEDS FIXING
1. Remove unused `bearer-token` variable in LoginPage
2. Registration should store full name (firstName + lastName)
3. PUT /update endpoint should verify JWT token ⚠️ SECURITY ISSUE

### 📊 Token Key Consistency
| Storage Key | Usage |
|------------|-------|
| `token` | ✅ Used everywhere consistently |
| `bearer-token` | ❌ Never set, only read once (unused) |
| `name` | ✅ Used for display |
| `email` | ✅ Used for API calls |

---

## 🔧 Files to Modify

1. **LoginPage.js** - Remove unused `bearer-token` line
2. **RegistrationPage.js** - Store full name instead of just firstName
3. **authRoutes.js** - Add JWT verification to PUT /update endpoint

---

## ✅ Verification Checklist

After fixes:
- [ ] No unused `bearer-token` references
- [ ] Registration stores full name in sessionStorage
- [ ] PUT /update verifies JWT token
- [ ] All endpoints use consistent `token` key
- [ ] Bearer format used correctly in all API calls
- [ ] Backend strips "Bearer " correctly
- [ ] Token verification works on all protected endpoints
