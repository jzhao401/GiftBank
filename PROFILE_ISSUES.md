# Profile Component Issues and Fixes

## Issues Found

### 1. **Profile Doesn't Fetch from MongoDB** ⚠️ CRITICAL
**Problem:** Profile.js only reads from sessionStorage, never queries the database.

**Impact:**
- Data lost on page refresh
- No way to sync profile across devices/tabs
- User changes not reflected after login

**Current Code** (`Profile.js` lines 28-43):
```javascript
const fetchUserProfile = async () => {
  try {
    const authtoken = sessionStorage.getItem("token");
    const email = sessionStorage.getItem("email");
    const name = sessionStorage.getItem("name");
    if (name || authtoken) {
      const storedUserDetails = {
        name: name,
        email: email,
      };
      setUserDetails(storedUserDetails);
      setUpdatedDetails(storedUserDetails);
    }
  } catch (error) {
    console.error(error);
  }
};
```

**Fix Required:**

#### Backend: Add GET /api/auth/profile endpoint
File: `giftlink-backend/routes/authRoutes.js`

```javascript
// Add this new endpoint
router.get("/profile", async (req, res) => {
  try {
    const authtoken = req.headers.authorization?.replace('Bearer ', '');
    const email = req.headers.email;
    
    if (!authtoken || !email) {
      logger.error("Missing auth credentials for profile fetch");
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Verify JWT token
    const decoded = jwt.verify(authtoken, JWT_SECRET);
    
    // Connect to database
    const db = await connectToDatabase();
    const collection = db.collection("users");
    
    // Find user
    const user = await collection.findOne({ email });
    
    if (!user) {
      logger.error("User not found in database");
      return res.status(404).json({ error: "User not found" });
    }

    // Return user profile
    res.json({
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    });
    
  } catch (error) {
    logger.error("Profile fetch error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});
```

#### Frontend: Update fetchUserProfile function
File: `giftlink-frontend/src/components/Profile/Profile.js`

```javascript
const fetchUserProfile = async () => {
  try {
    const authtoken = sessionStorage.getItem("token");
    const email = sessionStorage.getItem("email");
    
    if (!authtoken || !email) {
      navigate("/login");
      return;
    }

    // Fetch from backend instead of just sessionStorage
    const response = await fetch(`${urlConfig.backendUrl}/api/auth/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authtoken}`,
        'Email': email,
      },
    });

    if (response.ok) {
      const data = await response.json();
      setUserDetails({
        name: data.name,
        email: data.email,
      });
      setUpdatedDetails({
        name: data.name,
        email: data.email,
      });
      
      // Update sessionStorage with fresh data
      sessionStorage.setItem("name", data.name);
    } else {
      // Token might be expired or invalid
      console.error("Failed to fetch profile");
      navigate("/login");
    }
  } catch (error) {
    console.error("Error fetching profile:", error);
    navigate("/login");
  }
};
```

---

### 2. **Update Payload Format Mismatch** ⚠️ HIGH
**Problem:** Profile.js sends `{ name: "Full Name" }` but backend expects `{ firstName: "...", lastName: "..." }`.

**Current Code** (`Profile.js` line 63):
```javascript
const payload = { ...updatedDetails }; // Contains { name: "John Doe", email: "..." }
```

**Backend expects** (`authRoutes.js` lines 147-149):
```javascript
if (req.body.firstName) updateFields.firstName = req.body.firstName;
if (req.body.lastName) updateFields.lastName = req.body.lastName;
```

**Fix:** Update handleSubmit in Profile.js

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const authtoken = sessionStorage.getItem("token");
    const email = sessionStorage.getItem("email");

    if (!authtoken || !email) {
      navigate("/login");
      return;
    }

    // Split name into firstName and lastName
    const nameParts = updatedDetails.name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const payload = {
      firstName,
      lastName,
    };

    const response = await fetch(`${urlConfig.backendUrl}/api/auth/update`, {
      method: 'PUT',
      headers: {
        "Authorization": `Bearer ${authtoken}`,
        "Content-Type": "application/json",
        "Email": email,
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      setUserName(updatedDetails.name);
      sessionStorage.setItem("name", updatedDetails.name);
      setUserDetails(updatedDetails);
      setEditMode(false);
      setChanged("Name Changed Successfully!");
      setTimeout(() => {
        setChanged("");
        navigate("/");
      }, 1000);
    } else {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update profile");
    }
  } catch (error) {
    console.error(error);
    alert(`Failed to update profile: ${error.message}`);
  }
};
```

---

### 3. **Missing Error Feedback** ⚠️ MEDIUM
**Problem:** No user-visible error messages when profile operations fail.

**Fix:** Added alert() in the catch block above.

---

### 4. **Session Storage Key Consistency** ✓ VERIFIED
**Status:** Keys are consistent:
- Registration/Login set: `token`, `name`, `email`
- Profile.js reads: `token`, `name`, `email`
- ✓ No issues found

---

## Environment Configuration

### Current Setup (Local Testing)
```bash
# giftlink-backend/envs
MONGO_URL="mongodb://127.0.0.1:27017"
JWT_SECRET="setasecret"
```

### Production Setup (Kubernetes)
```bash
# giftlink-backend/envs
MONGO_URL="mongodb://mongodb-service:27017"
JWT_SECRET="setasecret"
```

MongoDB service defined in: `Deploy/deploymongo.yml`
- Service name: `mongodb-service`
- NodePort: `30008`
- Internal port: `27017`

---

## Testing

### Prerequisites
1. **Start MongoDB locally:**
   ```bash
   mongod --dbpath /path/to/data
   ```

2. **Start Backend:**
   ```bash
   cd giftlink-backend
   npm install
   npm start
   ```

3. **Start Frontend:**
   ```bash
   cd giftlink-frontend
   npm install
   npm start
   ```

### Run Integration Test
```bash
cd testing
npm install
npm run test:profile
```

The test will:
1. ✓ Check MongoDB connection (127.0.0.1:27017)
2. ✓ Check backend connection (localhost:3060)
3. ✓ Register a test user
4. ✓ Login with test user
5. ✓ Verify user in MongoDB database
6. ✓ Update user profile
7. ✓ Verify update in database
8. ✗ Try to fetch profile (will fail - endpoint doesn't exist yet)

### Manual Testing
1. Register new user
2. Login
3. Click "Profile" in navbar
4. Verify name and email display
5. Click "Edit"
6. Change name
7. Click "Save"
8. Check if name updates in navbar
9. Refresh page - name should persist (will FAIL without fixes)

---

## Summary

### Critical Issues (Must Fix)
1. ✗ Add GET /api/auth/profile endpoint to backend
2. ✗ Update Profile.js fetchUserProfile() to fetch from backend
3. ✗ Fix handleSubmit() to split name into firstName/lastName

### Current Status
- ✓ Backend update endpoint works correctly
- ✓ MongoDB connection configured (local + kubernetes)
- ✓ Session storage keys are consistent
- ✗ Profile doesn't fetch from database
- ✗ Update payload format mismatch

### Priority
1. **HIGH**: Add profile fetch endpoint (without this, profile breaks on refresh)
2. **HIGH**: Fix update payload format (name split)
3. **MEDIUM**: Add error handling and user feedback

### Files to Modify
1. `giftlink-backend/routes/authRoutes.js` - Add GET /profile endpoint
2. `giftlink-frontend/src/components/Profile/Profile.js` - Fix fetchUserProfile() and handleSubmit()

---

## Deployment Notes

When deploying to Kubernetes:
1. Update `giftlink-backend/envs`:
   ```bash
   MONGO_URL="mongodb://mongodb-service:27017"
   ```

2. MongoDB is deployed via `Deploy/deploymongo.yml`

3. Backend connects to MongoDB using service name (DNS resolution in K8s)

4. All components use `envs` files for consistency
